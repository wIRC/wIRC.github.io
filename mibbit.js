var MB = {
    url: 'wss://client00.chat.mibbit.com/mibbit',
    seq: 0,
    socket: null,
    servers: {}, //server mapping using connector's own ids
    status: 3,
    pingTimer: 0,
    pingTimerWarning: 0,
    connectSocketTimer: 0,
    connectAttemptCount: 0,
    readyToConnect: false,
    init: function () {
        MB.connectSocket();
    },
    ping: function () {
        clearInterval(MB.pingTimer);
        MB.pingTimer = setTimeout(function () {
            //MB.send({"cmd": "nping", "m": "checking"});
            MB.send({"cmd": "ping", "ts": Date.now()});
            MB.pingTimerWarning = setTimeout(function () {
                BS.UI.echo('Warning: 5 secs lag.');
            }, 5000);
        }, 30000);
    },
    connectServer: function (server, forced) {
        MB.servers[server.hostname] = server;
        var data = {"channel": "IRCClient", "cmd": "connect", "data": server.hostname + ":" + server.port, "nick": server.nick, "pass": server.password || '', "authmethod": "nickserv", "joinchannels": "", "charset": "UTF-8"};
        data.forced = true; // if (forced) data.forced = true;
        MB.send(data);
        MB.ping();
    },
    connectSocket: function () {
        BS.log('Opening WebSocket...', MB.socket, MB.socket && MB.socket.readyState);
        if (MB.socket && MB.socket.readyState < 2) {
            BS.log('Already connected or connecting...');
            return;
        }
        clearInterval(this.connectSocketTimer);
        this.connectSocketTimer = setTimeout(function () {
            if (!MB.socket || MB.socket.readyState != 1) {
                BS.log('Opening WebSocket timeout, retrying...');
                MB.socket.close();
                MB.connectSocket();
            }
        }, 5000);
        if (MB.socket) MB.socket.onopen = MB.socket.onmessage = MB.socket.onclose = MB.socket.onerror = null;
        MB.status = 0;
        BS.util.allServers(function (server) { server.alias('ECHO', 'Status', '* Opening WebSocket...'); });
        MB.socket = new WebSocket(MB.url);
        MB.socket.onopen = MB.onOpen;
        MB.socket.onmessage = MB.onMessage;
        MB.socket.onclose = MB.onClose;
        MB.socket.onerror = MB.onError;
        MB.readyToConnect = false;
    },
    reconnectSocket: function () {
        if (!MB.connectAttemptCount++) MB.connectSocket();
        else setTimeout(MB.connectSocket, 1000);
    },
    disconnect: function () {
        MB.socket.close();
    },
    onMessage: function (msg) {
        var data = eval('(' + msg.data + ')');
        BS.log('<-', data);
        var channel = data.channel && data.channel.split(':');
        var server = channel && channel[1] && MB.servers[channel[1]] || MB.servers[data.name];
        if (data.cmd) {
            switch (data.cmd.toUpperCase()) {
                case 'BANLIST': return server.event('RAW', {command: '367', prefix: '', params: [server.ident.me(), data.localchannel, data.mask, data.who, data.ctime].join(' '), trailing: ''});
                case 'CONNECTED': {
                    server.alias('ECHO', 'Status', '* Connected to server.');
                    if (data.network) server.setNetwork(data.network);
                    if (server.password) server.alias('RAW PASS ' + server.password);
                    break;
                }
                case 'CHECKCONNECT': return setTimeout(function () { MB.connect(MB.servers[data.name], true); }, 1000);
                case 'CTCP': {
                    if (data.notice) server.event('CTCPREPLY', {nick: data.nick, text: data.data});
                    else server.event('CTCP', {nick: data.nick, text: data.data});
                    break;
                }
                case 'DISCONNECTED': {
                    server.event('DISCONNECT', {text: data.reason || 'disconnected from IRC server'});
                    return setTimeout(function () { MB.connect(MB.servers[data.name], true); }, 1000);
                }
                case 'NICKPROMPT': {
                    server.alias('RAW', 'NICK ' + server.nick + BS.util.rand(100, 999));
                    break;
                }
                case 'INIT': {
                    server.setMe(data.nick);
                    server.event('CONNECT', {});
                    break;
                }
                case 'JOIN': return server.event('JOIN', {chan: data.localchannel, nick: data.nick, mask: data.user + '@' + data.host});
                case 'PART': {
                    if (data.quit) return server.event('QUIT', {nick: data.nick, mask: data.host, text: data.message});
                    return server.event('PART', {chan: data.localchannel, nick: data.nick, mask: data.host, text: data.message});
                }
                case 'CHANGENICK': return server.event('NICK', {nick: data.nick, newnick: data.newnick});
                case 'KICK': return server.event('KICK', {chan: data.localchannel, knick: data.nick, nick: data.kicker, text: data.reason});
                case 'MSG': {
                    server.event('TEXT', {chan: server.getChan(data.localchannel) && data.localchannel, nick: data.nick, text: data.msg});
                    server.switchbar.newMsg(data.localchannel);
                    break;
                }
                case 'MOTD': break;
                case 'EMOTE': {
                    server.event('ACTION', {chan: server.getChan(data.localchannel) && data.localchannel, nick: data.nick, text: data.emote});
                    server.switchbar.newMsg(data.localchannel);
                    break;
                }
                case 'NOTICE': return server.event('NOTICE', {chan: server.getChan(data.localchannel) && data.localchannel, nick: data.nick, text: data.notice});
                case 'AWAY': return server.event('RAW', {command: '301', params: data.nick, trailing: data.reason});
                case 'BAN': return server.event('RAW', {command: 'MODE', prefix: data.by, params: channel[2] + ' +b ' + data.nick});
                case 'CHANNELLISTSTART': return server.event('RAW', {command: '321', prefix: '', params: '', trailing: ''});
                case 'CHANNELLIST': return server.event('RAW', {command: '322', prefix: '', params: server.ident.me() + ' ' + data.name +' ' + data.users, trailing: data.topic});
                case 'CHANNELLISTEND': return server.event('RAW', {command: '323', prefix: '', params: '', trailing: ''});
                case 'UNBAN': return server.event('RAW', {command: 'MODE', prefix: data.by, params: channel[2] + ' -b ' + data.nick});
                case 'MODE': return server.event('RAW', {command: 'MODE', prefix: data.by || data.nick, params: data.localchannel + ' ' + data.msg.slice(-2)});
                case 'TOPIC': {
                    if (data.nick) return server.event('RAW', {command: 'TOPIC', prefix: data.nick, params: data.localchannel, trailing: data.topic});
                    return server.event('RAW', {command: '332', params: server.ident.me() + ' ' + data.localchannel, trailing: data.topic});
                }
                case 'TOPICWHO': return server.event('RAW', {command: '333', params: [server.ident.me(), data.localchannel, data.creator, data.date].join(' ')});
                case 'WHOISREPLY': {
                    var params = server.ident.me() + ' ' + data.nick;
                    server.event('RAW', {command: '311', params: params + ' ' + data.user + ' ' + data.host + ' *', trailing: data.realname});
                    if (data.realhost) server.event('RAW', {command: '378', params: params, trailing: 'is connecting from ' + data.realhost + ' ' + data.realip});
                    server.event('RAW', {command: '312', params: params + ' ' + data.server, trailing: data.serverinfo});
                    if (data.away) server.event('RAW', {command: '301', params: params, trailing: data.away});
                    if (data.modes) server.event('RAW', {command: '379', params: params, trailing: data.modes});
                    //server.event('RAW', {command: '330', params: params + ' ' + data.user, trailing: 'is logged in as'});
                    if (data.ssl) server.event('RAW', {command: '671', params: params, trailing: 'is using a secure connection'});
                    var idle = Number(data.idle.match(/\d+/)[0]);
                    if (data.idle.match(/minute/)) idle *= 60;
                    server.event('RAW', {command: '318', params: params, trailing: 'End of /WHOIS list.'});
                    break;
                }
                case 'NICKLIST': {
                    var chan = data.localchannel, names = [];
                    for (var i = 0; i < data.nicks.length; i++) {
                        var prefix = '';
                        if (data.nicks[i].owner) prefix += '~';
                        else if (data.nicks[i].op) prefix += '@';
                        else if (data.nicks[i].halfop) prefix += '%';
                        else if (data.nicks[i].voice) prefix += '+';
                        names.push(prefix + data.nicks[i].nick);
                    }
                    server.proc.raw353(chan, names);
                    //server.proc.raw366(chan);
                    server.getChan(chan).win.nicklist.update();
                    break;
                }
                case 'USERMODE': {
                    var mode = '';
                    if (data.op === false) mode = '-o';
                    else if (data.op) mode = '+o';
                    if (data.voice === false) mode = '-v';
                    else if (data.voice) mode = '+v';
                    if (data.halfop === false) mode = '-h';
                    else if (data.halfop) mode = '+h';
                    if (data.owner === false) mode = '-q';
                    else if (data.owner) mode = '+q';
                    var command = 'MODE';
                    var params = data.channel.replace(/^.+:([^:]+)$/, '$1') + ' ' + mode + ' ' + data.nick;
                    var line = ':' + data.by + '!*@* ' + command + ' ' + params;
                    var prefix = data.by;

                    server.event('RAW', {raw: line, prefix: prefix, command: command, params: params, trailing: ''});
                    break;
                }
                case 'SERVERSTATUS': break;
                case 'USERINFO': break;
                case 'INFOBAR': break;
                case 'CLOSEDCHANNEL': break;
                case 'STATUS': {
                    if (data.readyToConnect && !MB.readyToConnect) {
                        MB.readyToConnect = true;
                        BS.util.allServers(function (server) {
                            server.alias('ECHO', 'Status', '* Connecting to server...');
                            MB.connectServer(server);
                        });
                    }
                    break;
                }
                case 'LAGTIME': {
                    var server = MB.servers[data.server];
                    server.lag = data.lag;
                    BS.UI.updateLag();
                    break;
                }
                case 'PING': {
                    clearInterval(MB.pingTimerWarning);
                    MB.lag = Date.now() - data.ts;
                    BS.UI.updateLag();
                    MB.ping();
                    break;
                }
                case 'NPING': break;
                case 'LOG': {
                    var match = data.message.match(/^([^:]+):  \|(.+)/);
                    var command = match[1], text = match[2];
                    var tokens = text.match(/\[\d+\] .+?(,|$)/g);
                    tokens = tokens.map(function (x) { return x.replace(/^\[\d+\] (.+?)(,|$)/, '$1'); });
                    var prefix = '', params = '', trailing = '';
                    switch (command) {
                        case '004': params = tokens.join(' '); break;
                        default: {
                            trailing = tokens.pop();
                            if (tokens.length) params = tokens.join(' ');
                        }
                    }
                    server.event('RAW', {raw: '', prefix: '', command: command.toUpperCase(), params: params, trailing: trailing});
                    break;
                }
                default: {
                    server.event('RAW', {raw: '', prefix: '', command: data.cmd.toUpperCase(), params: '', trailing: JSON.stringify(data)});
                }
            }
        }
        if (data.sessionid) {
            MB.send({"cmd": "clientinfo", "localtime": BS.util.time()*1000, "tzoffset": (new Date).getTimezoneOffset()});
            //MB.send({"channel": "IRCClient", "cmd": "embed", "referrer": "", "settings": "30d18e5a126ce9381229b50ddced5cc8"});
            MB.send({"channel": "LoginManager", "cmd": "guest", "uagent": navigator.userAgent, "version": 4136});
            //BS.onReadyToConnect();
            //MB.connect(server);
        }
        return null;

        // var data = msg.data;
        // var reader = new FileReader();
        // reader.onload = function (e) {
        // var data = e.target.result;
        // var lines = data.split("\n");
        // lines[0] = BS.buffer + lines[0];
        // BS.buffer = lines.pop();
        // for (var i = 0; i < lines.length; i++) {
        // BS.onMessageLine(BS.util.trim(lines[i]));
        // }
        // }
        // reader.readAsText(data);
    },
//    onMessageLine: function (line) {
//        BS.log('<- ', line);
//        var regs = line.match(/^(?::(\S+) )?(\S+) ?(?:(?!:)(.+?))?(?: :(.+))?$/);
//        if (regs) BS.server.event('RAW', {raw: line, prefix: regs[1], command: regs[2], params: regs[3], trailing: regs[4] || ''});
//        else BS.log('cannot parse: "' + line + '"');
//    },
    onClose: function () {
        BS.log('WebSocket closed.');
        MB.onDisconnected();
    },
    onError: function () {
        BS.log('WebSocket error.');
        MB.onDisconnected();
    },
    onOpen: function () {
        //BS.log('WebSocket open.');
        BS.util.allServers(function (server) { server.alias('ECHO', 'Status', '* WebSocket open.'); });
        MB.connectAttemptCount = 0;
        MB.status = 1;
        //BS.server.alias('RAW', "NICK " + BS.sets.get('nick'));
        //BS.server.alias('RAW', "USER " + BS.sets.get('nick') + " server.com server.com : " + BS.sets.get('nick'));
    },
    onDisconnected: function () {
        if (MB.status == 1) {
            MB.status = 3;
            BS.util.allServers(function (server) {
                if (server.status == 1) server.event('DISCONNECT');
            });
            //MB.reconnectSocket();
            MB.connectSocket();
        }
    },
    raw: function (server, line) {
        var regs = line.match(/^(?::(\S+) )?(\S+) ?(?:(?!:)(.+?))?(?: :(.+))?$/);
        if (!regs) throw new Error('Error parsing raw line: ' + line);
        var prefix = regs[1], command = regs[2], params = regs[3], trailing = regs[4] || '';
        switch (command.toUpperCase()) {
            case 'PRIVMSG': {
                var targets = params.split(',');
                for (var i = 0; i < targets.length; i++) {
                    MB.send({"cmd": "text", "chan": targets[i], "data": trailing, "channel": "IRCClient:" + server.hostname});
                }
                break;
            }
            case 'QUIT': {
                MB.send({"channel": "IRCClient", "cmd": "disconnect", "data": server.hostname});
                break;
            }
            default: MB.send({"cmd": "text", "chan": "IRCClient:" + server.hostname, "data": "/" + line, "channel": "IRCClient:" + server.hostname});
        }
    },
    send: function (data) {
        data.seq = MB.seq++;
        return MB.sendData(data);
    },
    sendData: function (data) {
        BS.log('->', data);
        if (MB.socket && MB.socket.readyState == MB.socket.OPEN) {
            MB.socket.send(JSON.stringify(data));
            return true;
        }
        else {
            BS.UI.echo("* Not connected."); //fixme: should be shown in server's window
            MB.onDisconnected();
            return false;
        }
    }
};
