$(function(){
    $.contextMenu({
        selector: '#nicklist',
        className: 'contextmenu-custom',
        build: function($trigger, e) {
            var vars = {text: BSWindow.active.server.ident.snicks().replace(/,/g, ' '), chan: BSWindow.active.server.ident.active()};
            return {
                items: {
                    "$1 $iif($address($1,0),( $+ $gettok($address($1,0),2-,33) $+ ))": {
                        "name": BSWindow.active.server.evalCommand('$1 $iif($address($1,0),( $+ $gettok($address($1,0),2-,33) $+ ))', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('uwho $1', vars)); }
                    },
                    "sep0": "",
                    "Whois": {
                        "name": BSWindow.active.server.evalCommand('Whois', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return $bs.input.nick(1,44,WHOIS)', vars)); }
                    },
                    "sep1": "",
                    "NickServ": {
                        "name": BSWindow.active.server.evalCommand('NickServ', vars)
                    },
                    "ChanServ": {
                        "name": BSWindow.active.server.evalCommand('ChanServ', vars),
                        "items": {
                            "Edit access flags": {
                                "name": BSWindow.active.server.evalCommand('Edit access flags', vars),
                                "items": {
                                    "Access manager...": {
                                        "name": BSWindow.active.server.evalCommand('Access manager...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('csflags', vars)); }
                                    },
                                    "sep2": "",
                                    "VOP (auto +v)": {
                                        "name": BSWindow.active.server.evalCommand('VOP (auto +v)', vars),
                                        "items": {
                                            "Add": {
                                                "name": BSWindow.active.server.evalCommand('Add', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV vop $chan add = $+ $1', vars)); }
                                            },
                                            "Del": {
                                                "name": BSWindow.active.server.evalCommand('Del', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV vop $chan del = $+ $1', vars)); }
                                            }
                                        }
                                    },
                                    "HOP (auto +h)": {
                                        "name": BSWindow.active.server.evalCommand('HOP (auto +h)', vars),
                                        "items": {
                                            "Add": {
                                                "name": BSWindow.active.server.evalCommand('Add', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV hop $chan add = $+ $1', vars)); }
                                            },
                                            "Del": {
                                                "name": BSWindow.active.server.evalCommand('Del', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV hop $chan del = $+ $1', vars)); }
                                            }
                                        }
                                    },
                                    "AOP (auto +o)": {
                                        "name": BSWindow.active.server.evalCommand('AOP (auto +o)', vars),
                                        "items": {
                                            "Add": {
                                                "name": BSWindow.active.server.evalCommand('Add', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV aop $chan add = $+ $1', vars)); }
                                            },
                                            "Del": {
                                                "name": BSWindow.active.server.evalCommand('Del', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV aop $chan del = $+ $1', vars)); }
                                            }
                                        }
                                    },
                                    "SOP (auto +a)": {
                                        "name": BSWindow.active.server.evalCommand('SOP (auto +a)', vars),
                                        "items": {
                                            "Add": {
                                                "name": BSWindow.active.server.evalCommand('Add', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV sop $chan add = $+ $1', vars)); }
                                            },
                                            "Del": {
                                                "name": BSWindow.active.server.evalCommand('Del', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV sop $chan del = $+ $1', vars)); }
                                            }
                                        }
                                    },
                                    "sep3": "",
                                    "Akick (auto kick-ban)": {
                                        "name": BSWindow.active.server.evalCommand('Akick (auto kick-ban)', vars),
                                        "items": {
                                            "Add": {
                                                "name": BSWindow.active.server.evalCommand('Add', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV akick $chan add = $+ $1', vars)); }
                                            },
                                            "Del": {
                                                "name": BSWindow.active.server.evalCommand('Del', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV akick $chan del = $+ $1', vars)); }
                                            }
                                        }
                                    },
                                    "sep4": "",
                                    "Set custom flags...": {
                                        "name": BSWindow.active.server.evalCommand('Set custom flags...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan $1 $$input(What flags?,qe)', vars)); }
                                    }
                                }
                            },
                            "Control": {
                                "name": BSWindow.active.server.evalCommand('Control', vars),
                                "items": {
                                    "$iif($1 isvoice $chan,$style(1)) Voice": {
                                        "name": BSWindow.active.server.evalCommand('$iif($1 isvoice $chan,$style(1)) Voice', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV $iif($1 isvoice $chan,devoice,voice) $chan $1', vars)); }
                                    },
                                    "$iif($1 ishop $chan,$style(1)) Halfop": {
                                        "name": BSWindow.active.server.evalCommand('$iif($1 ishop $chan,$style(1)) Halfop', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV $iif($1 ishop $chan,dehalfop,halfop) $chan $1', vars)); }
                                    },
                                    "$iif($1 isop $chan,$style(1)) Op": {
                                        "name": BSWindow.active.server.evalCommand('$iif($1 isop $chan,$style(1)) Op', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV $iif($1 isop $chan,deop,op) $chan $1', vars)); }
                                    },
                                    "sep5": "",
                                    "Kick": {
                                        "name": BSWindow.active.server.evalCommand('Kick', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV kick $chan $1', vars)); }
                                    },
                                    "Kick with reason...": {
                                        "name": BSWindow.active.server.evalCommand('Kick with reason...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV kick $chan $1 $$input(What reason?,qe)', vars)); }
                                    },
                                    "Kickban": {
                                        "name": BSWindow.active.server.evalCommand('Kickban', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV kickban $chan $1', vars)); }
                                    },
                                    "Kickban with reason...": {
                                        "name": BSWindow.active.server.evalCommand('Kickban with reason...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV kickban $chan $1 $$input(What reason?,qe)', vars)); }
                                    },
                                    "sep6": "",
                                    "Ban": {
                                        "name": BSWindow.active.server.evalCommand('Ban', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV ban $chan $1', vars)); }
                                    }
                                }
                            },
                            "sep7": "",
                            "Transfer foundership": {
                                "name": BSWindow.active.server.evalCommand('Transfer foundership', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan founder = $+ $1', vars)); }
                            }
                        }
                    },
                    "MemoServ": {
                        "name": BSWindow.active.server.evalCommand('MemoServ', vars)
                    },
                    "sep8": "",
                    "IRC Operator": {
                        "name": BSWindow.active.server.evalCommand('IRC Operator', vars),
                        "items": {
                            "NickServ": {
                                "name": BSWindow.active.server.evalCommand('NickServ', vars)
                            },
                            "OperServ": {
                                "name": BSWindow.active.server.evalCommand('OperServ', vars)
                            },
                            "sep9": ""
                        }
                    },
                    "sep10": "",
                    "Open PVT...": {
                        "name": BSWindow.active.server.evalCommand('Open PVT...', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return $bs.input.nick(1,44,query)', vars)); }
                    },
                    "Message": {
                        "name": BSWindow.active.server.evalCommand('Message', vars),
                        "items": {
                            "Send a message to $1 \t/msg": {
                                "name": BSWindow.active.server.evalCommand('Send a message to $1 \t/msg', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('msg $1 $$input(What message?,qe)', vars)); }
                            },
                            "sep11": "",
                            "$iif($snick($chan,0) > 1,Send a private message to all selected users ( $+ $snick($chan,0) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($snick($chan,0) > 1,Send a private message to all selected users ( $+ $snick($chan,0) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20s $chan msg $!nick $$input(What message?,qe)', vars)); }
                            },
                            "sep12": "",
                            "$iif($nick($chan,0,o),Send a message to all oped users ( $+ $nick($chan,0,o) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,o),Send a message to all oped users ( $+ $nick($chan,0,o) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20o $chan msg $!nick $$input(What message?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,h),Send a message to all halfoped users ( $+ $nick($chan,0,h) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,h),Send a message to all halfoped users ( $+ $nick($chan,0,h) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20h $chan msg $!nick $$input(What message?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,v),Send a message to all voiced users ( $+ $nick($chan,0,v) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,v),Send a message to all voiced users ( $+ $nick($chan,0,v) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20v $chan msg $!nick $$input(What message?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,r),Send a message to all regular users ( $+ $nick($chan,0,r) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,r),Send a message to all regular users ( $+ $nick($chan,0,r) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20r $chan msg $!nick $$input(What message?,qe)', vars)); }
                            },
                            "sep13": "",
                            "Send a private message to all users ( $+ $nick($chan,0) $+ )": {
                                "name": BSWindow.active.server.evalCommand('Send a private message to all users ( $+ $nick($chan,0) $+ )', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20 $chan msg $!nick $$input(What message?,qe)', vars)); }
                            }
                        }
                    },
                    "Action": {
                        "name": BSWindow.active.server.evalCommand('Action', vars),
                        "items": {
                            "Send an action to $1 \t/describe": {
                                "name": BSWindow.active.server.evalCommand('Send an action to $1 \t/describe', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('describe $1 $$input(What action?,qe)', vars)); }
                            },
                            "sep14": "",
                            "$iif($snick($chan,0) > 1,Send an action to selected users ( $+ $snick($chan,0) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($snick($chan,0) > 1,Send an action to selected users ( $+ $snick($chan,0) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20s $chan describe $!nick $$input(What action?,qe)', vars)); }
                            },
                            "sep15": "",
                            "$iif($nick($chan,0,o),Send an action to all oped users ( $+ $nick($chan,0,o) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,o),Send an action to all oped users ( $+ $nick($chan,0,o) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20o $chan describe $!nick $$input(What action?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,h),Send an action to all halfoped users ( $+ $nick($chan,0,h) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,h),Send an action to all halfoped users ( $+ $nick($chan,0,h) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20h $chan describe $!nick $$input(What action?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,v),Send an action to all voiced users ( $+ $nick($chan,0,v) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,v),Send an action to all voiced users ( $+ $nick($chan,0,v) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20v $chan describe $!nick $$input(What action?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,r),Send an action to all regular users ( $+ $nick($chan,0,r) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,r),Send an action to all regular users ( $+ $nick($chan,0,r) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20r $chan describe $!nick $$input(What action?,qe)', vars)); }
                            },
                            "sep16": "",
                            "Send an action to all users ( $+ $nick($chan,0) $+ )": {
                                "name": BSWindow.active.server.evalCommand('Send an action to all users ( $+ $nick($chan,0) $+ )', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20 $chan describe $!nick $$input(What action?,qe)', vars)); }
                            }
                        }
                    },
                    "Notice": {
                        "name": BSWindow.active.server.evalCommand('Notice', vars),
                        "items": {
                            "Send a notice to $1 \t/notice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $1 \t/notice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $1 $$input(What notice?,qe)', vars)); }
                            },
                            "sep17": "",
                            "$iif($snick($chan,0) > 1,Send a notice to selected users ( $+ $snick($chan,0) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($snick($chan,0) > 1,Send a notice to selected users ( $+ $snick($chan,0) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20s $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            },
                            "sep18": "",
                            "$iif($nick($chan,0,o),Send a notice to all oped users ( $+ $nick($chan,0,o) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,o),Send a notice to all oped users ( $+ $nick($chan,0,o) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20o $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,h),Send a notice to all halfoped users ( $+ $nick($chan,0,h) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,h),Send a notice to all halfoped users ( $+ $nick($chan,0,h) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20h $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,v),Send a notice to all voiced users ( $+ $nick($chan,0,v) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,v),Send a notice to all voiced users ( $+ $nick($chan,0,v) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20v $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            },
                            "$iif($nick($chan,0,r),Send a notice to all regular users ( $+ $nick($chan,0,r) $+ ))": {
                                "name": BSWindow.active.server.evalCommand('$iif($nick($chan,0,r),Send a notice to all regular users ( $+ $nick($chan,0,r) $+ ))', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20r $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            },
                            "sep19": "",
                            "Send a notice to all users ( $+ $nick($chan,0) $+ )": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to all users ( $+ $nick($chan,0) $+ )', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('return mass -g20 $chan notice $!nick $$input(What notice?,qe)', vars)); }
                            }
                        }
                    },
                    "CTCP": {
                        "name": BSWindow.active.server.evalCommand('CTCP', vars),
                        "items": {
                            "Ping": {
                                "name": BSWindow.active.server.evalCommand('Ping', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks ping', vars)); }
                            },
                            "Time": {
                                "name": BSWindow.active.server.evalCommand('Time', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks time', vars)); }
                            },
                            "Version": {
                                "name": BSWindow.active.server.evalCommand('Version', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks version', vars)); }
                            },
                            "Source": {
                                "name": BSWindow.active.server.evalCommand('Source', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks source', vars)); }
                            },
                            "sep20": "",
                            "Page": {
                                "name": BSWindow.active.server.evalCommand('Page', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks page $$input(What msg?,eq,CTCP Page)', vars)); }
                            },
                            "sep21": "",
                            "Finger": {
                                "name": BSWindow.active.server.evalCommand('Finger', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks finger', vars)); }
                            },
                            "Userinfo": {
                                "name": BSWindow.active.server.evalCommand('Userinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks userinfo', vars)); }
                            },
                            "Clientinfo": {
                                "name": BSWindow.active.server.evalCommand('Clientinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks clientinfo', vars)); }
                            },
                            "Sound": {
                                "name": BSWindow.active.server.evalCommand('Sound', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks sound', vars)); }
                            },
                            "sep22": "",
                            "OS": {
                                "name": BSWindow.active.server.evalCommand('OS', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks os', vars)); }
                            },
                            "Theme": {
                                "name": BSWindow.active.server.evalCommand('Theme', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks theme', vars)); }
                            },
                            "sep23": "",
                            "Other\t/ctcp": {
                                "name": BSWindow.active.server.evalCommand('Other\t/ctcp', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $snicks $$input(What CTCP?,eq,CTCP)', vars)); }
                            }
                        }
                    },
                    "DCC": {
                        "name": BSWindow.active.server.evalCommand('DCC', vars),
                        "items": {
                            "Send a file to $1": {
                                "name": BSWindow.active.server.evalCommand('Send a file to $1', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('/dcc send $1', vars)); }
                            },
                            "sep24": "",
                            "Open a DCC chat  with $1": {
                                "name": BSWindow.active.server.evalCommand('Open a DCC chat  with $1', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('/dcc chat $1', vars)); }
                            }
                        }
                    },
                    "sep25": "",
                    "Control": {
                        "name": BSWindow.active.server.evalCommand('Control', vars),
                        "items": {
                            "$iif($1 isop $chan,$style(1)) Op": {
                                "name": BSWindow.active.server.evalCommand('$iif($1 isop $chan,$style(1)) Op', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('mode $chan $iif($1 isop $chan,-,+) $+ o $1', vars)); }
                            },
                            "$iif($1 ishop $chan,$style(1)) Halfop": {
                                "name": BSWindow.active.server.evalCommand('$iif($1 ishop $chan,$style(1)) Halfop', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('mode $chan $iif($1 ishop $chan,-,+) $+ h $1', vars)); }
                            },
                            "$iif($1 isvoice $chan,$style(1)) Voice": {
                                "name": BSWindow.active.server.evalCommand('$iif($1 isvoice $chan,$style(1)) Voice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('mode $chan $iif($1 isvoice $chan,-,+) $+ v $1', vars)); }
                            },
                            "sep26": "",
                            "Kick": {
                                "name": BSWindow.active.server.evalCommand('Kick', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('kick $chan $1', vars)); }
                            },
                            "Kick with reason...": {
                                "name": BSWindow.active.server.evalCommand('Kick with reason...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('kick $chan $1 $$input(Reason?,qe)', vars)); }
                            },
                            "Kickban": {
                                "name": BSWindow.active.server.evalCommand('Kickban', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ban $chan $1 2 | kick $chan $1', vars)); }
                            },
                            "Kickban with reason...": {
                                "name": BSWindow.active.server.evalCommand('Kickban with reason...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ban $chan $1 2 | kick $chan $1 $$input(Reason?,qe)', vars)); }
                            },
                            "sep27": "",
                            "Ban": {
                                "name": BSWindow.active.server.evalCommand('Ban', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ban $chan $1 2', vars)); }
                            },
                            "sep28": "",
                            "Fpart": {
                                "name": BSWindow.active.server.evalCommand('Fpart', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('fpart $chan $1', vars)); }
                            },
                            "Fpart/ban": {
                                "name": BSWindow.active.server.evalCommand('Fpart/ban', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ban $chan $1 2 | fpart $chan $1', vars)); }
                            }
                        }
                    },
                    "$iif($notify($1),$style(1)) Notify": {
                        "name": BSWindow.active.server.evalCommand('$iif($notify($1),$style(1)) Notify', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notify $iif($notify($1),-r) $1', vars)); }
                    },
                    "$iif($ignore($address($1,2)),$style(1)) Ignore": {
                        "name": BSWindow.active.server.evalCommand('$iif($ignore($address($1,2)),$style(1)) Ignore', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ignore $iif($ignore($address($1,2)),-r) $1 2', vars)); }
                    },
                    "$iif($isfile($mklogfn($1)),View private log...)": {
                        "name": BSWindow.active.server.evalCommand('$iif($isfile($mklogfn($1)),View private log...)', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('run $mklogfn($1)', vars)); }
                    },
                    "sep29": "",
                    "Slap!": {
                        "name": BSWindow.active.server.evalCommand('Slap!', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('slap $1', vars)); }
                    }
                }
            };
        }
    });






    $.contextMenu({
        selector: '#scrollBox',
        className: 'contextmenu-custom',
        build: function($trigger, e) {
            var vars = {text: BSWindow.active.server.ident.active(), chan: BSWindow.active.server.ident.active()};
            if (BSWindow.active.server.ident.active() == 'Status') {
                return {
                    items: {
                        "server": {
                            "name": BSWindow.active.server.evalCommand('$server', vars),
                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('lusers', vars)); }
                        },
                        "sep0": "",
                        "Commands": {
                            "name": BSWindow.active.server.evalCommand('Commands', vars),
                            "items": {
                                "Info": {
                                    "name": BSWindow.active.server.evalCommand('Info', vars),
                                    "items": {
                                        "Admininformation": {
                                            "name": BSWindow.active.server.evalCommand('Admin information', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ADMIN', vars)); }
                                        },
                                        "Serverinformation": {
                                            "name": BSWindow.active.server.evalCommand('Server information', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('INFO', vars)); }
                                        },
                                        "Lusers": {
                                            "name": BSWindow.active.server.evalCommand('Lusers', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('LUSERS', vars)); }
                                        },
                                        "MOTD": {
                                            "name": BSWindow.active.server.evalCommand('MOTD', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MOTD', vars)); }
                                        },
                                        "ServerTime": {
                                            "name": BSWindow.active.server.evalCommand('Server Time', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('TIME', vars)); }
                                        }
                                    }
                                },
                                "Serverstatistics": {
                                    "name": BSWindow.active.server.evalCommand('Server statistics', vars),
                                    "items": {
                                        "Viewlinkblocksc": {
                                            "name": BSWindow.active.server.evalCommand('View link blocks\tc', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS c', vars)); }
                                        },
                                        "Viewelineslocalbanexemptionse": {
                                            "name": BSWindow.active.server.evalCommand('View e-lines (local ban exemptions)\te', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS e', vars)); }
                                        },
                                        "Viewglinesglobalbansg": {
                                            "name": BSWindow.active.server.evalCommand('View g-lines (global bans)\tg', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS g', vars)); }
                                        },
                                        "Viewklineslocalbansk": {
                                            "name": BSWindow.active.server.evalCommand('View k-lines (local bans)\tk', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS k', vars)); }
                                        },
                                        "Viewallclientconnectionswithinformationandhostl": {
                                            "name": BSWindow.active.server.evalCommand('View all client connections with information and host\tl', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS l', vars)); }
                                        },
                                        "ViewallclientconnectionswithinformationandIPaddressL": {
                                            "name": BSWindow.active.server.evalCommand('View all client connections with information and IP address\tL', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS L', vars)); }
                                        },
                                        "Viewcommandstatisticsnumberoftimescommandshavebeenusedm": {
                                            "name": BSWindow.active.server.evalCommand('View command statistics, number of times commands have been used\tm', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS m', vars)); }
                                        },
                                        "Viewalistofallvalidoperusernamesandhostmaskso": {
                                            "name": BSWindow.active.server.evalCommand('View a list of all valid oper usernames and hostmasks\to', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS o', vars)); }
                                        },
                                        "Viewqlinesnickmaskbansq": {
                                            "name": BSWindow.active.server.evalCommand('View q-lines (nick mask bans)\tq', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS q', vars)); }
                                        },
                                        "Viewserveruptimeu": {
                                            "name": BSWindow.active.server.evalCommand('View server uptime\tu', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS u', vars)); }
                                        },
                                        "Viewfilterdefinitionss": {
                                            "name": BSWindow.active.server.evalCommand('View filter definitions\ts', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS s', vars)); }
                                        },
                                        "ViewbandwidthsocketstatisticsT": {
                                            "name": BSWindow.active.server.evalCommand('View bandwidth/socket statistics\tT', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS T', vars)); }
                                        },
                                        "ViewconnectclasspermissionsI": {
                                            "name": BSWindow.active.server.evalCommand('View connect class permissions\tI', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS I', vars)); }
                                        },
                                        "ViewonlineopersandtheiridletimesP": {
                                            "name": BSWindow.active.server.evalCommand('View online opers and their idle times\tP', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS P', vars)); }
                                        },
                                        "Viewopenclientportsandtheporttypesslplaintextetcplusnumberofusersoneachportp": {
                                            "name": BSWindow.active.server.evalCommand('View open client ports, and the port type (ssl, plaintext, etc) plus number of users on each port\tp', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS p', vars)); }
                                        },
                                        "ViewulinedserversU": {
                                            "name": BSWindow.active.server.evalCommand('View u-lined servers\tU', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS U', vars)); }
                                        },
                                        "ViewconnectionclassesY": {
                                            "name": BSWindow.active.server.evalCommand('View connection classes\tY', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS Y', vars)); }
                                        },
                                        "Viewmemoryusagestatisticsz": {
                                            "name": BSWindow.active.server.evalCommand('View memory usage statistics\tz', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS z', vars)); }
                                        },
                                        "ViewzlinesipmaskbansZ": {
                                            "name": BSWindow.active.server.evalCommand('View z-lines (ip mask bans)\tZ', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('.raw STATS Z', vars)); }
                                        }
                                    }
                                },
                                "sep1": "",
                                "Changenick": {
                                    "name": BSWindow.active.server.evalCommand('Change nick...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICK $$input(New nick?,qe,Change nick)', vars)); }
                                },
                                "sep2": "",
                                "Joinchannel": {
                                    "name": BSWindow.active.server.evalCommand('Join channel...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('JOIN $chan$$input(What channel do you want to join?,qe,Join channel)', vars)); }
                                },
                                "Listchannels": {
                                    "name": BSWindow.active.server.evalCommand('List channels', vars),
                                    "items": {
                                        "All": {
                                            "name": BSWindow.active.server.evalCommand('All', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('LIST', vars)); }
                                        },
                                        "Search": {
                                            "name": BSWindow.active.server.evalCommand('Search...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('LIST $$input(What channel name pattern?,qe,List channels,*)', vars)); }
                                        }
                                    }
                                },
                                "sep3": "",
                                "ViewUserhost": {
                                    "name": BSWindow.active.server.evalCommand('View Userhost...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('USERHOST $input(What nickname do you want to view its userhost?,qe,View userhost)', vars)); }
                                },
                                "Searchusers": {
                                    "name": BSWindow.active.server.evalCommand('Search users', vars),
                                    "items": {
                                        "IRCoperators": {
                                            "name": BSWindow.active.server.evalCommand('IRC operators', vars),
                                            "items": {
                                                "All": {
                                                    "name": BSWindow.active.server.evalCommand('All', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO * ouh', vars)); }
                                                },
                                                "Bynick": {
                                                    "name": BSWindow.active.server.evalCommand('By nick...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What nickname pattern?,qe,Search IRC operators) ouh', vars)); }
                                                },
                                                "Byrealname": {
                                                    "name": BSWindow.active.server.evalCommand('By realname...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What realname pattern?,qe,Search IRC operators) oruh', vars)); }
                                                },
                                                "Bymodes": {
                                                    "name": BSWindow.active.server.evalCommand('By modes...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What modes?,qe,Search IRC operators) omuh', vars)); }
                                                }
                                            }
                                        },
                                        "All": {
                                            "name": BSWindow.active.server.evalCommand('All', vars),
                                            "items": {
                                                "All": {
                                                    "name": BSWindow.active.server.evalCommand('All', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO * uh', vars)); }
                                                },
                                                "Bynick": {
                                                    "name": BSWindow.active.server.evalCommand('By nick...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What nickname pattern?,qe,Search users) uh', vars)); }
                                                },
                                                "Byrealname": {
                                                    "name": BSWindow.active.server.evalCommand('By realname...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What realname pattern?,qe,Search users) ruh', vars)); }
                                                },
                                                "Bymodes": {
                                                    "name": BSWindow.active.server.evalCommand('By modes...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(What modes?,qe,Search users) muh', vars)); }
                                                }
                                            }
                                        },
                                        "sep4": "",
                                        "Custom": {
                                            "name": BSWindow.active.server.evalCommand('Custom...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHO $input(Search pattern?,qe) $input(Flags?,qe)', vars)); }
                                        }
                                    }
                                },
                                "Whoisuser": {
                                    "name": BSWindow.active.server.evalCommand('Whois user...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHOIS $input(What nickname do you wanto do whois?,qe,Whois user)', vars)); }
                                },
                                "Whowasuser": {
                                    "name": BSWindow.active.server.evalCommand('Whowas user...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHOWAS $input(What nickname do you wanto do whowas?,qe,Whowas user)', vars)); }
                                }
                            }
                        },
                        "UserModes": {
                            "name": BSWindow.active.server.evalCommand('UserModes', vars),
                            "items": {
                                "meusermode": {
                                    "name": BSWindow.active.server.evalCommand('$me $usermode', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('mode $me', vars)); }
                                },
                                "sep5": "",
                                "iifiisincsusermodestyleInvisiblei": {
                                    "name": BSWindow.active.server.evalCommand('$iif(i isincs $usermode,$style(1)) Invisible\ti', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(i isincs $usermode,-,+) $+ i', vars)); }
                                },
                                "iifsisincsusermodestyleReceiveservernoticess": {
                                    "name": BSWindow.active.server.evalCommand('$iif(s isincs $usermode,$style(1)) Receive server notices\ts', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(s isincs $usermode,-,+) $+ s', vars)); }
                                },
                                "iifwisincsusermodestyleReceiveWALLOPSw": {
                                    "name": BSWindow.active.server.evalCommand('$iif(w isincs $usermode,$style(1)) Receive WALLOPS\tw', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(w isincs $usermode,-,+) $+ w', vars)); }
                                },
                                "iifBisincsusermodestyleMarkedasbeingabotB": {
                                    "name": BSWindow.active.server.evalCommand('$iif(B isincs $usermode,$style(1)) Marked as being a bot\tB', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(B isincs $usermode,-,+) $+ B', vars)); }
                                },
                                "iifRisincsusermodestyleOnlyallowregisteredandidentifieduserstomessageyouR": {
                                    "name": BSWindow.active.server.evalCommand('$iif(R isincs $usermode,$style(1)) Only allow registered and identified users to message you\tR', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(R isincs $usermode,-,+) $+ R', vars)); }
                                },
                                "iifSisincsusermodestyleStripscolourfromprivatemessagesS": {
                                    "name": BSWindow.active.server.evalCommand('$iif(S isincs $usermode,$style(1)) Strips colour from private messages\tS', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(S isincs $usermode,-,+) $+ S', vars)); }
                                },
                                "iifWisincsusermodestyleReceiveanotificationwhenWHOISedW": {
                                    "name": BSWindow.active.server.evalCommand('$iif(W isincs $usermode,$style(1)) Receive a notification when WHOISed\tW', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(W isincs $usermode,-,+) $+ W', vars)); }
                                },
                                "iifxisincsusermodestyleMaskyourhostnamex": {
                                    "name": BSWindow.active.server.evalCommand('$iif(x isincs $usermode,$style(1)) Mask your hostname\tx', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $iif(x isincs $usermode,-,+) $+ x', vars)); }
                                },
                                "sep6": "",
                                "Setcustomusermodes": {
                                    "name": BSWindow.active.server.evalCommand('Set custom usermodes...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $me $$input(What modes?,qe,Set custom usermodes)', vars)); }
                                }
                            }
                        },
                        "sep7": "",
                        "NickServ": {
                            "name": BSWindow.active.server.evalCommand('NickServ', vars),
                            "items": {
                                "Registernick": {
                                    "name": BSWindow.active.server.evalCommand('Register nick...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('$null', vars)); }
                                },
                                "Login": {
                                    "name": BSWindow.active.server.evalCommand('Login...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV identify $input(What is account you want to login?,qe,Login,$me) $$input(What is your account password?,qep,Login)', vars)); }
                                },
                                "Logout": {
                                    "name": BSWindow.active.server.evalCommand('Logout', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV logout', vars)); }
                                },
                                "Dropaccount": {
                                    "name": BSWindow.active.server.evalCommand('Drop account...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV drop $$input(What is the account you want to drop?,qe) $$input(What is the account password?,qe,Drop account)', vars)); }
                                },
                                "sep8": "",
                                "Ghostnickname": {
                                    "name": BSWindow.active.server.evalCommand('Ghost nickname...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV ghost $$input(What is the target nickname you want to ghost?,qe,Ghost nickname) $input(What is the account password? $+ $str($crlf,2) $+ This is optional if you are logged in on that account.,qep,Ghost nickname)', vars)); }
                                },
                                "Releasenickname": {
                                    "name": BSWindow.active.server.evalCommand('Release nickname...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV release $$input(What is the target nickname you want to release?,qe,Release nickname) $input(What is the account password? $+ $str($crlf,2) $+ This is optional if you are logged in on that account.,qep,Release nickname)', vars)); }
                                },
                                "sep9": "",
                                "Group": {
                                    "name": BSWindow.active.server.evalCommand('Group', vars),
                                    "items": {
                                        "Addmetoyouraccount": {
                                            "name": BSWindow.active.server.evalCommand('Add  $+ $me $+  to your account', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV group', vars)); }
                                        },
                                        "Removemefromyouraccount": {
                                            "name": BSWindow.active.server.evalCommand('Remove  $+ $me $+  from your account', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV ungroup', vars)); }
                                        }
                                    }
                                },
                                "sep10": "",
                                "Displayaccountinformation": {
                                    "name": BSWindow.active.server.evalCommand('Display account information...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV info $input(What is the account you want to display information? $+ $str($crlf,2) $+ A = behind a nickname will display the information of the account wich that nickname is logged in.,qe,Display account information,= $+ $me)', vars)); }
                                },
                                "Listyourchannelaccess": {
                                    "name": BSWindow.active.server.evalCommand('List your channel access', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV listchans', vars)); }
                                },
                                "sep11": "",
                                "Youraccountsettings": {
                                    "name": BSWindow.active.server.evalCommand('Your account settings', vars),
                                    "items": {
                                        "Changeemail": {
                                            "name": BSWindow.active.server.evalCommand('Change e-mail...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set email $$input(What is the new e-mail for your account?,qe,Change e-mail)', vars)); }
                                        },
                                        "Changepassword": {
                                            "name": BSWindow.active.server.evalCommand('Change password...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set password $input(What is the new password for your account?,qe,Change password)', vars)); }
                                        },
                                        "sep12": "",
                                        "Memoreceiving": {
                                            "name": BSWindow.active.server.evalCommand('Memo receiving', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set nomemo on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set nomemo off', vars)); }
                                                },
                                                "sep13": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set nomemo', vars)); }
                                                }
                                            }
                                        },
                                        "Receivememosbyemail": {
                                            "name": BSWindow.active.server.evalCommand('Receive memos by email', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set emailmemos on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set emailmemos off', vars)); }
                                                },
                                                "sep14": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set emailmemos', vars)); }
                                                }
                                            }
                                        },
                                        "Protectyournicknames": {
                                            "name": BSWindow.active.server.evalCommand('Protect your nicknames', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set enforce on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set enforce off', vars)); }
                                                },
                                                "sep15": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set enforce', vars)); }
                                                }
                                            }
                                        },
                                        "Hideyouremailfrominfo": {
                                            "name": BSWindow.active.server.evalCommand('Hide your e-mail from info', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set hidemail on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set hidemail off', vars)); }
                                                },
                                                "sep16": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set hidemail', vars)); }
                                                }
                                            }
                                        },
                                        "Preventfromreceivingchannelaccess": {
                                            "name": BSWindow.active.server.evalCommand('Prevent from receiving channel access', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set neverop on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set neverop off', vars)); }
                                                },
                                                "sep17": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set neverop', vars)); }
                                                }
                                            }
                                        },
                                        "Preventfromreceivingoponjoin": {
                                            "name": BSWindow.active.server.evalCommand('Prevent from receiving op on join', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set noop on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set noop off', vars)); }
                                                },
                                                "sep18": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set noop', vars)); }
                                                }
                                            }
                                        },
                                        "sep19": "",
                                        "Channelstatusnotification": {
                                            "name": BSWindow.active.server.evalCommand('Channel status notification', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set QUIETCHG off', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set QUIETCHG on', vars)); }
                                                },
                                                "sep20": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set QUIETCHG', vars)); }
                                                }
                                            }
                                        },
                                        "Nickservmessaging": {
                                            "name": BSWindow.active.server.evalCommand('Nickserv messaging', vars),
                                            "items": {
                                                "ReceivemessagesfromNickservbyNotice": {
                                                    "name": BSWindow.active.server.evalCommand('Receive messages from Nickserv by Notice', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set privmsg off', vars)); }
                                                },
                                                "ReceivemessagesfromNickservbyPrivateMessage": {
                                                    "name": BSWindow.active.server.evalCommand('Receive messages from Nickserv by Private Message', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set privmsg on', vars)); }
                                                },
                                                "sep21": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set privmsg', vars)); }
                                                }
                                            }
                                        },
                                        "Hideprivateinformation": {
                                            "name": BSWindow.active.server.evalCommand('Hide private information', vars),
                                            "items": {
                                                "Enable": {
                                                    "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set private on', vars)); }
                                                },
                                                "Disable": {
                                                    "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set private off', vars)); }
                                                },
                                                "sep22": "",
                                                "Help": {
                                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set private', vars)); }
                                                }
                                            }
                                        },
                                        "sep23": "",
                                        "Changeaccountname": {
                                            "name": BSWindow.active.server.evalCommand('Change account name...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV SET accountname $$input(What is the new account name for your account?,qe,Change account name)', vars)); }
                                        },
                                        "Editmetadata": {
                                            "name": BSWindow.active.server.evalCommand('Edit metadata...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV set property $$input(What is the property you want to change?,qe,Edit metadata) $input(What is the value you want to set to this property?,qe,Edit metadata)', vars)); }
                                        },
                                        "sep24": "",
                                        "Help": {
                                            "name": BSWindow.active.server.evalCommand('Help', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help set', vars)); }
                                        }
                                    }
                                },
                                "sep25": "",
                                "Accesslist": {
                                    "name": BSWindow.active.server.evalCommand('Access list', vars),
                                    "items": {
                                        "Add": {
                                            "name": BSWindow.active.server.evalCommand('Add...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV access add $$input(What is the mask you want to add to your access list?,qe,Access list)', vars)); }
                                        },
                                        "Del": {
                                            "name": BSWindow.active.server.evalCommand('Del...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV access del $$input(What is the mask you want to remove your access list?,qe,Access list)', vars)); }
                                        },
                                        "sep26": "",
                                        "Listyouraccesslist": {
                                            "name": BSWindow.active.server.evalCommand('List your access list', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV access list', vars)); }
                                        },
                                        "sep27": "",
                                        "Help": {
                                            "name": BSWindow.active.server.evalCommand('Help', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help access', vars)); }
                                        }
                                    }
                                },
                                "Displayaccountloginstatus": {
                                    "name": BSWindow.active.server.evalCommand('Display account login status...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV acc $$input(What is the account you want to see the login status?,qe,Display account login status,$me)', vars)); }
                                },
                                "Displayyourstatus": {
                                    "name": BSWindow.active.server.evalCommand('Display your status', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV status', vars)); }
                                },
                                "Displayaccountmetadata": {
                                    "name": BSWindow.active.server.evalCommand('Display account metadata...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV taxonomy $$input(What is the account you want to display metadata?,qe,Display account metadata)', vars)); }
                                },
                                "sep28": "",
                                "Help": {
                                    "name": BSWindow.active.server.evalCommand('Help', vars),
                                    "items": {
                                        "ListallNickservcommands": {
                                            "name": BSWindow.active.server.evalCommand('List all Nickserv commands', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help', vars)); }
                                        },
                                        "Gethelpaboutacommand": {
                                            "name": BSWindow.active.server.evalCommand('Get help about a command...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV help $input(What is the command you want to get help?,qe,Help)', vars)); }
                                        }
                                    }
                                }
                            }
                        },
                        "ChanServ": {
                            "name": BSWindow.active.server.evalCommand('ChanServ', vars),
                            "items": {
                                "Requestinvite": {
                                    "name": BSWindow.active.server.evalCommand('Request invite...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV invite $chan$$input(What is the channel you want to be invited?,qe,Request invite)', vars)); }
                                },
                                "Getkey": {
                                    "name": BSWindow.active.server.evalCommand('Get key...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV getkey $chan$$input(What is the channel you want to know the key?,qe,Get key)', vars)); }
                                },
                                "sep29": "",
                                "Recover": {
                                    "name": BSWindow.active.server.evalCommand('Recover...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV recover $chan$$input(What is the channel you want to recover?,qe,Recover)', vars)); }
                                },
                                "sep30": "",
                                "Displayyourstatus": {
                                    "name": BSWindow.active.server.evalCommand('Display your status...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV status $chan$$input(What is the channel you want to display your status?,qe,Display your status)', vars)); }
                                },
                                "Displayinformation": {
                                    "name": BSWindow.active.server.evalCommand('Display information...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV info $chan$$input(What is the channel you want to display information?,qe,Display information)', vars)); }
                                },
                                "Displaymetadata": {
                                    "name": BSWindow.active.server.evalCommand('Display metadata...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV taxonomy $chan$$input(What is the channel you want to display the metadata?,qe,Display metadata)', vars)); }
                                }
                            }
                        },
                        "MemoServ": {
                            "name": BSWindow.active.server.evalCommand('MemoServ', vars),
                            "items": {
                                "Read": {
                                    "name": BSWindow.active.server.evalCommand('Read', vars),
                                    "items": {
                                        "Readnewmemos": {
                                            "name": BSWindow.active.server.evalCommand('Read new memos', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV read new', vars)); }
                                        },
                                        "Readamemo": {
                                            "name": BSWindow.active.server.evalCommand('Read a memo...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV read $$input(What is the memo number?,qe,Read a memo)', vars)); }
                                        }
                                    }
                                },
                                "Delete": {
                                    "name": BSWindow.active.server.evalCommand('Delete', vars),
                                    "items": {
                                        "Deleteallmemos": {
                                            "name": BSWindow.active.server.evalCommand('Delete all memos', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV delete all', vars)); }
                                        },
                                        "Deleteamemo": {
                                            "name": BSWindow.active.server.evalCommand('Delete a memo...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV delete $$input(What is the memo number?,qe,Delete a memo)', vars)); }
                                        }
                                    }
                                },
                                "sep31": "",
                                "Listyourmemos": {
                                    "name": BSWindow.active.server.evalCommand('List your memos', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV list', vars)); }
                                },
                                "sep32": "",
                                "Sendamemo": {
                                    "name": BSWindow.active.server.evalCommand('Send a memo...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV send $$input(What is the destination account?,qe,Send a memo) $$input(What is the message?,qe,Send a memo)', vars)); }
                                },
                                "Forwardamemo": {
                                    "name": BSWindow.active.server.evalCommand('Forward a memo...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV forward $$input(What is the destination account?,qe,Forward a memo) $$input(What is the memo number?,qe,Forward a memo)', vars)); }
                                },
                                "sep33": "",
                                "Ignoreuser": {
                                    "name": BSWindow.active.server.evalCommand('Ignore user', vars),
                                    "items": {
                                        "Add": {
                                            "name": BSWindow.active.server.evalCommand('Add...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV ignore add $input(What is the account you want to ignore?,qe,Ignore)', vars)); }
                                        },
                                        "Del": {
                                            "name": BSWindow.active.server.evalCommand('Del...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV ignore del $input(What is the account you want to unignore?,qe,Ignore)', vars)); }
                                        },
                                        "sep34": "",
                                        "Clear": {
                                            "name": BSWindow.active.server.evalCommand('Clear', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MEMOSERV ignore clear', vars)); }
                                        }
                                    }
                                }
                            }
                        },
                        "sep35": "",
                        "IRCOperator": {
                            "name": BSWindow.active.server.evalCommand('IRC Operator', vars),
                            "items": {
                                "NickServ": {
                                    "name": BSWindow.active.server.evalCommand('NickServ', vars),
                                    "items": {
                                        "Freezeaccount": {
                                            "name": BSWindow.active.server.evalCommand('Freeze account', vars),
                                            "items": {
                                                "On": {
                                                    "name": BSWindow.active.server.evalCommand('On...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV freeze $$input(What is the account you want do freeze?,qe,Freeze account) on', vars)); }
                                                },
                                                "Off": {
                                                    "name": BSWindow.active.server.evalCommand('Off...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV freeze $$input(What is the account you want to unfreeze?,qe,Freeze account) off', vars)); }
                                                }
                                            }
                                        },
                                        "Dropaccount": {
                                            "name": BSWindow.active.server.evalCommand('Drop account...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV fdrop $$input(What is the account you want to forcefully drop?,qe,Force drop)', vars)); }
                                        },
                                        "Ungroupnickname": {
                                            "name": BSWindow.active.server.evalCommand('Ungroup nickname...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV fungroup $$input(What is the nickname you want to forcefully ungroup from its account?,qe,Force ungroup)', vars)); }
                                        },
                                        "Verifyaccount": {
                                            "name": BSWindow.active.server.evalCommand('Verify account...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV fverify $$input(What is the operation you want to forcefully verify?,qe) $input(What is the account you want to forcefully verify the operation?,qe,Force verify)', vars)); }
                                        },
                                        "Holdaccount": {
                                            "name": BSWindow.active.server.evalCommand('Hold account', vars),
                                            "items": {
                                                "On": {
                                                    "name": BSWindow.active.server.evalCommand('On...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV hold $$input(What account do you want to prevent from expiring?,qe,Hold) on', vars)); }
                                                },
                                                "Off": {
                                                    "name": BSWindow.active.server.evalCommand('Off...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV hold $$input(What account do you want to unprevent from expiring?,qe,Hold) off', vars)); }
                                                }
                                            }
                                        },
                                        "Listaccounts": {
                                            "name": BSWindow.active.server.evalCommand('List accounts', vars),
                                            "items": {
                                                "Bynickname": {
                                                    "name": BSWindow.active.server.evalCommand('By nickname...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV list $$input(What is the nickname pattern?,qe,List accounts,*)', vars)); }
                                                },
                                                "Byhostname": {
                                                    "name": BSWindow.active.server.evalCommand('By hostname...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV list $$input(What is the hostname pattern?,qe,List accounts,*!*@*)', vars)); }
                                                },
                                                "Byemail": {
                                                    "name": BSWindow.active.server.evalCommand('By e-mail...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV listmail $$input(What is the e-mail pattern?,qe,List accounts,*@*)', vars)); }
                                                },
                                                "Byvirtualhost": {
                                                    "name": BSWindow.active.server.evalCommand('By virtual host...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV listvhost $$input(What is the virtual host pattern?,qe,List accounts,*)', vars)); }
                                                }
                                            }
                                        },
                                        "Markaccount": {
                                            "name": BSWindow.active.server.evalCommand('Mark account...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV mark $$input(What is the account you want to mark?,qe,Mark account) $iif($input(What is the reason you want to mark?,qe,Mark account),ON $ifmatch,OFF)', vars)); }
                                        },
                                        "Resetaccountpassword": {
                                            "name": BSWindow.active.server.evalCommand('Reset account password...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV resetpass $input(What is the account you want to reset password?,qe,Reset password)', vars)); }
                                        },
                                        "Returnaccount": {
                                            "name": BSWindow.active.server.evalCommand('Return account...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV return $input(What is the account you want to reset password and e-mail?,qe,Return account) $$input(What is the new e-mail for this account? $+ $str($crlf,2) $+ The new password will be sent to this e-mail.,qe,Return account)', vars)); }
                                        },
                                        "Sendaccountpassword": {
                                            "name": BSWindow.active.server.evalCommand('Send account password...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV sendpass $$input(What is the account you want to send a key to its e-mail?,qe,Send password)', vars)); }
                                        },
                                        "Editaccountvhost": {
                                            "name": BSWindow.active.server.evalCommand('Edit account vhost...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKSERV vhost $$input(What is the account you want to edit vhost?,qe) $iif($input(What is the new vhost for this account?,qe,Edit vhost),ON $ifmatch,OFF)', vars)); }
                                        }
                                    }
                                },
                                "OperServ": {
                                    "name": BSWindow.active.server.evalCommand('OperServ', vars),
                                    "items": {
                                        "Autokilllist": {
                                            "name": BSWindow.active.server.evalCommand('Auto-kill list', vars),
                                            "items": {
                                                "Add": {
                                                    "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV akill add $$input(What is the nickname or hostmask you want to add to auto-kill list?,qe,Auto-kill list) $iif($$input(Do you want this to be permanent?,qy,Auto-kill list),!P,!T $$input(How many minutes it may last?,qe,Auto-kill list))', vars)); }
                                                },
                                                "Del": {
                                                    "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV akill del $$input(What is the nickname or hostmask you want to remove from auto-kill list?,qe,Auto-kill list)', vars)); }
                                                },
                                                "sep36": "",
                                                "Displaylist": {
                                                    "name": BSWindow.active.server.evalCommand('Display list', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV akill list', vars)); }
                                                },
                                                "Displayfulllist": {
                                                    "name": BSWindow.active.server.evalCommand('Display full list', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV akill list full', vars)); }
                                                },
                                                "sep37": "",
                                                "Sync": {
                                                    "name": BSWindow.active.server.evalCommand('Sync', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV akill sync', vars)); }
                                                }
                                            }
                                        },
                                        "Ignorelist": {
                                            "name": BSWindow.active.server.evalCommand('Ignore list', vars),
                                            "items": {
                                                "Add": {
                                                    "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV ignore add $$input(What is the hostname mask you want to add to Operserv ignore list?,qe,OperServ ignore list) $$input(What is the reason?,qe,OperServ ignore list)', vars)); }
                                                },
                                                "Del": {
                                                    "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV ignore del $$input(What is the hostname mask you want to remove from Operserv ignore list?,qe,OperServ ignore list)', vars)); }
                                                },
                                                "sep38": "",
                                                "Displaylist": {
                                                    "name": BSWindow.active.server.evalCommand('Display list', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV ignore list', vars)); }
                                                },
                                                "Clearlist": {
                                                    "name": BSWindow.active.server.evalCommand('Clear list', vars),
                                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPERSERV ignore clear', vars)); }
                                                }
                                            }
                                        }
                                    }
                                },
                                "GlobalServ": {
                                    "name": BSWindow.active.server.evalCommand('GlobalServ', vars),
                                    "items": {
                                        "Addlinetocurrentmessageandsend": {
                                            "name": BSWindow.active.server.evalCommand('Add line to current message and send...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('|| GLOBALSERV global add $$input(What is the message?,qe,GlobalServ) || GLOBALSERV global send ||', vars)); }
                                        },
                                        "Addlinetocurrentmessage": {
                                            "name": BSWindow.active.server.evalCommand('Add line to current message...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('GLOBALSERV global add $$input(What is the message?,qe,GlobalServ)', vars)); }
                                        },
                                        "Sendmessage": {
                                            "name": BSWindow.active.server.evalCommand('Send message', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('GLOBALSERV global send', vars)); }
                                        },
                                        "sep39": "",
                                        "Clearcurrentmessage": {
                                            "name": BSWindow.active.server.evalCommand('Clear current message', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('GLOBALSERV global clear', vars)); }
                                        }
                                    }
                                },
                                "sep40": "",
                                "Operlogin": {
                                    "name": BSWindow.active.server.evalCommand('Oper login...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('OPER $input(Login?,qe) $input(Password?,qep)', vars)); }
                                },
                                "sep41": "",
                                "BanChannel": {
                                    "name": BSWindow.active.server.evalCommand('Ban Channel...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CBAN $bs.input.chan : $+ $input(Reason?,qe)', vars)); }
                                },
                                "sep42": "",
                                "Locknick": {
                                    "name": BSWindow.active.server.evalCommand('Lock nick', vars),
                                    "items": {
                                        "Lock": {
                                            "name": BSWindow.active.server.evalCommand('Lock...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKLOCK $input(Nick?,qe)', vars)); }
                                        },
                                        "Unlock": {
                                            "name": BSWindow.active.server.evalCommand('Unlock...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKUNLOCK $input(Nick?,qe)', vars)); }
                                        }
                                    }
                                },
                                "Sa": {
                                    "name": BSWindow.active.server.evalCommand('Sa(...)', vars),
                                    "items": {
                                        "Sajoin": {
                                            "name": BSWindow.active.server.evalCommand('Sajoin...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAJOIN $input(Nickname?,qe) $input(Channel?,qe)', vars)); }
                                        },
                                        "Samode": {
                                            "name": BSWindow.active.server.evalCommand('Samode...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAMODE $input(Target?,qe) $input(Modes?,qe)', vars)); }
                                        },
                                        "Sanick": {
                                            "name": BSWindow.active.server.evalCommand('Sanick...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SANICK $input(Nickname?,qe) $input(New nickname?,qe)', vars)); }
                                        },
                                        "Sapart": {
                                            "name": BSWindow.active.server.evalCommand('Sapart...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAPART $input(Nickname?,qe) $input(Channel?,qe)', vars)); }
                                        },
                                        "Saquit": {
                                            "name": BSWindow.active.server.evalCommand('Saquit...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAQUIT $input(Nickname?,qe) $input(Quit message?,qe)', vars)); }
                                        }
                                    }
                                },
                                "DisplayuserIP": {
                                    "name": BSWindow.active.server.evalCommand('Display user IP...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('USERIP $input(Nickame?,qe)', vars)); }
                                },
                                "sep43": "",
                                "Killuser": {
                                    "name": BSWindow.active.server.evalCommand('Kill user...', vars),
                                    "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('KILL $input(Nickname?,qe) $input(What reason?,qe,Kill)', vars)); }
                                },
                                "sep44": "",
                                "line": {
                                    "name": BSWindow.active.server.evalCommand('(...)line', vars),
                                    "items": {
                                        "Kline": {
                                            "name": BSWindow.active.server.evalCommand('Kline...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('KLINE $input(User@Host?,qe,Kline) $input([duration][y|w|d|h|m|s],qe,Kline) : $+ $input(What reason?,qe,Kline)', vars)); }
                                        },
                                        "Zline": {
                                            "name": BSWindow.active.server.evalCommand('Zline...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ZLINE $input(Ipmask?,qe,Zline) $input([duration][y|w|d|h|m|s],qe,Zline) : $+ $input(What reason?,qe,Zline)', vars)); }
                                        },
                                        "Qline": {
                                            "name": BSWindow.active.server.evalCommand('Qline...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('QLINE $input(Nickmask?,qe,Qline) $input([duration][y|w|d|h|m|s],qe,Qline) : $+ $input(What reason?,qe,Qline)', vars)); }
                                        },
                                        "Gline": {
                                            "name": BSWindow.active.server.evalCommand('Gline...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('GLINE $input(User@Host?,qe,Gline) $input([duration][y|w|d|h|m|s],qe,Gline) : $+ $input(What reason?,qe,Gline)', vars)); }
                                        },
                                        "Eline": {
                                            "name": BSWindow.active.server.evalCommand('Eline...', vars),
                                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ELINE $input(User@Host?,qe,Eline) $input([duration][y|w|d|h|m|s],qe,Eline) : $+ $input(What reason?,qe,Eline)', vars)); }
                                        }
                                    }
                                }
                            }
                        },
                        "sep45": "",
                        "QuitIRC": {
                            "name": BSWindow.active.server.evalCommand('Quit IRC', vars),
                            "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('QUIT', vars)); }
                        }
                    }



                }
            }
            if (/^#/.test(BSWindow.active.server.ident.active())) return {
                items: {
                    "$chan $+ ...": {
                        "name": BSWindow.active.server.evalCommand('$chan $+ ...', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('channel', vars)); }
                    },
                    "sep0": "",
                    "Modes": {
                        "name": BSWindow.active.server.evalCommand('Modes', vars),
                        "items": {
                            "$chan $chan($chan).mode": {
                                "name": BSWindow.active.server.evalCommand('$chan $chan($chan).mode', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('mode $chan', vars)); }
                            },
                            "sep1": "",
                            "Block messages containing that word\tg": {
                                "name": BSWindow.active.server.evalCommand('Block messages containing that word\tg', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif($input(Add word?,qy),+g,-g) $input(What word?,qe)', vars)); }
                            },
                            "$iif(k isincs $gettok($chan($chan).mode,1,32),$style(1)) Sets a password required to JOIN a channel\tk": {
                                "name": BSWindow.active.server.evalCommand('$iif(k isincs $gettok($chan($chan).mode,1,32),$style(1)) Sets a password required to JOIN a channel\tk', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(k isincs $gettok($chan($chan).mode,1,32),-k $chan($chan).key,+k $input(What key?,qe))', vars)); }
                            },
                            "$iif(J isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent automatic rejoin after kick\tJ": {
                                "name": BSWindow.active.server.evalCommand('$iif(J isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent automatic rejoin after kick\tJ', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(J isincs $gettok($chan($chan).mode,1,32),-J,+J $input(Secs?,qe))', vars)); }
                            },
                            "$iif(L isincs $gettok($chan($chan).mode,1,32),$style(1)) Adds redirect-when full\tL": {
                                "name": BSWindow.active.server.evalCommand('$iif(L isincs $gettok($chan($chan).mode,1,32),$style(1)) Adds redirect-when full\tL', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(L isincs $gettok($chan($chan).mode,1,32),-L,+L $input(Channel?,qe))', vars)); }
                            },
                            "$iif(f isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent message and notice floods\tf": {
                                "name": BSWindow.active.server.evalCommand('$iif(f isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent message and notice floods\tf', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(f isincs $gettok($chan($chan).mode,1,32),-f,+f $+($iif($input(Enable kickban?,qy),*),$input(Lines?,qe),:,$input(Secs?,qe)))', vars)); }
                            },
                            "$iif(j isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent join and cycle floods\tj": {
                                "name": BSWindow.active.server.evalCommand('$iif(j isincs $gettok($chan($chan).mode,1,32),$style(1)) Prevent join and cycle floods\tj', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(j isincs $gettok($chan($chan).mode,1,32),-j,+j $+($input(Lines?,qe),:,$input(Secs?,qe)))', vars)); }
                            },
                            "$iif(l isincs $gettok($chan($chan).mode,1,32),$style(1)) Limits the maximum number of people on a channel\tl": {
                                "name": BSWindow.active.server.evalCommand('$iif(l isincs $gettok($chan($chan).mode,1,32),$style(1)) Limits the maximum number of people on a channel\tl', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(l isincs $gettok($chan($chan).mode,1,32),-l,+l $input(Limit?,qe))', vars)); }
                            },
                            "$iif(C isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables CTCP to channels\tC": {
                                "name": BSWindow.active.server.evalCommand('$iif(C isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables CTCP to channels\tC', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(C isincs $gettok($chan($chan).mode,1,32),-,+) $+ C', vars)); }
                            },
                            "$iif(M isincs $gettok($chan($chan).mode,1,32),$style(1)) Only registered users may speak\tM": {
                                "name": BSWindow.active.server.evalCommand('$iif(M isincs $gettok($chan($chan).mode,1,32),$style(1)) Only registered users may speak\tM', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(M isincs $gettok($chan($chan).mode,1,32),-,+) $+ M', vars)); }
                            },
                            "$iif(N isincs $gettok($chan($chan).mode,1,32),$style(1)) No nick changes\tN": {
                                "name": BSWindow.active.server.evalCommand('$iif(N isincs $gettok($chan($chan).mode,1,32),$style(1)) No nick changes\tN', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(N isincs $gettok($chan($chan).mode,1,32),-,+) $+ N', vars)); }
                            },
                            "$iif(O isincs $gettok($chan($chan).mode,1,32),$style(1)) Opers-only can join channel\tO": {
                                "name": BSWindow.active.server.evalCommand('$iif(O isincs $gettok($chan($chan).mode,1,32),$style(1)) Opers-only can join channel\tO', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(O isincs $gettok($chan($chan).mode,1,32),-,+) $+ O', vars)); }
                            },
                            "$iif(P isincs $gettok($chan($chan).mode,1,32),$style(1)) Block all-caps lines\tP": {
                                "name": BSWindow.active.server.evalCommand('$iif(P isincs $gettok($chan($chan).mode,1,32),$style(1)) Block all-caps lines\tP', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(P isincs $gettok($chan($chan).mode,1,32),-,+) $+ P', vars)); }
                            },
                            "$iif(Q isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables KICK on a channel\tQ": {
                                "name": BSWindow.active.server.evalCommand('$iif(Q isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables KICK on a channel\tQ', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(Q isincs $gettok($chan($chan).mode,1,32),-,+) $+ Q', vars)); }
                            },
                            "$iif(R isincs $gettok($chan($chan).mode,1,32),$style(1)) Only registered users may join\tR": {
                                "name": BSWindow.active.server.evalCommand('$iif(R isincs $gettok($chan($chan).mode,1,32),$style(1)) Only registered users may join\tR', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(R isincs $gettok($chan($chan).mode,1,32),-,+) $+ R', vars)); }
                            },
                            "$iif(S isincs $gettok($chan($chan).mode,1,32),$style(1)) Strips colour from messages\tS": {
                                "name": BSWindow.active.server.evalCommand('$iif(S isincs $gettok($chan($chan).mode,1,32),$style(1)) Strips colour from messages\tS', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(S isincs $gettok($chan($chan).mode,1,32),-,+) $+ S', vars)); }
                            },
                            "$iif(T isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables sending of NOTICEs to a channel\tT": {
                                "name": BSWindow.active.server.evalCommand('$iif(T isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables sending of NOTICEs to a channel\tT', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(T isincs $gettok($chan($chan).mode,1,32),-,+) $+ T', vars)); }
                            },
                            "$iif(V isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables INVITE on a channel\tV": {
                                "name": BSWindow.active.server.evalCommand('$iif(V isincs $gettok($chan($chan).mode,1,32),$style(1)) Disables INVITE on a channel\tV', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(V isincs $gettok($chan($chan).mode,1,32),-,+) $+ V', vars)); }
                            },
                            "$iif(c isincs $gettok($chan($chan).mode,1,32),$style(1)) Blocks messages containing colour codes\tc": {
                                "name": BSWindow.active.server.evalCommand('$iif(c isincs $gettok($chan($chan).mode,1,32),$style(1)) Blocks messages containing colour codes\tc', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(c isincs $gettok($chan($chan).mode,1,32),-,+) $+ c', vars)); }
                            },
                            "$iif(i isincs $gettok($chan($chan).mode,1,32),$style(1)) Invite only\ti": {
                                "name": BSWindow.active.server.evalCommand('$iif(i isincs $gettok($chan($chan).mode,1,32),$style(1)) Invite only\ti', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(i isincs $gettok($chan($chan).mode,1,32),-,+) $+ i', vars)); }
                            },
                            "$iif(m isincs $gettok($chan($chan).mode,1,32),$style(1)) Moderated channel\tm": {
                                "name": BSWindow.active.server.evalCommand('$iif(m isincs $gettok($chan($chan).mode,1,32),$style(1)) Moderated channel\tm', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(m isincs $gettok($chan($chan).mode,1,32),-,+) $+ m', vars)); }
                            },
                            "$iif(n isincs $gettok($chan($chan).mode,1,32),$style(1)) No external messages\tn": {
                                "name": BSWindow.active.server.evalCommand('$iif(n isincs $gettok($chan($chan).mode,1,32),$style(1)) No external messages\tn', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(n isincs $gettok($chan($chan).mode,1,32),-,+) $+ n', vars)); }
                            },
                            "$iif(p isincs $gettok($chan($chan).mode,1,32),$style(1)) Private\tp": {
                                "name": BSWindow.active.server.evalCommand('$iif(p isincs $gettok($chan($chan).mode,1,32),$style(1)) Private\tp', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(p isincs $gettok($chan($chan).mode,1,32),-,+) $+ p', vars)); }
                            },
                            "$iif(s isincs $gettok($chan($chan).mode,1,32),$style(1)) Secret\ts": {
                                "name": BSWindow.active.server.evalCommand('$iif(s isincs $gettok($chan($chan).mode,1,32),$style(1)) Secret\ts', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(s isincs $gettok($chan($chan).mode,1,32),-,+) $+ s', vars)); }
                            },
                            "$iif(t isincs $gettok($chan($chan).mode,1,32),$style(1)) Only channel operators can change topic\tt": {
                                "name": BSWindow.active.server.evalCommand('$iif(t isincs $gettok($chan($chan).mode,1,32),$style(1)) Only channel operators can change topic\tt', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(t isincs $gettok($chan($chan).mode,1,32),-,+) $+ t', vars)); }
                            },
                            "$iif(z isincs $gettok($chan($chan).mode,1,32),$style(1)) Only allows SSL enabled users on the channel\tz": {
                                "name": BSWindow.active.server.evalCommand('$iif(z isincs $gettok($chan($chan).mode,1,32),$style(1)) Only allows SSL enabled users on the channel\tz', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $iif(z isincs $gettok($chan($chan).mode,1,32),-,+) $+ z', vars)); }
                            },
                            "sep2": "",
                            "Set custom modes...\t/mode": {
                                "name": BSWindow.active.server.evalCommand('Set custom modes...\t/mode', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('MODE $chan $input(What modes?,qe)', vars)); }
                            }
                        }
                    },
                    "Topic": {
                        "name": BSWindow.active.server.evalCommand('Topic', vars),
                        "items": {
                            "$iif($len($strip($chan($chan).topic)) < 64,$strip($chan($chan).topic),$left($strip($chan($chan).topic),64) $+ ...)": {
                                "name": BSWindow.active.server.evalCommand('$iif($len($strip($chan($chan).topic)) < 64,$strip($chan($chan).topic),$left($strip($chan($chan).topic),64) $+ ...)', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('TOPIC $chan', vars)); }
                            },
                            "sep3": "",
                            "Change topic...\t/topic": {
                                "name": BSWindow.active.server.evalCommand('Change topic...\t/topic', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('TOPIC $chan $$input(What topic?,qe,Change $chan topic,$chan($chan).topic)', vars)); }
                            }
                        }
                    },
                    "Invite": {
                        "name": BSWindow.active.server.evalCommand('Invite', vars),
                        "items": {
                            "Invite user...\t/invite": {
                                "name": BSWindow.active.server.evalCommand('Invite user...\t/invite', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('INVITE $input(What user do you want to invite to $chan $+ ?,qe,Invite user) $chan', vars)); }
                            },
                            "Uninvite user...\t/uninvite": {
                                "name": BSWindow.active.server.evalCommand('Uninvite user...\t/uninvite', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('UNINVITE $input(What user do you want to uninvite from $chan $+ ?,qe,Invite user) $chan', vars)); }
                            }
                        }
                    },
                    "sep4": "",
                    "ChanServ": {
                        "name": BSWindow.active.server.evalCommand('ChanServ', vars),
                        "items": {
                            "Display information": {
                                "name": BSWindow.active.server.evalCommand('Display information', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV info $chan', vars)); }
                            },
                            "sep5": "",
                            "Register channel": {
                                "name": BSWindow.active.server.evalCommand('Register channel', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV register $chan', vars)); }
                            },
                            "Transfer foundership...": {
                                "name": BSWindow.active.server.evalCommand('Transfer foundership...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan founder $input(What is the new founder?,qe,Transfer foundership)', vars)); }
                            },
                            "Drop": {
                                "name": BSWindow.active.server.evalCommand('Drop', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('if ($input(Are you sure? This will drop all channel settings and accesses.,qy,Drop channel)) CHANSERV drop $chan', vars)); }
                            },
                            "sep6": "",
                            "Access": {
                                "name": BSWindow.active.server.evalCommand('Access', vars),
                                "items": {
                                    "Access manager...": {
                                        "name": BSWindow.active.server.evalCommand('Access manager...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('csflags', vars)); }
                                    },
                                    "sep7": "",
                                    "VOP (auto +v)": {
                                        "name": BSWindow.active.server.evalCommand('VOP (auto +v)', vars),
                                        "items": {
                                            "Add...": {
                                                "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV vop $chan add $$input(What account or usermask do you want to add to the VOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,VOP)', vars)); }
                                            },
                                            "Del...": {
                                                "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV vop $chan del $$input(What account or usermask do you want to remove from the VOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,VOP)', vars)); }
                                            },
                                            "sep8": "",
                                            "List": {
                                                "name": BSWindow.active.server.evalCommand('List', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV vop $chan list', vars)); }
                                            }
                                        }
                                    },
                                    "HOP (auto +h)": {
                                        "name": BSWindow.active.server.evalCommand('HOP (auto +h)', vars),
                                        "items": {
                                            "Add...": {
                                                "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV hop $chan add $$input(What account or usermask do you want to add to the HOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,HOP)', vars)); }
                                            },
                                            "Del...": {
                                                "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV hop $chan del $$input(What account or usermask do you want to remove from the HOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,HOP)', vars)); }
                                            },
                                            "sep9": "",
                                            "List": {
                                                "name": BSWindow.active.server.evalCommand('List', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV hop $chan list', vars)); }
                                            }
                                        }
                                    },
                                    "AOP (auto +o)": {
                                        "name": BSWindow.active.server.evalCommand('AOP (auto +o)', vars),
                                        "items": {
                                            "Add...": {
                                                "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV aop $chan add $$input(What account or usermask do you want to add to the AOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,AOP)', vars)); }
                                            },
                                            "Del...": {
                                                "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV aop $chan del $$input(What account or usermask do you want to remove from the AOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,AOP)', vars)); }
                                            },
                                            "sep10": "",
                                            "List": {
                                                "name": BSWindow.active.server.evalCommand('List', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV aop $chan list', vars)); }
                                            }
                                        }
                                    },
                                    "SOP (auto +a)": {
                                        "name": BSWindow.active.server.evalCommand('SOP (auto +a)', vars),
                                        "items": {
                                            "Add...": {
                                                "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV sop $chan add $$input(What account or usermask do you want to add to the SOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,SOP)', vars)); }
                                            },
                                            "Del...": {
                                                "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV sop $chan del $$input(What account or usermask do you want to remove from the SOP list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,SOP)', vars)); }
                                            },
                                            "sep11": "",
                                            "List": {
                                                "name": BSWindow.active.server.evalCommand('List', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV sop $chan list', vars)); }
                                            }
                                        }
                                    },
                                    "sep12": "",
                                    "Akick (auto kick-ban)": {
                                        "name": BSWindow.active.server.evalCommand('Akick (auto kick-ban)', vars),
                                        "items": {
                                            "Add...": {
                                                "name": BSWindow.active.server.evalCommand('Add...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV akick $chan add $$input(What account or usermask do you want to add to the AKICK list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,AKICK)', vars)); }
                                            },
                                            "Del...": {
                                                "name": BSWindow.active.server.evalCommand('Del...', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV akick $chan del $$input(What account or usermask do you want to remove from the AKICK list? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,AKICK)', vars)); }
                                            },
                                            "sep13": "",
                                            "List": {
                                                "name": BSWindow.active.server.evalCommand('List', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV akick $chan list', vars)); }
                                            }
                                        }
                                    }
                                }
                            },
                            "Flags": {
                                "name": BSWindow.active.server.evalCommand('Flags', vars),
                                "items": {
                                    "Access manager...": {
                                        "name": BSWindow.active.server.evalCommand('Access manager...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('csflags', vars)); }
                                    },
                                    "sep14": "",
                                    "Give all flags...": {
                                        "name": BSWindow.active.server.evalCommand('Give all flags...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan $$input(What account or usermask do you want to add all flags? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,Give all flags) +*', vars)); }
                                    },
                                    "Remove all flags...": {
                                        "name": BSWindow.active.server.evalCommand('Remove all flags...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan $$input(What account or usermask do you want to remove all flags? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,Remove all flags) -*', vars)); }
                                    },
                                    "Set custom flags...": {
                                        "name": BSWindow.active.server.evalCommand('Set custom flags...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan $$input(What account or usermask do you want to set custom flags? $+ $str($crlf,2) $+ A = followed by a nickname will apply on the account wich that nickname is logged in.,qe,Remove all flags) $$input(What flags,qe?,Custom flags)', vars)); }
                                    },
                                    "sep15": "",
                                    "Enable auto-voice to everyone": {
                                        "name": BSWindow.active.server.evalCommand('Enable auto-voice to everyone', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan *!*@* +V', vars)); }
                                    },
                                    "Enable auto-halfop to everyone": {
                                        "name": BSWindow.active.server.evalCommand('Enable auto-halfop to everyone', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan *!*@* +H', vars)); }
                                    },
                                    "Enable auto-op to everyone": {
                                        "name": BSWindow.active.server.evalCommand('Enable auto-op to everyone', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan *!*@* +O', vars)); }
                                    },
                                    "sep16": "",
                                    "List all flags": {
                                        "name": BSWindow.active.server.evalCommand('List all flags', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV flags $chan', vars)); }
                                    },
                                    "Count flags": {
                                        "name": BSWindow.active.server.evalCommand('Count flags', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV count $chan', vars)); }
                                    }
                                }
                            },
                            "Topic": {
                                "name": BSWindow.active.server.evalCommand('Topic', vars),
                                "items": {
                                    "Change topic...": {
                                        "name": BSWindow.active.server.evalCommand('Change topic...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV topic $chan $$input(What topic?,qe,Change topic)', vars)); }
                                    },
                                    "Append to topic...": {
                                        "name": BSWindow.active.server.evalCommand('Append to topic...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV topicappend $chan $input(What do you want to append to topic?,qe,Append to topic)', vars)); }
                                    }
                                }
                            },
                            "Clear": {
                                "name": BSWindow.active.server.evalCommand('Clear', vars),
                                "items": {
                                    "Remove all bans": {
                                        "name": BSWindow.active.server.evalCommand('Remove all bans', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV clear $chan bans', vars)); }
                                    },
                                    "Kick all users...": {
                                        "name": BSWindow.active.server.evalCommand('Kick all users...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV clear $chan users $input(What reason?,qe,Kick all users)', vars)); }
                                    }
                                }
                            },
                            "Recover": {
                                "name": BSWindow.active.server.evalCommand('Recover', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('if ($input(Are you sure? This will deop everyone but you.,qy,Recover channel)) CHANSERV recover $chan', vars)); }
                            },
                            "sep17": "",
                            "Channel settings": {
                                "name": BSWindow.active.server.evalCommand('Channel settings', vars),
                                "items": {
                                    "Edit e-mail...": {
                                        "name": BSWindow.active.server.evalCommand('Edit e-mail...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan email $input(What e-mail?,qe,Edit e-mail)', vars)); }
                                    },
                                    "Edit url...": {
                                        "name": BSWindow.active.server.evalCommand('Edit url...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan url $input(Url?,qe,Edit url)', vars)); }
                                    },
                                    "Edit entry-message...": {
                                        "name": BSWindow.active.server.evalCommand('Edit entry-message...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan entrymsg $input(What entry-message?,qe,Edit entry-message)', vars)); }
                                    },
                                    "sep18": "",
                                    "Fantasy commands": {
                                        "name": BSWindow.active.server.evalCommand('Fantasy commands', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan fantasy on', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan fantasy off', vars)); }
                                            },
                                            "sep19": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan', vars)); }
                                            }
                                        }
                                    },
                                    "Preserve ChanServ on channel": {
                                        "name": BSWindow.active.server.evalCommand('Preserve ChanServ on channel', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan guard on', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan guard off', vars)); }
                                            },
                                            "sep20": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan guard', vars)); }
                                            }
                                        }
                                    },
                                    "Preserve topic": {
                                        "name": BSWindow.active.server.evalCommand('Preserve topic', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan keeptopic on', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan keeptopic off', vars)); }
                                            },
                                            "sep21": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan keeptopic', vars)); }
                                            }
                                        }
                                    },
                                    "Secure operators": {
                                        "name": BSWindow.active.server.evalCommand('Secure operators', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan secure on', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan secure off', vars)); }
                                            },
                                            "sep22": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan secure', vars)); }
                                            }
                                        }
                                    },
                                    "Verbose": {
                                        "name": BSWindow.active.server.evalCommand('Verbose', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan verbose on', vars)); }
                                            },
                                            "Ops only": {
                                                "name": BSWindow.active.server.evalCommand('Ops only', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan verbose ops', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan verbose off', vars)); }
                                            },
                                            "sep23": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan verbose', vars)); }
                                            }
                                        }
                                    },
                                    "Secure topic": {
                                        "name": BSWindow.active.server.evalCommand('Secure topic', vars),
                                        "items": {
                                            "Enable": {
                                                "name": BSWindow.active.server.evalCommand('Enable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan topiclock on', vars)); }
                                            },
                                            "Disable": {
                                                "name": BSWindow.active.server.evalCommand('Disable', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan topiclock off', vars)); }
                                            },
                                            "sep24": "",
                                            "Help": {
                                                "name": BSWindow.active.server.evalCommand('Help', vars),
                                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV help set $chan topiclock', vars)); }
                                            }
                                        }
                                    },
                                    "Force modes...": {
                                        "name": BSWindow.active.server.evalCommand('Force modes...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan mlock $iif($input(What modes do you want to force on channnel?,qe,Force modes,$chan($chan).mode),$ifmatch,OFF)', vars)); }
                                    },
                                    "sep25": "",
                                    "Edit metadata...": {
                                        "name": BSWindow.active.server.evalCommand('Edit metadata...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV set $chan property $$input(What metadata property do you want to edit?,qe) $input(What is the value you want to set to this property?,qe)', vars)); }
                                    }
                                }
                            },
                            "sep26": "",
                            "Display metadata": {
                                "name": BSWindow.active.server.evalCommand('Display metadata', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV taxonomy $chan', vars)); }
                            },
                            "Templates": {
                                "name": BSWindow.active.server.evalCommand('Templates', vars),
                                "items": {
                                    "List templates": {
                                        "name": BSWindow.active.server.evalCommand('List templates', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV template $chan', vars)); }
                                    },
                                    "Set template...": {
                                        "name": BSWindow.active.server.evalCommand('Set template...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV template $chan $$input(What template name?,qe,Set template) $$input(What are the flags changes for this template?,qe,Set template)', vars)); }
                                    },
                                    "Remove template...": {
                                        "name": BSWindow.active.server.evalCommand('Remove template...', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CHANSERV template $chan $$input(What template name?,qe,Set template) -*', vars)); }
                                    }
                                }
                            }
                        }
                    },
                    "sep27": "",
                    "IRC Operator": {
                        "name": BSWindow.active.server.evalCommand('IRC Operator', vars),
                        "items": {
                            "ChanServ": {
                                "name": BSWindow.active.server.evalCommand('ChanServ', vars)
                            },
                            "OperServ": {
                                "name": BSWindow.active.server.evalCommand('OperServ', vars)
                            },
                            "sep28": "",
                            "Ban Channel...": {
                                "name": BSWindow.active.server.evalCommand('Ban Channel...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('CBAN $chan : $+ $input(What reason?,qe,Ban channel)', vars)); }
                            },
                            "sep29": "",
                            "Sajoin...": {
                                "name": BSWindow.active.server.evalCommand('Sajoin...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAJOIN $$input(What nickname?,qe,Sajoin) $chan', vars)); }
                            },
                            "Samode...": {
                                "name": BSWindow.active.server.evalCommand('Samode...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAMODE $chan $$input(What modes?,qe,Samode)', vars)); }
                            },
                            "Sapart...": {
                                "name": BSWindow.active.server.evalCommand('Sapart...', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAPART $input(What nickname?,qe,Sapart) $chan', vars)); }
                            }
                        }
                    },
                    "sep30": "",
                    "Names": {
                        "name": BSWindow.active.server.evalCommand('Names', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('names $chan', vars)); }
                    },
                    "Who": {
                        "name": BSWindow.active.server.evalCommand('Who', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('who $chan', vars)); }
                    },
                    "sep31": "",
                    "Message": {
                        "name": BSWindow.active.server.evalCommand('Message', vars),
                        "items": {
                            "Send a message to $chan \t/say": {
                                "name": BSWindow.active.server.evalCommand('Send a message to $chan \t/say', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('msg $chan $$input(What message?,qe)', vars)); }
                            },
                            "sep32": "",
                            "Send a message to all channels\t/amsg": {
                                "name": BSWindow.active.server.evalCommand('Send a message to all channels\t/amsg', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('amsg $$input(What message?,qe)', vars)); }
                            },
                            "Send a message to all channels on all servers": {
                                "name": BSWindow.active.server.evalCommand('Send a message to all channels on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 amsg $$input(What message?,qe)', vars)); }
                            }
                        }
                    },
                    "Action": {
                        "name": BSWindow.active.server.evalCommand('Action', vars),
                        "items": {
                            "Send an action to $chan \t/me": {
                                "name": BSWindow.active.server.evalCommand('Send an action to $chan \t/me', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('describe $chan $$input(What action?,qe,Send action to channel)', vars)); }
                            },
                            "sep33": "",
                            "Send an action to all channels\t/ame": {
                                "name": BSWindow.active.server.evalCommand('Send an action to all channels\t/ame', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ame $$input(What action?,qe,Send action to channel)', vars)); }
                            },
                            "Send an action to all channels on all servers": {
                                "name": BSWindow.active.server.evalCommand('Send an action to all channels on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 ame $$input(What action?,qe,Send action to channel)', vars)); }
                            }
                        }
                    },
                    "Notice": {
                        "name": BSWindow.active.server.evalCommand('Notice', vars),
                        "items": {
                            "Send a notice to $chan \t/notice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $chan \t/notice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $chan $$input(What notice?,qe)', vars)); }
                            },
                            "Send a notice to $chan ops\t/onotice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $chan ops\t/onotice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $+(@,$chan) $$input(What notice?,qe)', vars)); }
                            },
                            "Send a notice to $chan halfops": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $chan halfops', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $+(%,$chan) $$input(What notice?,qe)', vars)); }
                            },
                            "Send a notice to $chan voices": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $chan voices', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $+(+,$chan) $$input(What notice?,qe)', vars)); }
                            },
                            "sep34": "",
                            "Send a notice to all chanels\t/anotice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to all chanels\t/anotice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('anotice $$input(What notice?,qe)', vars)); }
                            },
                            "Send a notice to all chanels on all servers": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to all chanels on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 anotice $$input(What notice?,qe)', vars)); }
                            }
                        }
                    },
                    "CTCP": {
                        "name": BSWindow.active.server.evalCommand('CTCP', vars),
                        "items": {
                            "Ping": {
                                "name": BSWindow.active.server.evalCommand('Ping', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan ping', vars)); }
                            },
                            "Time": {
                                "name": BSWindow.active.server.evalCommand('Time', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan time', vars)); }
                            },
                            "Version": {
                                "name": BSWindow.active.server.evalCommand('Version', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan version', vars)); }
                            },
                            "Source ctcp $chan source": {
                                "name": BSWindow.active.server.evalCommand('Source ctcp $chan source', vars)
                            },
                            "sep35": "",
                            "Page": {
                                "name": BSWindow.active.server.evalCommand('Page', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan page $input(What msg?,eq,CTCP Page)', vars)); }
                            },
                            "sep36": "",
                            "Finger": {
                                "name": BSWindow.active.server.evalCommand('Finger', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan finger', vars)); }
                            },
                            "Userinfo": {
                                "name": BSWindow.active.server.evalCommand('Userinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan userinfo', vars)); }
                            },
                            "Clientinfo": {
                                "name": BSWindow.active.server.evalCommand('Clientinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan clientinfo', vars)); }
                            },
                            "Sound": {
                                "name": BSWindow.active.server.evalCommand('Sound', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan sound', vars)); }
                            },
                            "sep37": "",
                            "OS": {
                                "name": BSWindow.active.server.evalCommand('OS', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan os', vars)); }
                            },
                            "Theme": {
                                "name": BSWindow.active.server.evalCommand('Theme', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan theme', vars)); }
                            },
                            "sep38": "",
                            "Other\t/ctcp": {
                                "name": BSWindow.active.server.evalCommand('Other\t/ctcp', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $chan $$input(What CTCP?,eq,CTCP)', vars)); }
                            }
                        }
                    },
                    "sep39": "",
                    "$iif($isfile(logs $+ $mklogfn($chan)),View channel log...)": {
                        "name": BSWindow.active.server.evalCommand('$iif($isfile(logs $+ $mklogfn($chan)),View channel log...)', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('run logs $+ $mklogfn($chan)', vars)); }
                    },
                    "sep40": "",
                    "Hide channel": {
                        "name": BSWindow.active.server.evalCommand('Hide channel', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('window -ha $chan || var %a = $input(This channel will still be visible on the Window menu.,io,Hide channel)', vars)); }
                    },
                    "Clear text": {
                        "name": BSWindow.active.server.evalCommand('Clear text', vars),
                        "items": {
                            "Clear text of current window\t/clear": {
                                "name": BSWindow.active.server.evalCommand('Clear text of current window\t/clear', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('clear', vars)); }
                            },
                            "Clear text of all windows\t/clearall": {
                                "name": BSWindow.active.server.evalCommand('Clear text of all windows\t/clearall', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('clearall', vars)); }
                            }
                        }
                    },
                    "Cycle/Leave": {
                        "name": BSWindow.active.server.evalCommand('Cycle/Leave', vars),
                        "items": {
                            "Cycle\t/hop": {
                                "name": BSWindow.active.server.evalCommand('Cycle\t/hop', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('hop', vars)); }
                            },
                            "sep41": "",
                            "Leave $chan $+ \t/part": {
                                "name": BSWindow.active.server.evalCommand('Leave $chan $+ \t/part', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('part', vars)); }
                            },
                            "Leave all channels\t/partall": {
                                "name": BSWindow.active.server.evalCommand('Leave all channels\t/partall', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('partall', vars)); }
                            },
                            "Leave all channels in all servers": {
                                "name": BSWindow.active.server.evalCommand('Leave all channels in all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -a partall', vars)); }
                            }
                        }
                    }
                }



            };
            return {
                items: {
                    "": {
                        "name": BSWindow.active.server.evalCommand('$1 $+ ...', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('uwho $1', vars)); }
                    },
                    "sep0": "",
                    "Whois": {
                        "name": BSWindow.active.server.evalCommand('Whois', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('WHOIS $1', vars)); }
                    },
                    "sep1": "",
                    "NickServ": {
                        "name": BSWindow.active.server.evalCommand('NickServ', vars)
                    },
                    "MemoServ": {
                        "name": BSWindow.active.server.evalCommand('MemoServ', vars)
                    },
                    "sep2": "",
                    "IRCOperator": {
                        "name": BSWindow.active.server.evalCommand('IRC Operator', vars),
                        "items": {
                            "NickServ": {
                                "name": BSWindow.active.server.evalCommand('NickServ', vars)
                            },
                            "OperServ": {
                                "name": BSWindow.active.server.evalCommand('OperServ', vars)
                            },
                            "sep3": "",
                            "Locknick": {
                                "name": BSWindow.active.server.evalCommand('Lock nick', vars),
                                "items": {
                                    "Lock": {
                                        "name": BSWindow.active.server.evalCommand('Lock', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKLOCK $1', vars)); }
                                    },
                                    "Unlock": {
                                        "name": BSWindow.active.server.evalCommand('Unlock', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('NICKUNLOCK $1', vars)); }
                                    }
                                }
                            },
                            "Sa": {
                                "name": BSWindow.active.server.evalCommand('Sa(...)', vars),
                                "items": {
                                    "Sajoin": {
                                        "name": BSWindow.active.server.evalCommand('Sajoin', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAJOIN $1 $input(Channel?,qe)', vars)); }
                                    },
                                    "Samode": {
                                        "name": BSWindow.active.server.evalCommand('Samode', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAMODE $1 $input(Modes?,qe)', vars)); }
                                    },
                                    "Sanick": {
                                        "name": BSWindow.active.server.evalCommand('Sanick', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SANICK $1 $input(New nick?,qe)', vars)); }
                                    },
                                    "Sapart": {
                                        "name": BSWindow.active.server.evalCommand('Sapart', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAPART $1 $input(Channel?,qe)', vars)); }
                                    },
                                    "Saquit": {
                                        "name": BSWindow.active.server.evalCommand('Saquit', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('SAQUIT $1 $input(Message?,qe)', vars)); }
                                    }
                                }
                            },
                            "UserIP": {
                                "name": BSWindow.active.server.evalCommand('UserIP', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('USERIP $1', vars)); }
                            },
                            "sep4": "",
                            "Kill": {
                                "name": BSWindow.active.server.evalCommand('Kill', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('KILL $1 $input(What reason?,qe,Kill)', vars)); }
                            },
                            "sep5": "",
                            "line": {
                                "name": BSWindow.active.server.evalCommand('(...)line', vars),
                                "items": {
                                    "Kline": {
                                        "name": BSWindow.active.server.evalCommand('Kline', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('KLINE $input(User@Host?,qe,Kline) $input([duration][y|w|d|h|m|s],qe,Kline) : $+ $input(What reason?,qe,Kline)', vars)); }
                                    },
                                    "Zline": {
                                        "name": BSWindow.active.server.evalCommand('Zline', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ZLINE $input(Ipmask?,qe,Zline) $input([duration][y|w|d|h|m|s],qe,Zline) : $+ $input(What reason?,qe,Zline)', vars)); }
                                    },
                                    "Qline": {
                                        "name": BSWindow.active.server.evalCommand('Qline', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('QLINE $input(Nickmask?,qe,Qline) $input([duration][y|w|d|h|m|s],qe,Qline) : $+ $input(What reason?,qe,Qline)', vars)); }
                                    },
                                    "Gline": {
                                        "name": BSWindow.active.server.evalCommand('Gline', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('GLINE $input(User@Host?,qe,Gline) $input([duration][y|w|d|h|m|s],qe,Gline) : $+ $input(What reason?,qe,Gline)', vars)); }
                                    },
                                    "Eline": {
                                        "name": BSWindow.active.server.evalCommand('Eline', vars),
                                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ELINE $input(User@Host?,qe,Eline) $input([duration][y|w|d|h|m|s],qe,Eline) : $+ $input(What reason?,qe,Eline)', vars)); }
                                    }
                                }
                            }
                        }
                    },
                    "sep6": "",
                    "Message": {
                        "name": BSWindow.active.server.evalCommand('Message', vars),
                        "items": {
                            "SendaprivatemessagetoallopenPVTsqmsg": {
                                "name": BSWindow.active.server.evalCommand('Send a private message to all open PVTs\t/qmsg', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('qmsg $$input(What message?,qe)', vars)); }
                            },
                            "SendaprivatemessagetoallopenPVTsonallservers": {
                                "name": BSWindow.active.server.evalCommand('Send a private message to all open PVTs on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 qmsg $$input(What message?,qe)', vars)); }
                            }
                        }
                    },
                    "Action": {
                        "name": BSWindow.active.server.evalCommand('Action', vars),
                        "items": {
                            "Sendanactiontome": {
                                "name": BSWindow.active.server.evalCommand('Send an action to $1\t/me', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('describe $1 $$input(What action?,qe)', vars)); }
                            },
                            "SendanactiontoallPVTsqme": {
                                "name": BSWindow.active.server.evalCommand('Send an action to all PVTs\t/qme', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('qme $$input(What action?,qe)', vars)); }
                            },
                            "SendanactiontoallPVTsonallservers": {
                                "name": BSWindow.active.server.evalCommand('Send an action to all PVTs on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 qme $$input(What action?,qe)', vars)); }
                            }
                        }
                    },
                    "Notice": {
                        "name": BSWindow.active.server.evalCommand('Notice', vars),
                        "items": {
                            "Sendanoticetonotice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to $1\t/notice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notice $1 $$input(What notice?,qe)', vars)); }
                            },
                            "SendanoticetoallPVTsqnotice": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to all PVTs\t/qnotice', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('qnotice $$input(What notice?,qe)', vars)); }
                            },
                            "SendanoticetoallPVTsonallservers": {
                                "name": BSWindow.active.server.evalCommand('Send a notice to all PVTs on all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -at1 qnotice $$input(What notice?,qe)', vars)); }
                            }
                        }
                    },
                    "CTCP": {
                        "name": BSWindow.active.server.evalCommand('CTCP', vars),
                        "items": {
                            "Ping": {
                                "name": BSWindow.active.server.evalCommand('Ping', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 ping', vars)); }
                            },
                            "Time": {
                                "name": BSWindow.active.server.evalCommand('Time', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 time', vars)); }
                            },
                            "Version": {
                                "name": BSWindow.active.server.evalCommand('Version', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 version', vars)); }
                            },
                            "Source": {
                                "name": BSWindow.active.server.evalCommand('Source', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 source', vars)); }
                            },
                            "sep7": "",
                            "Page": {
                                "name": BSWindow.active.server.evalCommand('Page', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 page $$input(What msg?,eq,CTCP Page)', vars)); }
                            },
                            "sep8": "",
                            "Finger": {
                                "name": BSWindow.active.server.evalCommand('Finger', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 finger', vars)); }
                            },
                            "Userinfo": {
                                "name": BSWindow.active.server.evalCommand('Userinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 userinfo', vars)); }
                            },
                            "Clientinfo": {
                                "name": BSWindow.active.server.evalCommand('Clientinfo', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 clientinfo', vars)); }
                            },
                            "Sound": {
                                "name": BSWindow.active.server.evalCommand('Sound', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 sound', vars)); }
                            },
                            "sep9": "",
                            "OS": {
                                "name": BSWindow.active.server.evalCommand('OS', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 os', vars)); }
                            },
                            "Theme": {
                                "name": BSWindow.active.server.evalCommand('Theme', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 theme', vars)); }
                            },
                            "sep10": "",
                            "Otherctcp": {
                                "name": BSWindow.active.server.evalCommand('Other\t/ctcp', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ctcp $1 $$input(What CTCP?,eq,CTCP)', vars)); }
                            }
                        }
                    },
                    "DCC": {
                        "name": BSWindow.active.server.evalCommand('DCC', vars),
                        "items": {
                            "Send": {
                                "name": BSWindow.active.server.evalCommand('Send', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('/dcc send $1', vars)); }
                            },
                            "Chat": {
                                "name": BSWindow.active.server.evalCommand('Chat', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('/dcc chat $1', vars)); }
                            }
                        }
                    },
                    "sep11": "",
                    "iifnotifystyleNotify": {
                        "name": BSWindow.active.server.evalCommand('$iif($notify($1),$style(1)) Notify', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('notify $iif($notify($1),-r) $1', vars)); }
                    },
                    "iifignoreaddressstyleIgnore": {
                        "name": BSWindow.active.server.evalCommand('$iif($ignore($address($1,2)),$style(1)) Ignore', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('ignore $iif($ignore($address($1,2)),-r) $1 2', vars)); }
                    },
                    "iifisfilelogsmklogfnViewprivatelog": {
                        "name": BSWindow.active.server.evalCommand('$iif($isfile(logs\\ $+ $mklogfn($1)),View private log...)', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('run logs\\ $+ $mklogfn($1)', vars)); }
                    },
                    "sep12": "",
                    "Clear": {
                        "name": BSWindow.active.server.evalCommand('Clear', vars),
                        "items": {
                            "Clearcurrentwindow": {
                                "name": BSWindow.active.server.evalCommand('Clear current window', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('clear', vars)); }
                            },
                            "Clearallwindows": {
                                "name": BSWindow.active.server.evalCommand('Clear all windows', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('clearall', vars)); }
                            }
                        }
                    },
                    "Close": {
                        "name": BSWindow.active.server.evalCommand('Close', vars),
                        "items": {
                            "CloseallPVTsclosem": {
                                "name": BSWindow.active.server.evalCommand('Close all PVTs\t/close -m', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('close -m', vars)); }
                            },
                            "CloseallPVTsinallservers": {
                                "name": BSWindow.active.server.evalCommand('Close all PVTs in all servers', vars),
                                "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('scon -a close -m', vars)); }
                            }
                        }
                    },
                    "sep13": "",
                    "Slap": {
                        "name": BSWindow.active.server.evalCommand('Slap!', vars),
                        "callback": function () { BSWindow.active.server.call(BSWindow.active.server.evalCommand('/slap $1 around a bit with a large trout', vars)); }
                    }
                }



            }
        }
    });
});