(function (ready) {
   if (document.readyState === 'loading') {
       document.addEventListener("DOMContentLoaded", ready);
   }
   else ready();
})(function () {
    var settingsButton = document.getElementById("settingsButton");
    var closeButton = document.getElementsByClassName("closeButton")[0];
    var setsFontSize = document.getElementById('setsFontSize');
    var setsFontSizeValue = document.getElementById('setsFontSizeValue');
    var setsShowEmbeds = document.getElementById('setsShowEmbeds');
    var setsSchemeDark = document.getElementById("setsSchemeDark");
    var setsSchemeBlack = document.getElementById("setsSchemeBlack");
    var userScriptInput = document.getElementById('userScript');

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
    applyUserScript(BS.prefs.userScript);
    settingsButton.addEventListener("click", function() {
        userScriptInput.value = BS.prefs.userScript;
        setsFontSizeValue.innerHTML = setsFontSize.value = BS.prefs.fontSize;
        setsShowEmbeds.checked = BS.prefs.showEmbeds;
        if (BS.prefs.scheme == "dark") setsSchemeDark.checked = true;
        else setsSchemeBlack.checked = true;
        var downloadBackup = document.getElementById('downloadBackup');
        downloadBackup.href = BS.sets.backup();
        BS.UI.modal.show('settings');
    });
    var settingOkButtonCallback = function (close) {
        var userScript = userScriptInput.value;
        var error = applyUserScript(userScript);
        if (!error || confirm('Error on userscript:\n\n' + error.valueOf()+'\n\nSave anyway?')) {
            BS.prefs.userScript = userScript;
            BS.prefs.fontSize = setsFontSize.value;
            BS.prefs.showEmbeds = setsShowEmbeds.checked;
            BS.prefs.scheme = setsSchemeDark.checked ? "dark" : "black";
            BS.UI.updateStyle();
            BS.sets.savePrefs();
            if (close) BS.UI.modal.hide('settings');
        }
    };
    document.getElementById('settingsOkButton').addEventListener('click', function () { settingOkButtonCallback(true); });
    document.getElementById('settingsApplyButton').addEventListener('click', function () { settingOkButtonCallback(); });
    document.getElementById('settingsCancelButton').addEventListener('click', function () {
        BS.UI.modal.hide('settings');
    });
    userScriptInput.placeholder = `Use JavaScript syntax
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

    userScriptInput.addEventListener('keydown', function (e) {
        var start = userScriptInput.selectionStart;
        var end = userScriptInput.selectionEnd;
        console.log(start, end, e);
        if (start == end) {
            if (e.keyCode == 13) {
                var left = userScriptInput.value.slice(0, end);
                var matches;
                if (matches = left.match(/(?:^|\n)( *).*?({?) *$/)) {
                    var indent = matches[1].length;
                    if (matches[2] === '{') indent += 4;
                    if (indent > 0) {
                        userScriptInput.value = left + "\n" + " ".repeat(indent) + userScriptInput.value.slice(end);
                        userScriptInput.selectionStart = userScriptInput.selectionEnd = end + indent + 1;
                        e.preventDefault();
                    }
                }
            }
            else if (e.key === "}") {
                var left = userScriptInput.value.slice(0, end);
                var matches;
                if (matches = left.match(/(?:^|\n)( *)    $/)) {
                    userScriptInput.value = left.slice(0, end - 4) + "}" + userScriptInput.value.slice(end);
                    userScriptInput.selectionStart = userScriptInput.selectionEnd = end - 3;
                    e.preventDefault();
                }
            }
        }
    });

});
