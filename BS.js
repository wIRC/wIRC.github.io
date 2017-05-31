var BS = {
    cid: 0, //first ID must be 1
    logs: null,
    servers: {},
    eventHandlers: [],
    variables: {},
    scriptAliases: {},
    onLoad: function () {
        //init
        BS.UI.updateStyle();
        BS.logs = new BSLogger();
        BS.plogs = new BSPLogger();
        setInterval(function () { BS.plogs.store(); }, 30000);
        //restore state
        var active;
        var state = BS.sets.get('state');
        if (state) {
            BS.log('Restoring state:', state);
            if (state.variables) BS.variables = state.variables;
            for (var i = 0; i < state.servers.length; i++) {
                var serverState = state.servers[i];
                var server = new BSServer(serverState.hostname, serverState.port,
                    {
                        nick: serverState.nick,
                        login: serverState.login,
                        network: serverState.network,
                        password: serverState.password
                    }
                );
                for (var j = 0; j < serverState.chans.length; j++) server.addChan(serverState.chans[j]);
                for (var j = 0; j < serverState.queries.length; j++) server.addQuery(serverState.queries[j]);
                if (serverState.active) active = server.getWindow(serverState.active);
            }
        }
        //restore editbox history //FIXME: won't work well when there are more than one connection to the same network
        var editboxHistory = BS.sets.get('editboxHistory');
        for (var wid in BSWindow.windows) {
            var win = BSWindow.windows[wid];
            var history = editboxHistory[win.server.network] && editboxHistory[win.server.network][win.label];
            if (history) win.editbox.history = history;
        }

        //server from URL
        //<url>#nick,#chan1,#chan2,...,#chanN
        var regs = location.hash.match(/^#?(.+)$/);
        if (regs) {
            location.hash = '';
            BS.log('Loading URL params: ' + regs[1]);
            var chans = [], nick, hostname, port;
            var tokens = regs[1].split(',');
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                var matches;
                if (matches = token.match(/^(.+?(?:\..+?)+)(?::(\+\d+))?$/)) {
                    console.log(matches);
                    hostname = matches[1];
                    if (matches[2]) port = matches[2];
                }
                else if (/^#/.test(token)) chans.push(token);
                else nick = token;
            }

            //we won't connect again if there is a similar connection (from the saved state)
            var similarConnFound = false;
            for (var i in BS.servers) {
                if ((!nick || BS.servers[i].nick == nick) && ((hostname || BSConf.hostname) == BS.servers[i].hostname)) {
                    for (var j = 0; j < chans.length; j++) {
                        if (!BS.servers[i].getChan(chans[j])) BS.servers[i].addChan(chans[j]);
                    }
                    similarConnFound = true;
                    break;
                }
            }
            if (!similarConnFound) {
                var server = new BSServer(hostname, port);
                for (var i = 0; i < chans.length; i++) server.addChan(chans[i]);
                if (nick) server.nick = nick;
            }
        }

        //default server
        if (!BS.cid) {
            BS.log('Loading default server.');
            var server = new BSServer();
            for (var i = 0; i < BSConf.chans.length; i++) server.addChan(BSConf.chans[i]);
        }

        //restore active window
        if (active) active.select();

        //connect
        MB.init();

        //clean unused logs (delayed for 30s)
        setTimeout(function (){ BS.logs.clean(); }, 30000);

        //automatically copy selected text and focus editbox
        document.getElementById('scrollbox').addEventListener("click", function () {
            document.execCommand('copy');
            BSWindow.active.editbox.focus();
        });

        document.getElementById('scrollbox').addEventListener("dblclick", function () {
            var active = BSWindow.active;
            if (BS.util.isChanName(active.label)) {
                active.server.alias('MODE ' + active.label);
                active.server.alias('MODE ' + active.label + ' +b');
            }
            else active.server.alias('WHOIS ' + active.label);
        });

        document.addEventListener("dblclick", function (e) {
            var user = e.target.getAttribute('data-user');
            var chan = e.target.getAttribute('data-chan');
            if (user) {
                BSWindow.active.server.alias('QUERY', user);
            }
            if (chan) {
                BSWindow.active.server.alias('JOIN', chan);
            }
        });

        document.addEventListener("click", function (e) {
            if (e.target.tagName != 'OPTION') {
                var user = e.target.getAttribute('data-user');
                if (user) {
                    var nicklist = BSWindow.active.nicklist;
                    if (nicklist) {
                        var options = nicklist.element.options;
                        for (var i = 0; i < options.length; i++) {
                            options[i].selected = options[i].getAttribute('data-user') == user;
                        }
                    }
                }
            }
        });

        // settings window
        var settingsButton = document.getElementById("settingsButton");
        var closeButton = document.getElementsByClassName("closeButton")[0];
        var setsFontSize = document.getElementById('setsFontSize');
        var setsFontSizeValue = document.getElementById('setsFontSizeValue');
        var setsShowEmbeds = document.getElementById('setsShowEmbeds');

        var sets = BS.sets.get('sets') || {};
        if (!sets.userScript) sets.userScript = '';
        if (!sets.fontSize) sets.fontSize = '';
        if (sets.showEmbeds === undefined) sets.showEmbeds = true;
        var applyUserScript = function (userScript) {
            if (!userScript) return BS.eventHandlers[0] = null;
            try {
                var code = `(function (e) {
                    var server = this;
                    var vars = e;
                    var $$ = function (str) { server.eval(str, e); };
                    ${BSParser.parseProgramSource(userScript)}
                })`;
                BS.log('Compiled UserScript:', code);
                BS.eventHandlers[0] = eval(code);
                // call load and start event on first server
                for (var i in BS.servers) {
                    BS.servers[i].event('LOAD');
                    BS.servers[i].event('START');
                    break;
                }
                return null;
            } catch (e) { BS.log('Error on userScript:', e); return e; }
        };
        applyUserScript(sets.userScript);
        settingsButton.onclick = function() {
            document.getElementById('userScript').value = sets.userScript;
            setsFontSizeValue.innerHTML = setsFontSize.value = sets.fontSize;
            setsShowEmbeds.checked = sets.showEmbeds;
            var downloadBackup = document.getElementById('downloadBackup');
            downloadBackup.href = BS.sets.backup();
            BS.UI.modal.show('settings');
        };
        var settingOkButtonCallback = function (close) {
            var userScript = document.getElementById('userScript').value;
            var error = applyUserScript(userScript);
            if (!error || confirm('Error on userscript:\n\n' + error.valueOf()+'\n\nSave anyway?')) {
                sets.userScript = userScript;
                sets.fontSize = setsFontSize.value;
                sets.showEmbeds = setsShowEmbeds.checked;
                BS.sets.set('sets', sets);
                BS.UI.updateStyle();
                if (close) BS.UI.modal.hide('settings');
            }
        };
        document.getElementById('settingsOkButton').addEventListener('click', function () { settingOkButtonCallback(true); });
        document.getElementById('settingsApplyButton').addEventListener('click', function () { settingOkButtonCallback(); });
        document.getElementById('settingsCancelButton').addEventListener('click', function () {
            BS.UI.modal.hide('settings');
        });
        document.getElementById('userScript').placeholder = `Use JavaScript syntax
The code here will be called for every event.
Available objects:
    * e: The Event (contains: e.type, e.nick, e.chan, etc)
    * server: The Server (contains: server.call, server.ident, etc)
    * $$('<mIRC syntax>'): Evaluates mIRC scripting syntax.
You can also use mIRC scripting syntax (limited support).

Example:
if (e.type == 'TEXT' && e.text == 'hi') $$('timer 1 1 msg # Hi $nick!');
on *:text:*bye*:#: msg # bye bye $nick!
alias hi say Hi $1-!
`;

        document.getElementById('restoreBackup').addEventListener('change', function (e) {
            var f = e.target.files[0];
            if (f) {
                if (confirm('Restoring settings from: \''+ f.name +'\'\nWarning: This will replace current settings.')) {
                    var r = new FileReader();
                    r.onload = function (e) {
                        var contents = e.target.result;
                        try {
                            BS.sets.restore(contents);
                            alert('The settings were restored from the file.');
                        } catch (e) {
                            alert("Error: " + e.message);
                        }
                    };
                    r.readAsText(f);
                }
                //e.target.type = ''; // clear selected file
                //e.target.type = 'file';
            }
        }, false);



        document.getElementById('downloadLogs').addEventListener('click', function () {
            if (confirm("After the download the logs will be deleted.")) {
                BSPLogger.prototype.download();
            }
        });

        setsFontSize.addEventListener('input', function () {
            setsFontSizeValue.innerHTML = setsFontSize.value;
        });

        addEventListener("beforeunload", BS.onUnload);

        addEventListener("keydown", function (e) {
            // F12
            if (e.keyCode == 123 && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                var server = BSWindow.active.server;
                if (server.away) server.alias('AWAY');
                else {
                    var reason = prompt('Away reason?', 'Not here.');
                    if (reason !== null) server.alias('AWAY ' + reason);
                }
                e.preventDefault();
            }
        });

        // call start event on first server
        for (var i in BS.servers) {
            BS.servers[i].event('START');
            break;
        }

    },
    onUnload: function () {
        for (var i in BS.servers) BS.servers[i].alias('DISCONNECT');
        MB.disconnect();
        BS.logs.saveAll();
        BS.logs.store();
        BS.sets.saveEditboxHistory();
        BS.sets.saveState();
        BS.plogs.store();
    },
    log: console.log.bind(console, 'BS'),
    sets: {
        get: function (name) {
            try {
                return JSON.parse(localStorage.getItem(name));
            } catch (e) {
                BS.log('JSON error: ', e);
                return null;
            }
        },
        set: function (name, value) {
            try {
                localStorage.setItem(name, JSON.stringify(value));
            } catch (e) {
                BS.log('JSON error: ', e);
            }
        },
        rem: function (name) {
            localStorage.removeItem(name);
        },
        getLogin: function (server, login) {
            var logins = BS.sets.get('logins');
            return logins && logins[server] && logins[server][login];
        },
        saveLogin: function (server, login, pass) {
            var logins = BS.sets.get('logins') || {};
            if (!logins[server]) logins[server] = {};
            logins[server][login] = pass;
            BS.sets.set('logins', logins);
        },
        saveEditboxHistory: function () {
            var editboxHistory = {};
            for (var wid in BSWindow.windows) {
                var win = BSWindow.windows[wid];
                var network = win.server.network;
                if (!editboxHistory[network]) editboxHistory[network] = {};
                editboxHistory[network][win.label] = win.editbox.history;
            }
            BS.sets.set('editboxHistory', editboxHistory);
        },
        saveState: function () {
            var servers = [];
            for (var i in BS.servers) {
                var server = BS.servers[i];
                var serverState = {};
                if (BSWindow.active.server == server) serverState.active = BSWindow.active.label;
                serverState.nick = server.nick;
                serverState.chans = [];
                for (var i in server.chans) serverState.chans.push(server.chans[i].name);
                //serverState.chans = BS.util.getObjectKeys(server.chans);
                serverState.queries = BS.util.getObjectKeys(server.queries);
                serverState.hostname = server.hostname;
                serverState.port = server.port;
                serverState.login = server.login;
                serverState.network = server.network;
                serverState.password = server.password;
                servers.push(serverState);
            }
            BS.sets.set('state', {servers: servers, variables: BS.variables});
        },
        backup: function () {
            var sets = {};
            for (var i in localStorage) {
                if (localStorage.hasOwnProperty(i)) {
                    sets[i] = /^plogs_/.test(i) ? localStorage.getItem(i) : BS.sets.get(i);
                }
            }
            var file = new File([JSON.stringify(sets)], "wIRC-backup.json", {type: 'application/json'});
            return URL.createObjectURL(file);
        },
        restore: function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) { throw new Error('The provided file is not a valid JSON file.'); }
            for (var i in data) BS.sets.set(i, data[i]);
        }
    },
    raws: {
        getWindow: function (raw) {
            if (/00[1-5]|042|25[1-5]|265|266|353|366|372|375|376|396|464|error/i.test(raw)) return 'Status';
            return null;
        }
    },
    theme: {
        prefixColor: function (prefix) {
            switch (prefix) {
                case '': return '';
                case '~': return '4';
                case '@': return '7';
                case '%': return '11';
                case '+': return '3';
            }
            return '';
        },
        prefix: function (prefix) {
            var color = BS.theme.prefixColor(prefix);
            if (color) return '' + color + prefix;
            return prefix;
        },
        action: function (prefix, nick, text) {
            return '07! ' + BS.theme.prefix(prefix) + '15' + nick + ' ' + text;
        },
        away: function (nick, reason) {
            return '15o Away: 07' + nick + ' 15is ' + (reason ? 'away: 07' + reason : 'no longer away');
        },
        highlight: function (chan, nick, text) {
            return (chan ? '07[15' + chan + '07] ' : '') + '07(15' + nick + '07) ' + text;
        },
        msg: function (prefix, nick, text) {
            return BS.theme.prefix(prefix) + '15' + nick + '07 ' + text;
            //return '07(' + BS.theme.prefix(prefix) + '15' + nick + '07) ' + text;
        },
        msgSelf: function (prefix, nick, text) {
            return BS.theme.prefix(prefix) + '00' + nick + '07 ' + text;
            //return '07(' + BS.theme.prefix(prefix) + '00' + nick + '07) ' + text;
        },
        nick: function (nick, newnick) {
            return '15o Nick: 07' + nick + ' 15is now known as 07' + newnick;
        },
        join: function (nick, mask, chan) {
            return '15o Join: 07' + nick + ' (15' + mask + '07)15 has joined 07' + chan;
        },
        joinMe: function (nick, mask, chan) {
            return '15o 15Now talking on07 ' + chan + '';
        },
        kick: function (nick, knick, chan, text) {
            return '15o Kick: 07' + knick + ' 15 was kicked by 07' + nick + '15 from 07' + chan + ' (' + text + '07)';
        },
        part: function (nick, chan, text) {
            return '15o Part: 07' + nick + ' 15has left 07' + chan + ' (15' + text + '07)';
        },
        quit: function (nick, text) {
            return '15o Quit: 07' + nick + ' 15has left IRC: ' + text;
        },
        'raw.332': function (topic) {
            return '15o 07Topic15: ' + topic;
        },
        'raw.333': function (nick, time) {
            return '15o 07Set by15: ' + nick + ' 07on15: ' + BSIdent.prototype.asctime(time);
        },
        timestamp: function (clock) {
            return '15' + clock + '07| ';
        },
        mode: function (nick, modes) {
            return '15o Mode: 07' + nick + ' 15sets mode07: ' + modes;
        },
        notice: function (chan, prefix, nick, text) {
            return '15-07' + prefix + nick + (chan ? '15:07' + chan : '') + '15- ' + text;
        },
        topic: function (nick, topic) {
            return '15o Topic: 07' + nick + ' 15changed topic to07: ' + topic;
        },
        usermode: function (modes) {
            return '15o Usermode: ' + modes;
        }
    },/*
    mts: {
        theme: {
            'RAW.001': '<pre><c2> <text>'
        },
        parse: function (name) {
            BS.mts.parsed[name] || (BS.mts.parsed[name] = (function () {
                var source = BS.mts.theme[name];

            }));
        },
        parsed: {}
    },*/
    UI: {
        beep: function () { document.getElementById("beep").play(); },
        echo: function (text, win, params) {
            if (!params) params = {"t": ""};
            //add timestamp
            if ('t' in params) text = BSIdent.prototype.timestamp() + text;

            (win || BSWindow.active).addLine(text);
        },
        flash: {
            oldTitle: "",
            newTitle: "",
            status: false,
            timer: 0,
            endTime: 0,
            perform: function (text, duration) {
                BS.UI.flash.endTime = duration ? Date.now() + duration : 0;
                var flash = BS.UI.flash;
                if (!flash.status) flash.oldTitle = document.title;
                flash.status = true;
                flash.newTitle = text;
                flash.start();
            },
            start: function () {
                var flash = BS.UI.flash;
                if (document.visibilityState == 'visible' || (BS.UI.flash.endTime && Date.now() > BS.UI.flash.endTime)) {
                    BS.UI.flash.cancel();
                }
                else {
                    document.title = flash.newTitle;
                    clearTimeout(flash.timer);
                    flash.timer = setTimeout(flash.end, 1000);
                }
            },
            end: function () {
                var flash = BS.UI.flash;
                clearTimeout(flash.timer);
                flash.timer = setTimeout(flash.start, 1000);
                document.title = flash.oldTitle;
            },
            cancel: function () {
                var flash = BS.UI.flash;
                if (!flash.status) return;
                clearTimeout(flash.timer);
                document.title = flash.oldTitle;
                flash.status = false;
            }
        },
        highlight: {
            search: function (server, text, nick, chan) {
                var reg = new RegExp('\\b(' + escapeRegExp(server.ident.me()) + ')(?![a-z0-9_\\-\\[\\]\\\\^{}|`])','i');
                if (text.match(reg)) {
                    //text = '<u class="hl">'+text+'</u>';
                    BS.UI.highlight.perform(server, text, nick, chan);
                    text = text.replace(reg, '07$115');
                }
                return text;
            },
            perform: function (server, text, nick, chan) {
                //change switchbar colour
                server.switchbar.highlight(chan || nick);


                //echo in highlight window
                if (!server.getWindow('@highlight')) server.alias('WINDOW @highlight');
                server.alias('ECHO', '@highlight', BS.theme.highlight(chan, nick, text));


                if (document.visibilityState != 'visible') {
                    //beep
                    BS.UI.beep();

                    //flash
                    BS.UI.flash.perform(chan ? nick + ' mentioned in ' + chan : nick + ' says: ' + text);

                    //desktop notification
                    BS.UI.notification.perform((chan ? '[' + chan + '] ' : '') + '(' + nick + '): ' + text);
                }
            }
        },
        modal: {
            input: function (prompt, callback) {
                BS.UI.modal.show('input');
                var OKButton = document.getElementById('modalOkButton');
                var cancelButton = document.getElementById('modalCancelButton');
                document.getElementById('modalPrompt').innerText = prompt;
                OKButton.focus();
                var OKClick = function () {
                    OKButton.removeEventListener('click', OKClick);
                    BS.UI.modal.hide('input');
                    callback(true);
                };
                var cancelClick = function () {
                    OKButton.removeEventListener('click', cancelClick);
                    BS.UI.modal.hide('input');
                    callback(false);
                };
                OKButton.addEventListener('click', OKClick);
                cancelButton.addEventListener('click', cancelClick);
                BS.UI.modal.show('input');
            },
            show: function (id) {
                var modal = document.getElementById('modal');
                modal.style.display = "block";
                var content = document.getElementById("modal-" + id);
                content.style.display = "block";
            },
            hide: function (id) {
                var modal = document.getElementById('modal');
                modal.style.display = "none";
                var content = document.getElementById("modal-" + id);
                content.style.display = "none";
            }

        },
        notification: {
            perform: function (title) {
                BS.UI.notification.withPermission(function () {
                    var notification = new Notification(title);
                    notification.onclick = function() { focus(); };
                    setTimeout(notification.close.bind(notification), 4000);
                });
            },
            withPermission: function (cb) {
                if (window.Notification && Notification.permission != 'denied') {
                    if (Notification.permission == 'granted') cb();
                    else {
                        Notification.requestPermission(function (permission) {
                            if (permission == 'granted') cb();
                        });
                    }
                }
            }
        },
        updateLag: function () {
            var active = BSWindow.active;
            document.getElementById("lag").innerHTML = 'Lag: ' + MB.lag + '/' + (active.server.lag ? active.server.lag : '-') + ' ms';
        },
        updateStyle: function () {
            var styleObj = document.getElementById('style');
            var sets = BS.sets.get('sets') || {};
            var fontSize = Number(sets.fontSize);
            style.innerHTML = '';
            if (fontSize) style.innerHTML += 'body { font-size: ' + fontSize + 'px; }\n';
            if (!sets.showEmbeds) style.innerHTML += '.embed { display: none; }\n';
        },
        updateTitle: function () {
            var active = BSWindow.active, title = active.label, chan = null;
            if (active.label == 'Status') title = active.server.network + ' ' + active.server.ident.me();
            else if (chan = active.server.getChan(active.label)) {
                title += ' [' + chan.nicks.length + ']';
                if (chan.topic) title += ': ' + BS.util.ircformat(chan.topic);
            }
            document.getElementById("title").innerHTML = '<span>' + title + '</span>';
        }
    },
    util: {
        allServers: function (cb) {
            for (var i in BS.servers) cb(BS.servers[i]);
        },
        applyMode: function (mode, text) {
            var regs, chan, nicks;
            if (regs = text.match(/^(#[^ ]+) (.+)$/)) {
                chan = regs[1];
                nicks = regs[2];
            }
            else {
                chan = BSWindow.active.label;
                nicks = text;
            }
            return chan + ' ' + mode[0] + (new Array(nicks.split(' ').length + 1)).join(mode[1]) + ' ' + nicks;
        },
        htmlEntities: function (str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        clock: function () {
            var addLeadingZero = function (i) { return (i < 10 ? '0' + i : i); };
            var time = new Date();
            return addLeadingZero(time.getHours()) + ':' + addLeadingZero(time.getMinutes()) + ':' + addLeadingZero(time.getSeconds());
        },
        isChanName: function (text) { return /^#/.test(text); },
        prefixLevel: function (server, prefix) {
            var prefixes = server.ident.prefixChars();
            return prefix ? prefixes.indexOf(prefix) : prefixes.length;
        },
        //time
        time: function () {
            return Math.round(new Date().getTime()) / 1000;
        },
        //trim
        trim: function (str) {
            return str.replace(/(^[ \r\n]+|[ \r\n]+$)/g, '');
        },
        //random number
        rand: function (min, max) {
            min = Number(min);
            max = Number(max);
            return Math.round(Math.random() * (max - min) + min);
        },
        ircformat: function (str) {
            //b k i r o u
            if (!str) return "";

            // embeds
            var matches;
            var embed = '';
            if (matches = str.match(/(https?:\/\/i\.imgur\.com\/[^.]+)\.gifv/i)) {
                embed = '<video width="400" height="225" src="' + matches[1] + '.mp4" controls="controls" loop="" preload="metadata"></video>';
            }
            else if (matches = str.match(/https?:\/\/[^ ]+\.(?:jpe?g|png|gif)/i)) {
                embed = '<a href="' + matches[0] + '" target="_blank"><img src="' + matches[0] + '" /></a>';
            }
            else if ((matches = str.match(/https?:\/\/(?:[^.]+)\.youtube\.com\/watch\?v=([^ ]+)/i)) || (matches = str.match(/https?:\/\/youtu\.be\/([^ ]+)/i))) {
                embed = '<iframe width="400" height="225" src="https://www.youtube.com/embed/' + matches[1] + '" frameborder="0" allowfullscreen></iframe>';
            }
            else if (matches = str.match(/https?:\/\/[^ ]+\.(?:mp4)/i)) {
                embed = '<video width="400" height="225" src="' + matches[0] + '" controls="controls" loop="" preload="metadata"></video>';
            }

            str = str.replace(/([^]+)(?:(?=)||$)/g, '<u class="b">$1</u>');
            str = str.replace(/([^]+)(?:(?=)||$)/g, '<u class="u">$1</u>');
            str = str.replace(/([^]+)(?:(?=)||$)/g, '<u class="i">$1</u>');
            str = str.replace(/(https?:\/\/)([^ <]+\/?)\b/ig, function (match, p1, p2) {
                // html is already sanitized
                return '<a target="_blank" href="' + match + '">' + match + '</a>';
                //return '<a target="_blank" href="'+ p1 + p2.replace(/[a-z]/ig, function (match) { return '%' + parseInt(match.charCodeAt(0)).toString(16); }) +'">' + match + '</a>';

                //var a = document.createElement('a');
                //a.setAttribute('target', 'blank');
                //a.setAttribute('href', match);
                //a.appendChild(document.createTextNode(match));
                //return a.outerHTML;
            });
            str = str.replace(/(1[0-5]|0?\d)(?:,(1[0-5]|0?\d))?([^]+)(?:(?=|)|$)/g, function (match, c, bc, text) {
                return '<u class="c' + Number(c) + (bc ? ' ' + 'bc' + Number(bc) : '') + '">' + text + '</u>';
            });
            str = str.replace(/|/g, '');

            if (embed) str += '<u class="embed">' + embed + '</u>';

            return str;
        },
        getObjectKeys: function (obj) {
            var result = [];
            for (var i in obj) result.push(i);
            return result;
        },
        prependChan: function (text) {
            return (text.match(/^#/) ? '' : BSWindow.active.label + ' ') + text;
        }
    }
};

function BSServer(hostname, port, init) {
    if (!hostname) {
        hostname = BSConf.hostname;
        port = BSConf.port;
    }
    else if (!port) port = '6667';
    this.me = null;
    this.nick = (BSConf.nick || (
            function () {
                var domain = hostname.split('.').slice(-2, -1)[0];
                return domain.slice(0, 1).toUpperCase() + domain.slice(1, 4).toLowerCase();
            }
        )()) + BS.util.rand(10000, 99999);
    this.password = '';
    this.chans = {};
    this.queries = {};
    this.windows = {};
    this.raws = {};
    this.status = 3; // 0 - connecting, 1 - connected, 2 - disconnecting, 3 - disconnected
    this.lastInputTime = Date.now();
    this.prefix = {prefix: '(yqaohv)!~&@%+', modes: 'yqaohv', chars: '!~&@%+'};
    this.hostname = hostname;
    this.port = port;
    this.network = hostname;
    this.usermode = '';
    this.login = ''; // current NickServ login
    this.loggingIn = false;
    BS.servers[this.cid = ++BS.cid] = this;
    // after default values, load custom values
    if (init) for (var i in init) if (init[i] !== undefined) this[i] = init[i];
    // now that everything is set:
    this.ident = new BSIdent(this);
    this.switchbar = new BSSwitchbar(this);
    this.proc = new BSProc(this);
    this.win = new BSWindow('Status', this);
}
BSServer.prototype.addChan = function (chan) {
    if (chan) return this.chans[chan.toLowerCase()] = new BSChan(chan, new BSWindow(chan, this));
};
BSServer.prototype.addQuery = function (nick) {
    this.queries[nick.toLowerCase()] = new BSQuery(nick, new BSWindow(nick, this));
};
BSServer.prototype.renameQuery = function (nick, newnick) {
    var query = this.queries[newnick.toLowerCase()] = this.queries[nick.toLowerCase()];
    delete(this.queries[nick.toLowerCase()]);
    query.rename(newnick);
};
BSServer.prototype.alias = function () {
    var args = Array.prototype.slice.call(arguments).join(" ").split(" ");
    var alias = args.shift();
    var text = args.join(' ');
    var tokens = text.split(' ');
    this.event('ALIAS', {alias: alias, text: text, tokens: tokens});
};
BSServer.prototype.call = function (text) {
    var words = String(text).split(' ');
    this.alias(words[0].toUpperCase(), words.slice(1).join(' '));
};
BSServer.prototype.close = function () {
    BS.log('Closing server window...');
    this.alias('DISCONNECT');
    this.switchbar.destroy();
    delete(BS.servers[this.cid]);
};
// evaluates mIRC code
BSServer.prototype.eval = function (code, vars) {
    var parsedCode = BSParser.parseStatementSource(code);
    BS.log('Eval: ', parsedCode);
    return eval(`(function (server, vars) { ${parsedCode} })`).call(this, this, vars);
};
// evaluates all identifiers in mIRC command
BSServer.prototype.evalCommand = function (code, vars) {
    var parsedCode = BSParser.parseCommandSource(code);
    BS.log('EvalCommand: ', parsedCode);
    return eval(`(function (server, vars) { return ${parsedCode}; })`).call(this, this, vars);
};
BSServer.prototype.applyIdent = function (name, args, vars) {
    if (vars && vars[name]) return vars[name];
    name = name.toLowerCase().replace('server', 'serverIdent').replace(/^\$/, '');
    //BS.log('ApplyIdent: ', name, args, vars);
    if (name == 'js') {
        return eval(args[0]);
    }
    if (!this.ident[name]) {
        BS.log('No such identifier:', name);
        return "";
    }
    return this.ident[name].apply(this.ident, args);
};
BSServer.prototype.event = function (type, data, e) {
    this.onEvent(new BSEvent(type, data, e));
};
BSServer.prototype.getChan = function (label) {
    return label && this.chans[label.toLowerCase()];
};
BSServer.prototype.getChanUser = function (chan, label) {
    var chan = this.getChan(chan);
    return chan && chan.users[label.toLowerCase()];
};
BSServer.prototype.getQuery = function (label) {
    return label && this.queries[label.toLowerCase()];
};
BSServer.prototype.getWindow = function (label) {
    return label && this.windows[label.toLowerCase()];
};
BSServer.prototype.onEvent = function (e) {
    for (var i = 0; i < BS.eventHandlers.length; i++) {
        if (BS.eventHandlers[i]) {
            try { BS.eventHandlers[i].call(this, e); }
            catch (e) { BS.log('Error on eventHandler[' + i + ']:', e); }
        }
    }
    BS.log('event:', e.type, e);
    if (e.haltdef) return;
    e.theme = [];
    switch (e.type) {
        case 'ALIAS': {
            new BSAlias(this, e.alias, e.text, e.tokens);
            break;
        }
        case 'CTCP': {
            var tokens = e.text.split(' ');
            switch (tokens[0]) {
                case 'VERSION': {
                    this.alias('CTCPREPLY', e.nick + ' VERSION ' + this.ident.version());
                    break;
                }
                case 'PING': {
                    this.alias('CTCPREPLY', e.nick + ' PING ' + tokens[1]);
                    break;
                }
            }
            this.alias('ECHO', 'CTCP from ' + e.nick + ': ' + e.text);
            break;
        }
        case 'CTCPREPLY': {
            var tokens = e.text.split(' ');
            switch (tokens[0]) {
                case 'PING': {
                    this.alias('ECHO', 'Ping reply from ' + e.nick + ': ' + (Date.now() - Number(tokens[1])) + ' ms');
                    break;
                }
            }
            this.alias('ECHO', 'CTCPREPLY from ' + e.nick + ': ' + e.text);
            break;
        }
        case 'DISCONNECT': {
            this.status = 3;
            var msg = '* Disconnected' + (e.text ? ': ' + e.text : '');
            this.alias('ECHO', 'Status', msg);
            for (var i in this.windows) if (/^#/.test(i)) BS.UI.echo(msg, this.getWindow(i));
            this.win.button.element.value = 'Status';
            break;
        }
        case 'JOIN': {
            var chan = e.chan, nick = e.nick, mask = e.mask;
            if (nick == this.ident.me()) {
                var chanObj = this.getChan(chan);
                if (!chanObj) {
                    this.addChan(chan);
                    this.alias('ECHO', chan, '7——————————————————————————— 1-15— ——— 1-14—— — 1——14—');
                    this.alias('ECHO', chan, BS.theme.joinMe(nick, mask, chan));
                    this.alias('ECHO', chan, '7——————————————————————————— 1-15— ——— 1-14—— — 1——14—');
                }
                else chanObj.showTopic = false;
            }
            else {
                this.getChan(chan).addUser(nick);
                BS.UI.updateTitle();
                this.alias('ECHO', chan, BS.theme.join(nick, mask, chan));
            }
            break;
        }
        case 'KICK': {
            var nick = e.nick, knick = e.knick, chan = e.chan, text = e.text;
            this.alias('ECHO', chan, BS.theme.kick(nick, knick, chan, text));
            if (knick == this.ident.me()) {
                this.alias('JOIN', chan);
            }
            this.getChan(chan).remUser(knick);
            break;
        }
        case 'PART': {
            var nick = e.nick, chan = e.chan, text = e.text;
            if (nick == this.ident.me()) {
                if (this.getChan(chan)) this.remChan(chan);
            }
            else {
                this.alias('ECHO', chan, BS.theme.part(nick, chan, text));
                this.getChan(chan).remUser(nick);
            }
            break;
        }
        case 'QUIT': {
            var nick = e.nick, text = e.text;
            for (var chan in this.chans) {
                if (this.getChanUser(chan, nick)) {
                    this.alias('ECHO', chan, BS.theme.quit(nick, text));
                    this.chans[chan].remUser(nick);
                }
            }
            if (this.getQuery(nick)) this.alias('ECHO', nick, BS.theme.quit(nick, text));
            break;
        }
        case 'TOPIC': {
            var chan = e.chan, topic = e.topic, nick = e.nick;
            this.alias('ECHO', chan, BS.theme.topic(nick, topic));
            this.getChan(chan).topic = topic;
            BS.UI.updateTitle();
            break;
        }
        case 'NICK': {
            var nick = e.nick, newnick = e.newnick;
            if (nick == this.ident.me()) this.setMe(newnick);
            for (var chan in this.chans) {
                if (this.getChanUser(chan, nick)) {
                    this.alias('ECHO', chan, BS.theme.nick(nick, newnick));
                    this.getChan(chan).repUser(nick, newnick);
                }
            }
            // update query window
            var query = this.getQuery(nick);
            if (query) this.renameQuery(nick, newnick);
            break;
        }
        case 'CONNECT': {
            this.status = 1;
            if (this.login) {
                var pass = BS.sets.getLogin(this.hostname, this.login);
                if (pass) {
                    this.alias('RAW', 'NICKSERV IDENTIFY ' + (this.login != this.ident.me() ? this.login + ' ' : '') + pass);
                    this.loggingIn = true;
                }
            }
            if (this.loggingIn) {
                var server = this;
                setTimeout(function () {
                    if (server.loggingIn) {
                        server.loggingIn = false;
                        BS.log('Login timeout, joining channels anyway.');
                        server.joinChans();
                    }
                }, 2000);
            }
            else this.joinChans();
            break;
        }
        case 'RAW': {
            var prefix = e.prefix, command = e.command, params = e.params || '', trailing = e.trailing || '', paramsall = params + ' ' + trailing;
            switch (command) {
                case 'JOIN': {
                    this.event('JOIN', {chan: trailing || params.word(1), nick: this.ident.unmask(prefix, 1), mask: this.ident.gettok(prefix, 2, 33)}, e);
                    e.mute = true;
                    break;
                }
                case 'KICK': {
                    this.event('KICK', {chan: this.ident.gettok(params, 1, 32), nick: this.ident.gettok(params, 2, 32), text: trailing}, e);
                    e.mute = true;
                    break;
                }
                case 'PART': {
                    this.event('PART', {chan: params.word(1), nick: this.ident.unmask(prefix, 1), text: trailing}, e);
                    e.mute = true;
                    break;
                }
                case 'PING': {
                    this.alias('RAW', 'PONG ' + trailing);
                    e.mute = true;
                    break;
                }
                case 'QUIT': {
                    this.event('QUIT', {nick: this.ident.unmask(prefix, 1), text: trailing}, e);
                    e.mute = true;
                    break;
                }
                case 'TOPIC': {
                    this.event('TOPIC', {nick: this.ident.unmask(prefix, 1), chan: params, topic: trailing}, e);
                    e.mute = true;
                    break;
                }
                case 'MODE': {
                    var tokens = params.split(' ');
                    var target = tokens[0];
                    if (target.match(/^(#[^ ]+)/)) {
                        var modelists = tokens[1].match(/[\+\-]\w+/g);
                        if (modelists) {
                            var modepars = tokens.slice(2);
                            var chanmodes = (this.raws['005'] && this.raws['005']['CHANMODES'] && this.raws['005']['CHANMODES'].split(',')) ||
                                'IXYbeg,k,FHJLfjl,ABCMNOPQRSTcimnprstz';
                            for (var i = 0; i < modelists.length; i++) {
                                var modelist = modelists[i];
                                var modeop = modelist[0];
                                for (var j = 1; j < modelist.length; j++) {
                                    var mode = modelist[j];
                                    var modepos = this.ident.prefixModes().indexOf(mode);
                                    if (modepos) {
                                        var modepar = modepars.shift();
                                        var user = this.getChanUser(target, modepar || '');
                                        if (user) {
                                            if (modeop == '+') {
                                                var curPrefixChar = user.prefix;
                                                var newPrefixChar = this.ident.prefixChars()[this.ident.prefixModes().indexOf(mode)];
                                                if (BS.util.prefixLevel(this, newPrefixChar) < BS.util.prefixLevel(this, curPrefixChar)) {
                                                    this.getChanUser(target, modepar).prefix = newPrefixChar;
                                                    this.getWindow(target).nicklist.update();
                                                }
                                            }
                                            else {
                                                user.prefix = '';
                                                this.getWindow(target).nicklist.update();
                                            }
                                        }
                                        this.event('MODE', {nick: prefix, modeop: modeop, mode: mode, modepar: modepar}, e);

                                    }
                                    else if (chanmodes[0].indexOf(mode) ||
                                        chanmodes[1].indexOf(mode) ||
                                        (modeop == '+' && chanmodes[2].indexOf(mode))) {
                                        var modepar = modepars.shift();
                                        this.event('MODE', {modeop: modeop, mode: mode, modepar: modepar}, e);
                                    }
                                    else this.event('MODE', {modeop: modeop, mode: mode}, e);
                                }
                            }
                        }
                        else BS.log('error parsing mode: ' + tokens[1]);
                        this.alias('ECHO', target, BS.theme.mode(prefix, tokens.words(1)));
                    }
                    else this.alias('ECHO', 'Status', BS.theme.usermode(params));
                    e.mute = true;
                    break;
                }
                case 'NICK': {
                    this.event('NICK', {nick: this.ident.unmask(prefix, 1), newnick: params.word(0)}, e);
                    e.mute = true;
                    break;
                }
                case 'NOTICE': {
                    if (regs = trailing.match(/^([^ ]+)(?: (.+))?$/)) {
                        this.event('CTCPREPLY', {ctcpreply: regs[1].toUpperCase(), text: regs[2]}, e);
                    }
                    else {
                        this.event('NOTICE', {nick: this.ident.unmask(prefix, 1), chan: this.getChan(params) && params, text: trailing}, e);
                    }
                    e.mute = true;
                    break;
                }
                case 'PRIVMSG': {
                    this.event('PRIVMSG', {nick: this.ident.unmask(prefix, 1), target: params, chan: this.getChan(params) && params}, e);
                    e.mute = true;
                    break;
                }
                case '001': {
                    this.setMe(params.word(0));
                    this.event('CONNECT', {}, e);
                    e.theme = [['Status', trailing]];
                    break;
                }
                case '002': e.theme = [['Status', trailing]]; break;
                case '003': e.theme = [['Status', trailing]]; break;
                case '004': e.theme = [['Status', params.words(1)]]; break;
                case '005': {
                    if (!this.raws['005']) this.raws['005'] = {};
                    var pairs = params.split(' ');
                    pairs.shift();
                    for (var i = 0; i < pairs.length; i++) {
                        var regs = pairs[i].match(/^([^=]+)(?:=(.*))?$/);
                        this.raws['005'][regs[1]] = regs[2];
                    }
                    //update server.prefix
                    if (this.raws['005']['PREFIX']) {
                        var match = this.raws['005']['PREFIX'].match(/(?:\((.+)\))?(.+)/);
                        this.prefix = {prefix: match[0], modes: match[1], chars: match[2]};
                    }
                    if (this.raws['005']['NETWORK']) this.setNetwork(this.raws['005']['NETWORK']);
                    e.theme = [['Status', 'Protocols supported by this server: ' + params.words(1)]];
                    break;
                }
                case '042': e.theme = [['Status', 'Unique ID: ' + params.words(1)]]; break;
                case '251': e.theme = [['Status', trailing]]; break;
                case '252': e.theme = [['Status', params.words(1) + ' ' + trailing]]; break;
                case '253': e.theme = [['Status', params.words(1) + ' ' + trailing]]; break;
                case '254': e.theme = [['Status', params.words(1) + ' ' + trailing]]; break;
                case '255': e.theme = [['Status', trailing]]; break;
                case '265': e.theme = [['Status', trailing]]; break;
                case '266': e.theme = [['Status', trailing]]; break;
                case '301': {
                    var nick = params.word(1), reason = trailing, inChannel = false;
                    var message = BS.theme.away(nick, reason);
                    /*for (var chan in this.chans) {
                        if (this.getChanUser(chan, nick)) {
                            this.alias('ECHO', chan, message);
                            inChannel = true;
                        }
                    }*/
                    if (!inChannel) this.alias('ECHO', message);
                    e.mute = true;
                    break;
                }
                case '305': {
                    e.theme = [[trailing]];
                    this.away = false;
                    break;
                }
                case '306': {
                    e.theme = [[trailing]];
                    this.away = true;
                    break;
                }
                case '311': {
                    this.alias('ECHO', '7——————————————————————————— 1-15— ——— 1-14—— — 1——14—');
                    this.alias('ECHO', '15o07 /Whois15: ' + params.word(1) + '07!15' + params.word(2) + '07@15' + params.word(3) + ' 07(15' + trailing + '07)');
                    this.alias('ECHO', '7——————————————————— 1-15— ——— 1-14—— — 1——14—');
                    e.mute = true;
                    break;
                }
                case '312': {
                    this.alias('ECHO', '15o 07Server: ' + params.word(2) + ' 07(15' + trailing + '07)');
                    e.mute = true;
                    break;
                }
                case '317': {
                    this.alias('ECHO', '15o 07Idle15: ' + durationLong(Number(params.word(2))) + '');
                    if (params.word(3)) this.alias('ECHO', '15o 07Signed on15: ' + BSIdent.prototype.asctime(params.word(3)));
                    e.mute = true;
                    break;
                }
                case '318': {
                    this.alias('ECHO', '7——————————————————————————— 1-15— ——— 1-14—— — 1——14—');
                    e.mute = true;
                    break;
                }
                case '319': {
                    this.alias('ECHO', '15o 07Channels15: ' + trailing + ' 07(15' + trailing.split(' ').length + ' 07total)');
                    e.mute = true;
                    break;
                }
                case '321': {
                    e.mute = true;
                    if (!this.getWindow('@Channels')) this.alias('WINDOW @Channels');
                    else this.alias('CLEAR @Channels');
                    this.alias('ECHO', '@Channels', '* Updating list...');
                    this.channelList = [];
                    break;
                }
                case '322': {
                    e.mute = true;
                    var chan = params.word(1), users = Number(params.word(2)), topic = trailing;
                    this.channelList.push([chan, users, topic]);
                    break;
                }
                case '323': {
                    e.mute = true;
                    this.channelList.sort(function (a, b) { return a[1] < b[1] ? 1 : -1; });
                    if (!this.getWindow('@Channels')) this.alias('WINDOW @Channels');
                    else this.alias('CLEAR @Channels');
                    this.getWindow('@Channels').bufferLimit = Infinity;
                    for (var i = 0; i < this.channelList.length; i++) {
                        this.alias('ECHO', '@Channels', this.channelList[i].join("\t"));
                    }
                    this.channelList = null;
                    break;
                }
                case '330': {
                    this.alias('ECHO', '15o 07Login15: ' + params.word(2) + '');
                    e.mute = true;
                    break;
                }
                case '332': {
                    var chan = params.word(1), topic = trailing;
                    if (this.getChan(chan).showTopic) this.proc.raw332(chan, topic);
                    e.mute = true;
                    BS.UI.updateTitle();
                    break;
                }
                case '333': {
                    var chan = params.word(1), nick = params.word(2), time = params.word(3);
                    var chanObj = this.getChan(chan);
                    if (chanObj.showTopic) {
                        this.alias('ECHO', chan, BS.theme['raw.333'](nick, time));
                        this.alias('ECHO', chan, '7————————————————————————————————— 1-07— ——— 1-15—— — 1——14—— ——— 1--14—');
                        chanObj.showTopic = false;
                    }
                    e.mute = true;
                    break;
                }
                case '353': {
                    var chan = params.word(2), names = trailing.split(' ');
                    this.proc.raw353(chan, names);
                    break;
                }
                case '366': {
                    var chan = params.word(1);
                    this.proc.raw366(chan);
                    break;
                }
                case '367': {
                    e.theme = [[params.word(1), '15o Bans: 15 ' + params.word(2) + ' 07by 15' + params.word(3) + ' 07on 15' + BSIdent.prototype.asctime(params.word(4))]];
                    break;
                }
                case '378': {
                    var tokens = trailing.split(' ');
                    this.alias('ECHO', '15o 07Hostname15: ' + tokens[3] + ' 07IP15: ' + tokens[4] + '');
                    e.mute = true;
                    break;
                }
                case '379': {
                    var usermode = this.usermode = trailing.split(' ')[3];
                    this.alias('ECHO', '15o 07Usermodes15: ' + usermode + '');
                    e.mute = true;
                    break;
                }
                case '396': e.theme = [['Status', params.words(1) + ' ' + trailing]]; break;
                case '422': e.theme = [['Status', trailing]]; break;
                case '433': {
                    //fixme
                    var login = BS.sets.get('login');
                    if (login) {
                        var logins = BS.sets.get('logins');
                        var pass = logins[login];
                        if (pass) {
                            this.alias('RAW', 'NICKSERV GHOST ' + this.nick + ' ' + pass);
                        }
                    }
                    this.alias('RAW', 'NICK ' + this.nick + BS.util.rand(100, 999));
                    break;
                }
                case '495': {
                    var matches = e.trailing.match(/^You must wait (\d+) seconds/);
                    if (matches) setTimeout(function () { server.alias('JOIN', params.word(1)); }, Number(matches[1]) * 1000);
                    break;
                }
                case '671': {
                    this.alias('ECHO', '15o07 SSL15: Using a secure connection');
                    e.mute = true;
                    break;
                }
                case '900': e.theme = [['Status', trailing]]; break;
            }
            if (!e.mute && !e.theme.length) {
                this.alias('ECHO', BS.raws.getWindow(command), params.words(1) + ' ' + trailing);
            }
            break;
        }
        case 'MODE': {
            break;
        }
        case 'NOTICE': {
            var nick = e.nick, text = e.text, chan = e.chan;
            BS.UI.highlight.perform(this, text, nick, chan);

            var echo;
            if (/^ChanServ$/i.test(nick)) {
                var match = text.match(/^\[(#.+?)\] /);
                if (match) {
                    echo = match[1];
                }
            }
            else if (/^NickServ$/i.test(nick)) {
                if (/recognized/.test(text) && this.loggingIn) {
                    this.loggingIn = false;
                    this.joinChans();
                }
            }
            else if (/\.|^((Info|Host)Serv|Global)$/.test(nick)) echo = 'Status';

            this.alias('ECHO', echo, BS.theme.notice(chan, chan ? this.getChanUser(chan, nick).prefix : '', nick, text));
            break;
        }
        case 'PRIVMSG': {
            this.switchbar.newMsg(e.chan || e.nick);
            var regs;
            if (regs = e.trailing.match(/^([^ ]+)(?: (.+))?$/)) {
                if (/action/i.test(regs[1])) this.event('ACTION', {text: regs[2]}, e);
                this.event('CTCP', {ctcp: regs[1].toUpperCase(), text: regs[2]}, e);
            }
            else this.event('TEXT', {text: e.trailing}, e);
            break;
        }
        case 'TEXT': {
            var nick = e.nick, text = e.text, chan = e.chan;
            var match = text.match(/^\[(\d\d:\d\d:\d\d)\] (.+)$/), timestamp;
            if (match) {
                timestamp = BS.theme.time(match[1]);
                text = match[2];
            }
            else timestamp = BSIdent.prototype.timestamp();
            if (chan) {
                if (document.visibilityState != 'visible') BS.UI.flash.perform(chan + ' ' + nick + ' ' + text);
                var user = this.getChanUser(chan, nick), prefix = user ? user.prefix : '';
                if (nick == '*buffextras') {
                    var matches;
                    if (matches = text.match(/^(.+)!(.+) joined$/)) BS.UI.echo(timestamp + BS.theme.join(matches[1], matches[2]), this.getWindow(chan), {});
                    else if (matches = text.match(/^(.+)!(.+) quit with message: (.+)/)) BS.UI.echo(timestamp + BS.theme.quit(matches[1], matches[3]), this.getWindow(chan), {});
                    else BS.UI.echo(timestamp + BS.theme.msg(prefix, nick, BS.UI.highlight.search(this, text, nick, chan)), this.getWindow(chan), {});
                }
                else BS.UI.echo(timestamp + BS.theme.msg(prefix, nick, BS.UI.highlight.search(this, text, nick, chan)), this.getWindow(chan), {});
                var user = this.getChanUser(chan, nick);
                if (user) user.lastMessage = Date.now();
            }
            else {
                if (!this.getQuery(nick)) this.addQuery(nick);
                BS.UI.highlight.perform(this, text, nick);
                BS.UI.echo(timestamp + BS.theme.msg('', nick, text), this.getWindow(nick), {});
            }
            break;
        }
        case 'ACTION': {
            var nick = e.nick, text = e.text, chan = e.chan;
            if (chan) {
                this.alias('ECHO', chan, BS.theme.action(chan ? this.getChanUser(chan, nick).prefix : '', nick, BS.UI.highlight.search(this, text, nick, chan)));
            }
            else {
                if (!this.getQuery(nick)) this.addQuery(nick);
                BS.UI.highlight.perform(this, text, nick);
                this.alias('ECHO', nick, BS.theme.action('', nick, text));
            }
            break;
        }
    }
    if (!e.mute) {
        for (var i = 0; i < e.theme.length; i++) {
            this.alias.apply(this, ['ECHO'].concat(e.theme[i]));
        }
    }
    // callbacks after internal processing
    for (var i = 0; i < e.after.length; i++) e.after[i].call(this, e);
};
BSServer.prototype.joinChans = function () {
    var chans = BS.util.getObjectKeys(this.chans);
    if (chans.length) this.alias('RAW', 'JOIN ' + chans.join(','));
};
BSServer.prototype.remChan = function (chan) {
    this.getChan(chan).win.close();
    delete(this.chans[chan.toLowerCase()]);
};
BSServer.prototype.remQuery = function (nick) {
    this.getQuery(nick).win.close();
    delete(this.queries[nick.toLowerCase()]);
};
BSServer.prototype.setMe = function (me) {
    this.me = me;
    this.win.button.element.value = this.network + ' ' + this.me;
};
BSServer.prototype.setNetwork = function (network) {
    this.network = network;
    this.win.button.element.value = this.network + ' ' + this.me;
};


function BSAlias(server, alias, text, tokens) {
    this.server = server;
    this.alias = alias;
    this.text = text;
    this.tokens = tokens;
    //BS.log(this);
    var aliasName = alias.toLowerCase().replace('server', 'serverAlias');
    if (this[aliasName]){
        //BS.log('debug', alias.toLowerCase(), this[alias.toLowerCase()]);
        return this[aliasName]();

    }
    else if (BS.scriptAliases[aliasName]) BS.scriptAliases[aliasName].call(this.server, this.server, {text: text});
    else return server.alias('RAW ' + alias + ' ' + text);
}
BSAlias.prototype.describe = function () {
    var targets = this.tokens[0], text = this.tokens.words(1);
    this.server.alias('RAW', 'PRIVMSG ' + targets + ' :ACTION ' + text + '');
    targets = targets.split(',');
    for (var i = 0; i < targets.length; i++) {
        var chan = BS.util.isChanName(targets[i]) ? targets[i] : null;
        var nick = this.server.ident.me();
        this.server.alias('ECHO', targets[i], BS.theme.action(chan ? this.server.getChanUser(chan, nick).prefix : '', nick, text));
    }
};
BSAlias.prototype.action = BSAlias.prototype.describe;
BSAlias.prototype.ame = function () {
    this.server.alias('ACTION', this.server.ident.chans(), this.text);
};
BSAlias.prototype.amsg = function () {
    this.server.alias('MSG', this.server.ident.chans(), this.text);
};
BSAlias.prototype.beep = function () {
    var number = Number(this.tokens[0] || 1), delay = Number(this.tokens[1] || 0), time = - delay;
    BS.log(number, delay);
    if (delay) while (number--) setTimeout(BS.UI.beep, time += delay);
    else while (number--) BS.UI.beep();
};
BSAlias.prototype.chanserv = function () {
    this.server.alias('RAW', 'CHANSERV ' + this.tokens[0] + (/help/i.test(this.tokens[0]) ? '' : ' ' + BS.util.prependChan(this.tokens.words(1))));
};
BSAlias.prototype.cs = BSAlias.prototype.chanserv;
BSAlias.prototype.clear = function () {
    this.server.getWindow(this.tokens[0] ? this.tokens[0] : this.server.ident.active()).clear();
};
BSAlias.prototype.clearall = function () {
    for (i in BSWindow.windows) BSWindow.windows[i].clear();
};
BSAlias.prototype.ctcp = function () {
    this.server.alias('RAW', 'PRIVMSG ' + this.tokens[0] + ' :' + this.tokens[1].toUpperCase() + (this.tokens.length > 2 ? ' ' + this.tokens.words(2) : '') + '');
};
BSAlias.prototype.ctcpreply = function () {
    this.server.alias('RAW', 'NOTICE ' + this.tokens[0] + ' :' + this.tokens[1].toUpperCase() + (this.tokens.length > 2 ? ' ' + this.tokens.words(2) : '') + '');
};
BSAlias.prototype.dehalfop = function () {
    this.server.alias('MODE', BS.util.applyMode('-h', this.text));
};
BSAlias.prototype.deop = function () {
    this.server.alias('MODE', BS.util.applyMode('-o', this.text));
};
BSAlias.prototype.deprotect = function () {
    this.server.alias('MODE', BS.util.applyMode('-a', this.text));
};
BSAlias.prototype.devoice = function () {
    this.server.alias('MODE', BS.util.applyMode('-v', this.text));
};
BSAlias.prototype.disconnect = function () {
    this.server.alias('QUIT');
};
BSAlias.prototype.echo = function () {
    var win = this.server.getWindow(this.tokens[0]);
    if (win) BS.UI.echo(this.tokens.words(1), win);
    else BS.UI.echo(this.text);
};
BSAlias.prototype.ea = BSAlias.prototype.echo;
BSAlias.prototype.halfop = function () {
    this.server.alias('MODE', BS.util.applyMode('+h', this.text));
};
BSAlias.prototype.hop = function () {
    var chan = this.server.ident.active();
    this.server.alias('PART', chan);
    this.server.alias('JOIN', chan);
};
BSAlias.prototype.invite = function () {
    this.server.alias('RAW', 'INVITE ' + this.tokens[0] + ' ' + BS.util.prependChan(this.tokens.words(1)));
};
BSAlias.prototype.i = BSAlias.prototype.invite;
BSAlias.prototype.join = function () {
    this.server.alias('RAW', 'JOIN ' + this.text.replace(/^(?!#)/, '#'));
};
BSAlias.prototype.j = BSAlias.prototype.join;
BSAlias.prototype.kick = function () {
    this.server.alias('RAW', 'KICK ' + BS.util.prependChan(this.text));
};
BSAlias.prototype.k = BSAlias.prototype.kick;
BSAlias.prototype.me = function () {
    this.server.alias('ACTION', this.server.ident.active(), this.text);
};
BSAlias.prototype.mode = function () {
    this.server.alias('RAW', 'MODE ' + BS.util.prependChan(this.text));
};
BSAlias.prototype.msg = function () {
    var targets = this.tokens[0], text = this.tokens.words(1);
    this.server.alias('RAW', 'PRIVMSG ' + targets + ' :' + (/^\//.test(text) ? '/' : '') + text);
    targets = targets.split(',');
    for (var i = 0; i < targets.length; i++) {
        var chan = BS.util.isChanName(targets[i]) ? targets[i] : null;
        var nick = this.server.ident.me();
        var prefix = chan ? this.server.getChanUser(chan, nick).prefix : '';
        this.server.alias('ECHO', targets[i], BS.theme.msgSelf(prefix, nick, text));
    }
};
BSAlias.prototype.nick = function () {
    this.server.nick = this.tokens[0];
    this.server.alias('RAW', "NICK " + this.tokens[0]);
};
BSAlias.prototype.notice = function () {
    this.server.alias('RAW', 'NOTICE ' + this.tokens[0] + ' :' + this.tokens.words(1));
};
BSAlias.prototype.n = BSAlias.prototype.notice;
BSAlias.prototype.op = function () {
    this.server.alias('MODE', BS.util.applyMode('+o', this.text));
};
BSAlias.prototype.part = function () {
    this.server.alias('RAW', 'PART ' + BS.util.prependChan(this.text));
};
BSAlias.prototype.p = BSAlias.prototype.part;
BSAlias.prototype.ping = function () {
    this.server.alias('CTCP', this.tokens[0] + ' PING ' + Date.now());
};
BSAlias.prototype.protect = function () {
    this.server.alias('MODE', BS.util.applyMode('+a', this.text));
};
BSAlias.prototype.query = function () {
    var nick = this.tokens[0];
    var query = this.server.getQuery(nick);
    if (!query) this.server.addQuery(nick);
    else query.win.select();
};
BSAlias.prototype.q = BSAlias.prototype.query;
BSAlias.prototype.quit = function () {
    this.server.alias('RAW', 'QUIT :' + (this.text || this.server.ident.version()));
};
BSAlias.prototype.raw = function () {
    var regs;
    if (regs = this.text.match(/^(?:NS|NICKSERV|PRIVMSG NICKSERV :) ?([^ ]+)(?: (.+))?$/i)) {
        var logins = BS.sets.get('logins') || {};
        var cmd = regs[1];
        var args = regs[2] ? regs[2].split(' ') : [];
        switch (cmd.toLowerCase()) {
            case 'register':
                BS.sets.saveLogin(this.server.hostname, this.server.login = this.server.ident.me(), args[0]);
                break;
            case 'id':
            case 'identify':
                if (args.length == 1) BS.sets.saveLogin(this.server.hostname, this.server.login = this.server.ident.me(), args[0]);
                else BS.sets.saveLogin(this.server.hostname, this.server.login = args[0], args[1]);
                break;
            case 'logout':
                this.server.login = '';
                break;
        }
    }
    MB.raw(this.server, this.text);
};
BSAlias.prototype['return'] = function () { };
BSAlias.prototype.say = function () {
    this.server.alias('MSG', this.server.ident.active(), this.text);
};
BSAlias.prototype.serverAlias = function () {
    var regs = this.text.match(/([^ :]+)(?:[ :](\+?\d+)?)(?:[ :](.+))?/);
    if (regs) {
        var server = new BSServer(regs[1], regs[2], {password: regs[3]});
        MB.connect(server);
    }
    else this.server.alias('ECHO', '* /server: invalid parameters.');
};
BSAlias.prototype.s = BSAlias.prototype.serverAlias;
BSAlias.prototype.slap = function () {
    this.server.alias('ME', 'slaps ' + this.text + ' around a bit with a large trout');
};
BSAlias.prototype.timer = function () {
    var match = this.text.match(/^(?:-([cdeomhipr]) )?([\d\.]+) ([\d\.]+) (.+)$/);
    if (!match) this.server.alias('ECHO', '* /timer: invalid parameters.');
    else {
        var repetitions = Number(match[2]) || Infinity;
        var interval = Number(match[3]);
        var command = match[4];
        new BSTimer(this.server, repetitions, interval, command);
    }
};
BSAlias.prototype.topic = function () {
    this.server.alias('RAW', 'TOPIC ' + BS.util.prependChan(this.text));
};
BSAlias.prototype.version = function () {
    this.server.alias('CTCP', this.tokens[0] + ' VERSION');
};
BSAlias.prototype.voice = function () {
    this.server.alias('MODE', BS.util.applyMode('+v', this.text));
};
BSAlias.prototype.whois = function () {
    this.server.alias('RAW', 'WHOIS ' + (this.tokens.length == 1 ? this.text + ' ' + this.text : this.text));
};
BSAlias.prototype.w = BSAlias.prototype.whois;
BSAlias.prototype.window = function () {
    var regs = this.text.match(/^(?:-(a) )?(.+)/);
    var win = new BSWindow(regs[2], this.server);
    if (regs[1] != 'a') win.deselect();
};

function BSIdent(server) {
    this.server = server;
}
BSIdent.prototype.active = function () { return BSWindow.active.label; };
BSIdent.prototype['bs.input.nick'] = function (N, C, cmd) {
    this.server.call(cmd + ' ' + this.snicks());
};
BSIdent.prototype.address = function (nick, type) { // todo: get address
    return this.mask(nick + '!*@*', type);
};
BSIdent.prototype.asctime = function (N) { return String(new Date(Number(N) * 1000)).replace(/ GMT.+/, ''); };
BSIdent.prototype.chan = function (chan, prop) {
    switch (prop) {
        case 'topic': return this.server.getChan(chan).topic || '';
        case 'mode': return '';
        default: return this.active();
    }
};
BSIdent.prototype.chans = function () { return BS.util.getObjectKeys(this.server.chans).join(','); };
BSIdent.prototype.gettok = function (text,N,C) {
    return text.split(String.fromCharCode(Number(C)))[Number(N - 1)];
};
BSIdent.prototype.ignore = function () { return ''; };
BSIdent.prototype.input = function (promptText, options, title, text) {
    return prompt(promptText, text);
};
BSIdent.prototype.isfile = function () { return ''; };
BSIdent.prototype.left = function (text, N) { return text ? text.slice(- Number(N)) : ''; };
BSIdent.prototype.len = function (text) { return text.length; };
BSIdent.prototype.mask = function (address, type) { // todo: end implementation
    var match = address.match(/(.+)!(.+)@(.+)/);
    if (match) {
        switch (Number(type)) {
            case  0: return '*!' + match[2] + '@' + match[3];
            case  1: return '*!*' + match[2] + '@' + match[3];
            case  2: return '*!*@' + match[3];
            case  3: return '*!*' + match[2] + '@*' + match[3];
            case  4: return '*!*@*' + match[3];
            case  5: return match[1] + '!' + match[2] + '@' + match[3];
            case  6: return match[1] + '!*' + match[2] + '@' + match[3];
            case  7: return match[1] + '!*@' + match[3];
            case  8: return match[1] + '!*' + match[2] + '@*' + match[3];
            case  9: return match[1] + '!*@*' + match[3];
            case 10: return '*!' + match[2] + '@' + match[3];
            case 11: return match[1] + '!' + match[2] + '@' + match[3];
            case 12: return '*!*@' + match[3];
            case 13: return '*!*' + match[2] + '@*' + match[3];
            case 14: return '*!*@*' + match[3];
            case 15: return match[1] + '!' + match[2] + '@' + match[3];
            case 16: return match[1] + '!*' + match[2] + '@' + match[3];
            case 17: return match[1] + '!*@' + match[3];
            case 18: return match[1] + '!*' + match[2] + '@*' + match[3];
            case 19: return match[1] + '!*@*' + match[3];
        }
    }
    return address;
};
BSIdent.prototype.me = function () { return this.server.me; };
BSIdent.prototype.mklogfn = function () { return ''; };
BSIdent.prototype.network = function () { return this.server.network; };
BSIdent.prototype.nick = function () { //todo: implement
    return '';
};
BSIdent.prototype.nicks = function (chan) { return BS.chans[chan].nicks.join(','); };
BSIdent.prototype.notify = function () { return ''; };
BSIdent.prototype['null'] = function () { return ''; };
BSIdent.prototype.prefix = function () { console.log(this); return this.server.prefix.prefix; };
BSIdent.prototype.prefixModes = function () { return this.server.prefix.modes; };
BSIdent.prototype.prefixChars = function () { return this.server.prefix.chars; };
BSIdent.prototype.server = function () { return this.server.hostname; };
BSIdent.prototype.snick = function (chan, N) {
    var nicks = [];
    BS.log(this.server, chan, this.active());
    var options = this.server.getChan(chan || this.active()).win.nicklist.element.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) nicks.push(options[i].getAttribute('data-user'));
    }
    if (Number(N) == 0) return nicks.length;
    return nicks[Number(N) - 1];
};
BSIdent.prototype.snicks = function (chan) {
    var nicks = [];
    var options = this.server.getChan(chan || this.active()).win.nicklist.element.options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].selected) nicks.push(options[i].getAttribute('data-user'));
    }
    return nicks.join(',');
};
BSIdent.prototype.strip = function (text) { return text.replace(/(1[0-5]|0?[0-9](,(1[0-5]|0?[0-9]))?)?|[]/g, ''); };
BSIdent.prototype.style = function () { return ''; };
BSIdent.prototype.timestamp = function () { return BS.theme.timestamp(BS.util.clock()); };
BSIdent.prototype.unmask = function (mask, type) {
    var regs = mask.match(/(.+)!(.+)@(.+)/);
    return regs ? regs[type || 1] : mask;
};
BSIdent.prototype.usermode = function () { return this.server.usermode; };
BSIdent.prototype['+'] = function () {
    if (!arguments.length) return '$+';
    var args = Array.prototype.slice.call(arguments);
    return args.join('');
};
BSIdent.prototype.version = function () { return BSConf.version; };


function BSProc(server) {
    this.server = server;
}
BSProc.prototype.raw332 = function (chan, topic) {
    this.server.getChan(chan).topic = topic;
    this.server.alias('ECHO', chan, BS.theme['raw.332'](topic));
};
BSProc.prototype.raw353 = function (chan, names) {
    this.server.getChan(chan).addNames(names);
};
BSProc.prototype.raw366 = function (chan) {
    this.server.getChan(chan).namesUpdated = true;
    this.server.getChan(chan).win.nicklist.update();
};


function BSTimer(server, repetitions, interval, command) {
    this.server = server;
    this.repetitions = repetitions;
    this.interval = interval;
    this.command = command;
    var timer = this;
    this.timer = setTimeout(function () { timer.run(); }, this.interval * 1000);
}
BSTimer.prototype.run = function () {
    BS.log('this', this);
    this.server.eval(this.command);
    if (--this.repetitions) {
        var timer = this;
        this.timer = setTimeout(function () { timer.run(); }, this.interval * 1000);
    }
};


function BSChan(name, win) {
    this.name = name;
    this.topic = '';
    this.users = {};
    this.nicks = [];
    this.win = win;
    this.nicksMatch = null;
    this.namesUpdated = true;
    this.showTopic = true;
}
BSChan.prototype.updateNicksMatch = function () {
    var nicks = [];
    for (var i = 0; i < this.nicks.length; i++) nicks.push(escapeRegExp(this.nicks[i]));
    this.nicksMatch = nicks.length ? new RegExp('([^a-z0-9_\\-\\\\\[\\]\\{\\}^`\\|#]|^)(' + nicks.join('|') + ')(?=[^a-z0-9_\\-\\\\\[\\]\\{\\}^`\\|]|$)', 'gi') : null;
};
BSChan.prototype.addUser = function (nick, prefix) {
    this.users[nick.toLowerCase()] = new BSUser(nick, prefix);
    this.nicks.push(nick);
    this.updateNicksMatch();
    this.win.nicklist.update();
};
BSChan.prototype.remUser = function (nick) {
    delete(this.users[nick.toLowerCase()]);
    this.nicks.remove(nick);
    this.updateNicksMatch();
    this.win.nicklist.update();
    BS.UI.updateTitle();
};
BSChan.prototype.resetUsers = function () {
    this.users = {};
    this.nicks = [];
    this.nicksMatch = null;
};
BSChan.prototype.addNames = function (names) {
    if (this.namesUpdated) {
        this.namesUpdated = false;
        this.resetUsers();
    }
    var prefixReg = new RegExp('^[' + this.win.server.ident.prefixChars() + ']*');
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        this.addUser(name.replace(prefixReg, ''), name.match(prefixReg, '')[0]);
        BS.UI.updateTitle();
    }
};
BSChan.prototype.repUser = function (oldnick, newnick) {
    this.users[newnick.toLowerCase()] = this.users[oldnick.toLowerCase()];
    this.users[newnick.toLowerCase()].nick = newnick;
    this.nicks.replace(oldnick, newnick);
    delete(this.users[oldnick.toLowerCase()]);
    this.win.nicklist.update();
};

function BSQuery(nick, win) {
    this.nick = nick;
    this.win = win;
}
BSQuery.prototype.rename = function (newnick) {
    BS.log('renaming: ', this, newnick);
    this.nick = newnick;
    this.win.setLabel(newnick);
};

function BSEditbox(label, win) {
    var parent = this;
    this.label = label;
    this.obj = null;
    this.history = [];
    this.historyIndex = 0;
    this.tabIndex = 0;
    this.tabText = false;
    this.tabMatch = [];
    this.win = win;
    this.obj = document.createElement("textarea");
    this.obj.setAttribute('id', 'editbox_' + label);
    document.getElementById('editboxes').appendChild(this.obj);
    this.obj.addEventListener("keydown", function (e) { parent.onKeyDown(e); }, true);
    this.obj.addEventListener("input", function (e) { parent.onChange(e); }, true)
}
BSEditbox.prototype.destroy = function () {
    this.obj.parentNode.removeChild(this.obj);
};
BSEditbox.prototype.show = function () {
    this.obj.style.display = '';
    this.focus();
};
BSEditbox.prototype.hide = function () {
    this.obj.style.display = 'none';
};
BSEditbox.prototype.appendText = function (text) { this.setText(this.getText() + text); };
BSEditbox.prototype.focus = function () { this.obj.focus(); };
BSEditbox.prototype.getText = function () { return this.obj.value; };
BSEditbox.prototype.onInput = function (e) {
    this.win.server.lastInputTime = Date.now();
    var lines = this.getText().replace(/\r/, "").split("\n");
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i];
        if (!text) continue;
        this.history.push(text);
        if (this.history.length == 32) this.history.shift();
        this.historyIndex = 0;
        var regs;
        if (e.ctrlKey) this.win.server.alias('SAY', text);
        else if (regs = text.match(/^\/\/(.+)$/)) {
            this.win.server.eval(regs[1]);
        }
        else if (regs = text.match(/^\/(.+)$/)) {
            this.win.server.call(regs[1]);
        }
        else this.win.server.alias('SAY', text);
    }
    this.setText("");
    this.obj.name = "editbox_"+Math.random();
    return false;
};
BSEditbox.prototype.onChange = function (e) {
    var lines = (this.obj.value.match(/\n/g) || []).length + 1;
    this.obj.setAttribute('rows', lines);
    this.obj.parentNode.style['min-height'] = (18 * lines + 6) + 'px';
};
BSEditbox.prototype.onKeyDown = function (e) {
    //BS.log(e.keyCode+" "+e.ctrlKey);
    if (e.ctrlKey) {
        //               b,       i,       k,       o,       r,       u
        var ctrlCodes = {66: "", 73: "", 75: "", 79: "", 82: "", 85: ""};
        var ctrlCode = ctrlCodes[e.keyCode];
        if (ctrlCode) {
            e.preventDefault();
            this.appendText(ctrlCode);
        }
    }
    switch (e.keyCode) {
        //tab
        case 9: {
            e.preventDefault();
            // eval idents
            var server = this.win.server;
            this.setText(this.getText().replace(/\$[^ ]+(?:\(.+\))?$/, function (match, offset, string) {
                return server.evalCommand(string);
            }));
            if (!this.tabText) {
                this.tabIndex = 0;
                this.tabText = new RegExp('^' + this.getText().match(/[^ ]*$/), 'i');
                this.tabMatch = [];
                var chan = server.getChan(this.label);
                if (chan) {
                    for (var i in chan.users) {
                        if (chan.users[i].nick.match(this.tabText)) this.tabMatch.push(chan.users[i]);
                    }
                    // sort users by idle
                    this.tabMatch.sort(function (a, b) {
                        return a.lastMessage == b.lastMessage ?
                            (a.nick.toLowerCase() < b.nick.toLowerCase() ? -1 : 1) : b.lastMessage - a.lastMessage; });
                }
            }
            if (!this.tabMatch.length) break;
            this.setText(this.getText().replace(/[^ ]*$/, this.tabMatch[this.tabIndex].nick));
            this.focus();
            this.tabIndex++;
            this.tabIndex %= this.tabMatch.length;
            break;

        }
        //enter
        case 13: {
            if (!e.shiftKey) {
                this.onInput(e);
                e.preventDefault();
            }
            break;
        }
        //up key
        case 38: {
            if (!/\n/.test(this.obj.value.slice(0, this.obj.selectionEnd))) {
                if (!this.history.length) break;
                this.historyIndex++;
                if (this.historyIndex > this.history.length) this.historyIndex = 1;
                this.setText(this.history[this.history.length - this.historyIndex]);
                e.preventDefault();
            }
            break;
        }
        //down key
        case 40: {
            if (!/\n/.test(this.obj.value.slice(this.obj.selectionEnd))) {
                if (!this.history.length) break;
                this.historyIndex--;
                if (this.historyIndex < 1) this.historyIndex = this.history.length;
                this.setText(this.history[this.history.length - this.historyIndex]);
                e.preventDefault();
            }
            break;
        }
        default: {
            this.tabText = false;
        }
    }
};
BSEditbox.prototype.setText = function (text) {
    this.obj.value = text;
    this.onChange();
    this.focus();
};

function BSEvent(type, data, e) {
    this.type = type; //just to keep it first
    for (var i in e) this[i] = e[i];
    for (var i in data) this[i] = data[i];
    this.e = e;
    this.type = type;
    this.haltdef = false;
    this.mute = false;
    this.echo = null;
    this.after = this.after || []; // callbacks after internal event processing
}

// user in a channel
function BSUser(nick, prefix) {
    this.nick = nick;
    this.prefix = prefix || '';
    this.lastMessage = 0;
}

function BSSwitchbar(server) {
    this.server = server;
    this.element = document.createElement('span');
    this.buttons = {};
    document.getElementById('switchbar').appendChild(this.element);
}
BSSwitchbar.prototype.addButton = function (label, win) {
    var element = document.createElement("input");
    element.setAttribute('type', 'button');
    element.setAttribute('data-wid', String(win.wid));
    element.setAttribute('value', label);
    element.addEventListener('click', function (e) {
        BSWindow.windows[e.target.getAttribute('data-wid')].toogle();
    });
    element.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var win = BSWindow.windows[e.target.getAttribute('data-wid')];
        var server = win.server;
        if (server.getChan(win.label)) {
            server.alias('PART', win.label);
            server.remChan(win.label);
        }
        else if (server.getQuery(win.label)) {
            server.remQuery(win.label);
        }
        else if (/status/i.test(win.label)) {
            if (confirm('Are you sure you want to close this server window?')) server.close();
        }
        else win.close();
    });
    var button = this.buttons[label.toLowerCase()] = {label: label, element: element, status: 0, win: win};
    this.update();
    return button;
};
BSSwitchbar.prototype.remButton = function (label) {
    delete(this.buttons[label.toLowerCase()]);
    this.update();
};
BSSwitchbar.prototype.relabelButton = function (oldLabel, newLabel) {
    var button = this.buttons[oldLabel.toLowerCase()];
    button.label = newLabel;
    this.buttons[newLabel.toLowerCase()] = button;
    button.element.setAttribute('value', newLabel);
    delete(this.buttons[oldLabel.toLowerCase()]);
    this.update();
};
BSSwitchbar.prototype.destroy = function () {
    //todo: deselect possible active window
    this.element.parentNode.removeChild(this.element);
};
BSSwitchbar.prototype.update = function () {
    var buttons = BS.util.getObjectKeys(this.buttons);
    buttons.sort(function (a, b) {
        if (a == 'status') return -1;
        if (b == 'status') return 1;
        return a > b;
    });
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
    for (var i = 0; i < buttons.length; i++) {
        this.element.appendChild(this.buttons[buttons[i]].element);
        this.element.appendChild(document.createElement('br'));
    }
};
BSSwitchbar.prototype.deselected = function (button) {
    button.element.classList.remove('selected');
};
BSSwitchbar.prototype.selected = function (button) {
    button.element.classList.add('selected');
    this.updateButton(button, 0, true);
};
BSSwitchbar.prototype.newLine = function (label) {
    // BS.log('newLine:', label, this.buttons);
    var win = this.buttons[label.toLowerCase()].win;
    if (BSWindow.active != win) this.updateButton(win.button, 1);
};
BSSwitchbar.prototype.newMsg = function (label) {
    var win = this.buttons[label.toLowerCase()].win;
    if (BSWindow.active != win) this.updateButton(win.button, 2);
};
BSSwitchbar.prototype.highlight = function (label) {
    var button = this.buttons[label.toLowerCase()];
    if (button) { //private message highlight have no window
        var win = this.buttons[label.toLowerCase()].win;
        if (BSWindow.active != win) this.updateButton(win.button, 3);
    }
};
BSSwitchbar.prototype.updateButton = function (button, newStatus, force) {
    if (newStatus > button.status || force) {
        var statusNames = ['', 'newLine', 'newMsg', 'highlight'];
        if (button.status) button.element.classList.remove(statusNames[button.status]);
        if (newStatus) button.element.classList.add(statusNames[newStatus]);
        button.status = newStatus;
    }
};

function BSNicklist(label, win) {
    this.label = label;
    this.win = win;
    this.element = document.createElement("select");
    this.element.setAttribute('id', 'nicklist_' + label);
    this.element.setAttribute('multiple', 'multiple');
    document.getElementById('nicklist').appendChild(this.element);
}
BSNicklist.prototype.update = function () {
    if (this.win.server.getChan(this.label)) {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        var server = this.win.server;
        var users = server.getChan(this.label).users;
        var nicklist = [];
        for (var i in users) {
            var user = users[i];
            var prefix = user.prefix;
            var el = document.createElement("option");
            el.appendChild(document.createTextNode(prefix + user.nick));
            el.setAttribute('data-user', user.nick);
            var prefixColor = BS.theme.prefixColor(prefix);
            if (prefixColor) el.className = 'c' + prefixColor;
            nicklist.push({el: el, prefix: prefix, user: user.nick});
        }
        nicklist.sort(function (a, b) {
            var pla = BS.util.prefixLevel(server, a.prefix), plb = BS.util.prefixLevel(server, b.prefix);
            return pla == plb ?
                a.user.localeCompare(b.user) :
                pla - plb;
        });
        for (var i = 0; i < nicklist.length; i++) {
            this.element.appendChild(nicklist[i].el);
        }
    }
};
BSNicklist.prototype.destroy = function () {
    this.element.parentNode.removeChild(this.element);
};
BSNicklist.prototype.deselected = function () {
    this.element.style.display = 'none';
};
BSNicklist.prototype.selected = function () {
    this.element.style.display = '';
};

function BSWindow(label, server) {
    this.bufferLimit = 1050;//600;
    this.bufferRestore = 1000;//500;
    server.windows[label.toLowerCase()] = this;
    this.label = label;
    this.server = server;
    BSWindow.windows[this.wid = ++BSWindow.wid] = this; //must be set early

    //create msgBox
    this.msgBox = document.createElement("div");
    this.msgBox.setAttribute('id', 'msgBox_' + label);
    document.getElementById('scrollbox').appendChild(this.msgBox);
    this.msgBox.innerHTML = BS.logs.get(server.network, label).replace(/<tr><td class="line">/g, '<p>').replace(/<\/td><\/tr>/g, '</p>');

    this.button = server.switchbar.addButton(label, this);

    this.nicklist = /^#/.test(label) && new BSNicklist(label, this);
    this.editbox = new BSEditbox(label, this);

    // last thing
    this.select();
}

BSWindow.active = null;
BSWindow.stack = [];
BSWindow.wid = 0;
BSWindow.windows = {};

BSWindow.prototype.setLabel = function (newLabel) {
    this.server.windows[newLabel.toLowerCase()] = this;
    delete(this.server.windows[this.label.toLowerCase()]);
    this.server.switchbar.relabelButton(this.label, newLabel);
    this.label = newLabel;
};
BSWindow.prototype.addLine = function (text) {
    var msgBox = this.msgBox;
    //remove some lines if it gets too big
    var lines = msgBox.childNodes.length;
    if (lines > this.bufferLimit) {
        for (var i = lines; i > this.bufferRestore; i--) {
            msgBox.removeChild(msgBox.firstChild);
        }
    }

    //save to permanent logger
    BS.plogs.add(this.server.network, this.label, text);

    //format text (to HTML)
    text = BS.util.ircformat(BS.util.htmlEntities(text));

    //add to DOM
    var line = document.createElement("p");
    line.innerHTML = text;

    /*
    //find all text nodes in the line
    var textNodes = (function (){
        var n, a = [], walk = document.createTreeWalker(line, NodeFilter.SHOW_TEXT, null, false);
        while (n = walk.nextNode()) a.push(n);
        return a;
    })();

    //find chans
    var match, regex = /\B#[^ ,]+/g;
    for (var i = 0; i < textNodes.length; i++) {
        if (match = textNodes[i].textContent.match(regex)) {
            textNodes[i].parentNode.innerHTML = textNodes[i].textContent.replace(regex, '<u class="chan" data-chan="$&">$&</u>');
        }
    }

    //find nicks
    var chan = this.server.getChan(this.label);
    if (chan && chan.nicksMatch) {
        var match, regex = chan.nicksMatch;
        for (var i = 0; i < textNodes.length; i++) {
            if (match = textNodes[i].textContent.match(regex)) {
                BS.log(textNodes[i].parentNode.outerHTML);
                textNodes[i].parentNode.innerHTML = textNodes[i].textContent.replace(regex, '$1<u class="user" data-user="$2">$2</u>');
            }
        }
    }
    */

    //detect if scrollbox is totally scrolled
    var scrollbox = document.getElementById("scrollbox");
    var scrollTop = scrollbox.scrollTop;
    scrollbox.scrollTop += 1;
    var scrolled = scrollTop == scrollbox.scrollTop;
    this.msgBox.appendChild(line); //append line
    scrollbox.scrollTop = scrolled ? 100000 : scrollTop; //restore scroll or scroll to bottom

    this.server.switchbar.newLine(this.label);
};
BSWindow.prototype.clear = function () {
    var msgBox = this.msgBox;
    while (msgBox.firstChild) msgBox.removeChild(msgBox.firstChild);
    this.server.switchbar.updateButton(this.button, 0, true);
};
BSWindow.prototype.close = function () {
    //deselect window
    if (BSWindow.active == this) {
        this.deselect();
    }
    //remove from window stack
    BSWindow.stack.remove(this.wid);

    BS.logs.save(this.server.network, this.label, this.msgBox.innerHTML);
    BS.logs.store();
    this.msgBox.parentNode.removeChild(this.msgBox);
    this.server.switchbar.remButton(this.label);
    if (this.nicklist) this.nicklist.destroy();
    this.editbox.destroy();
    delete(BSWindow.windows[this.wid]);
    delete(this.server.windows[this.label.toLowerCase()]);
};
BSWindow.prototype.deselect = function () {
    var active = BSWindow.stack.pop();
    this.deselected();
    if (active) BSWindow.windows[active].select();
};
BSWindow.prototype.deselected = function () {
    BSWindow.active = null;
    BSWindow.stack.push(this.wid);
    this.msgBox.style.display = 'none';
    if (this.nicklist) this.nicklist.deselected();
    this.editbox.hide();
    this.server.switchbar.deselected(this.button);
};
BSWindow.prototype.select = function () {
    BSWindow.stack.remove(this.wid);
    if (BSWindow.active) BSWindow.active.deselected();
    BSWindow.active = this;
    this.msgBox.style.display = '';
    this.server.switchbar.selected(this.button);
    if (this.nicklist) this.nicklist.selected();
    this.editbox.show();
    document.getElementById("scrollbox").scrollTop = 100000;
    BS.UI.updateTitle();
};
BSWindow.prototype.toogle = function () {
    if (BSWindow.active == this) this.deselect();
    else this.select();
};

function BSPLogger() {
    this.logs = {};
}
BSPLogger.prototype.add = function (network, label, text) {
    var id = network + '_' + label;
    if (!this.logs[id]) this.logs[id] = ['New log session: ' + new Date().toISOString().slice(0, -5).replace(/T/, ' '), text];
    else this.logs[id].push(text);
};
BSPLogger.prototype.store = function () {
    // BS.log('Storing logs:', this.logs);
    for (var i in this.logs) if (this.logs[i].length) {
        var id = 'plogs_' + i;
        try {
            localStorage.setItem(id, (id in localStorage ? localStorage.getItem(id) + "\n" : '') + this.logs[i].join("\n"));
            this.logs[i] = [];
        }
        catch (e) {
            if (confirm("The storage seems to be full and the logs must be deleted. Do you want to download them?\n\nIf you click 'cancel' the logs will be lost.")) BS.plogs.backup();
            BS.plogs.clear();
            return;
        }
    }
};
BSPLogger.prototype.backup = function (network, label, format) {
    if (network && label) {
        var i = 'plogs_' + network + '_' + label;
        var log = localStorage.getItem(i) || '';
        if (format == 'strip') log = log.replace(/(1[0-5]|0?[0-9](,(1[0-5]|0?[0-9]))?)?|[]/g, '');
        localStorage.removeItem(i);
        var fileName = network + ' ' + label + ' ' + (new Date().toISOString().slice(0, -5).replace(/T/, ' ').replace(/:/g, '.')) + ".log";
        var file = new File([log], fileName, {type: "plain/text"});
        var url = URL.createObjectURL(file);
        var a = document.createElement('a');
        a.setAttribute('href', url);
        var d = new Date();
        a.setAttribute('download', fileName);
        a.click();
    }
    else {
        for (var i in localStorage) {
            var match;
            if (match = i.match(/^plogs_(.+?)_(.+)/)) {
                this.backup(match[1], match[2], format);
            }
        }
    }
};
BSPLogger.prototype.download = function (network, label, format) {
    this.store();
    this.backup(network, label, format);
    this.logs = {};
};

BSPLogger.prototype.clear = function () {
    for (var i in localStorage) {
        if (/^plogs_/.test(i)) {
            localStorage.removeItem(i);
        }
    }
};

function BSLogger() {
    this.logs = BS.sets.get('logs') || {}; //structure that tracks logs
}
BSLogger.prototype.clean = function () {
    var now = BS.util.time();
    for (var label in this.logs) {
        if (now - this.logs[label] > 2592000) {
            delete(this.logs[label]);
            BS.sets.rem('logs_' + label);
        }
    }
    this.store();
};
BSLogger.prototype.get = function (network, label) {
    BS.log('Loading window log:', network, label);
    return BS.sets.get('logs_' + network + '_' + label) || '';
};
BSLogger.prototype.save = function (network, label, innerHTML) {
    BS.log('Saving window log:', network, label);
    BS.sets.set('logs_' + network + '_' + label, innerHTML);
    this.logs[network + '_' + label] = BS.util.time();
};
BSLogger.prototype.saveAll = function () {
    for (var wid in BSWindow.windows) {
        var win = BSWindow.windows[wid];
        this.save(win.server.network, win.label, win.msgBox.innerHTML);
    }
};
BSLogger.prototype.store = function () {
    BS.sets.set('logs', this.logs);
};

Array.prototype.remove = function (value) {
    var index = this.indexOf(value);
    if (index > -1) this.splice(index, 1);
};
Array.prototype.replace = function (oldvalue, newvalue) {
    var index = this.indexOf(oldvalue);
    if (index > -1) this[index] = newvalue;
};
Array.prototype.words = function (begin, end) {
    return this.slice(begin, end).join(' ');
};
String.prototype.words = function (begin, end) {
    if (!this._words) this._words = this.split(' ');
    return this._words.slice(begin, end).join(' ');
};
String.prototype.word = function (index) {
    if (!this._words) this._words = this.split(' ');
    return (index < 0 ? this._words[this._words.length + index] : this._words[index]) || '';
};

function durationLong(s) {
  if (s <= 0) return "Now";
  var makeDuration = function (firstValue, firstLabelSingular, firstLabelPlural, secondValue, secondLabelSingular, secondLabelPlural) {
    return firstValue + ' ' +
        (firstValue == 1 ? firstLabelSingular : firstLabelPlural) +
        (secondValue ? ' ' + "and" + ' ' + secondValue + ' ' +
          (secondValue == 1 ? secondLabelSingular : secondLabelPlural) : '');
  };
  if (s < 60) return makeDuration(s, "second", "seconds", 0);
  if (s < 3600) return makeDuration(Math.floor(s / 60), "minute", "minutes", s % 60, "second", "seconds");
  if (s < 86400) return makeDuration(Math.floor(s / 3600), "hour", "hours", Math.floor(s % 3600 / 60), "minute", "minutes");
  if (s < 31557600) return makeDuration(Math.floor(s / 86400), "day", "days", Math.floor(s % 86400 / 3600), "hour", "hours");
  return makeDuration(Math.floor(s / 31557600), "year", "years", Math.floor(s % 31557600 / 86400), "day", "days");
}
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

document.addEventListener("DOMContentLoaded", BS.onLoad);
