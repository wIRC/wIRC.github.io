var MB = {
    url: 'wss://client00.chat.mibbit.com/mibbit',
    seq: 0,
    socket: null,
    servers: {}, //server mapping using connector's own ids
    pingTimer: 0,
    init: function () {
        MB.connectSocket();
    },
    connect: function (server, forced) {
        MB.servers[server.hostname] = server;
        var data = {"channel": "IRCClient", "cmd": "connect", "data": server.hostname + ":" + server.port, "nick": server.nick, "pass": server.password || '', "authmethod": "nickserv", "joinchannels": "", "charset": "UTF-8"};
        data.forced = true; // if (forced) data.forced = true;
        MB.send(data);
        clearInterval(MB.pingTimer);
        MB.pingTimer = setInterval(function () {
            MB.send({"cmd": "nping", "m": "checking"});
        }, 120000);
    },
    connectSocket: function () {
        BS.log('Opening WebSocket...', MB.socket, MB.socket && MB.socket.readyState);
        if (MB.socket && MB.socket.readyState < 2) return;
        MB.socket = new WebSocket(MB.url);
        MB.socket.onopen = MB.onOpen;
        MB.socket.onmessage = MB.onMessage;
        MB.socket.onclose = MB.onClose;
        MB.socket.onerror = MB.onError;
    },
    disconnect: function () {
        MB.socket.close();
    },
    onMessage: function (msg) {
        var data = eval('(' + msg.data + ')');
        BS.log('<-', data);
        var channel = data.channel && data.channel.split(':');
        var server = channel && channel[1] && MB.servers[channel[1]];
        if (data.cmd) {
            switch (data.cmd.toUpperCase()) {
                case 'CONNECTED': return MB.servers[data.name].network = data.network;
                case 'CHECKCONNECT': return setTimeout(function () { MB.connect(MB.servers[data.name], true); }, 1000);
                case 'DISCONNECTED': {
                    server.event('DISCONNECT', {text: 'disconnected from IRC server'});
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
                case 'JOIN': return server.event('JOIN', {chan: data.localchannel, nick: data.nick, mask: data.host});
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
                case 'UNBAN': return server.event('RAW', {command: 'MODE', prefix: data.by, params: channel[2] + ' -b ' + data.nick});
                case 'MODE': return server.event('RAW', {command: 'MODE', prefix: data.nick, params: data.localchannel + ' ' + data.msg.slice(-2)});
                case 'TOPIC': {
                    if (data.nick) return server.event('RAW', {command: 'TOPIC', prefix: data.nick, params: data.localchannel, trailing: data.topic});
                    return server.event('RAW', {command: '332', params: server.ident.me() + ' ' + data.localchannel, trailing: data.topic});
                }
                case 'TOPICWHO': return server.event('RAW', {command: '333', params: [server.ident.me(), data.localchannel, data.creator, data.date].join(' ')});
                case 'WHOISREPLY': {
                    server.event('RAW', {command: '311', params: server.ident.me() + ' ' + data.nick + ' ' + data.user + ' ' + data.host + ' *', trailing: data.realname});
                    server.event('RAW', {command: '312', params: server.ident.me() + ' ' + data.nick + ' ' + data.server, trailing: data.serverinfo});
                    if (data.ssl) server.event('RAW', {command: '671', params: server.ident.me() + ' ' + data.nick, trailing: 'is using a secure connection'});

                    var idle = Number(data.idle.match(/\d+/)[0]);
                    if (data.idle.match(/minute/)) idle *= 60;
                    server.event('RAW', {command: '317', params: server.ident.me() + ' ' + data.nick + ' ' + idle + ' 0', trailing: 'seconds idle, signon time'});
                    server.event('RAW', {command: '318', params: server.ident.me() + ' ' + data.nick, trailing: 'End of /WHOIS list.'});
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
                    var prefix = '';

                    server.event('RAW', {raw: line, prefix: prefix, command: command, params: params, trailing: ''});
                    break;
                }
                case 'SERVERSTATUS': break;
                case 'USERINFO': break;
                case 'STATUS': break;
                case 'LAGTIME': break;
                case 'NPING': break;
                default: {
                    server.event('RAW', {raw: '', prefix: '', command: data.cmd.toUpperCase(), params: '', trailing: JSON.stringify(data)});
                }
            }
        }
        if (data.sessionid) {
            MB.send({"cmd": "clientinfo", "localtime": BS.util.time()*1000, "tzoffset": (new Date).getTimezoneOffset(), "clientinfo": "{}"});
            MB.send({"channel": "IRCClient", "cmd": "embed", "referrer": "", "settings": "30d18e5a126ce9381229b50ddced5cc8"});
            MB.send({"channel": "LoginManager", "cmd": "guest", "uagent": navigator.userAgent, "version": 4142});
            BS.onReadyToConnect();
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
        for (var i in BS.servers) BS.servers[i].event('DISCONNECT', {text: 'socket closed'});
        MB.connectSocket();
    },
    onError: function () {
        for (var i in BS.servers) BS.servers[i].event('DISCONNECT', {text: 'socket error'});
        MB.connectSocket();
    },
    onOpen: function () {
        BS.log('WebSocket open.');
        //BS.server.alias('RAW', "NICK " + BS.sets.get('nick'));
        //BS.server.alias('RAW', "USER " + BS.sets.get('nick') + " server.com server.com : " + BS.sets.get('nick'));
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
        console.log('->', data);
        if (MB.socket && MB.socket.readyState == MB.socket.OPEN) {
            MB.socket.send(JSON.stringify(data));
            return true;
        }
        else {
            BS.UI.echo("* Not connected."); //fixme: should be shown in server's window
            MB.connectSocket();
            return false;
        }
    }
};
