function BSParser(server, vars) {
    this.server = server;
    this.vars = vars || {};
}
BSParser.parseProgramSource = function (source) {return BSParser.parseNode(BS.parser.parse('P' + source)); };
BSParser.parseStatementSource = function (source) { return BSParser.parseNode(BS.parser.parse('S' + source)); };
BSParser.parseCommandSource = function (source) { return BSParser.parseTokens(BSParser.parseCommand(source).value); };
BSParser.parseBooleanExpressionSource = function (source) {
    try { return BSParser.parseNode(BS.parser.parse('B' + source)); }
    catch (e) { BS.log('Error parsing boolean expression:', source, e); }
};

BSParser.castBool = function (str) {
    return str !== false && str !== 0 && str !== '0' && str != '$false';
};
BSParser.castNumber = function (str) {
    return isNaN(str) ? str : Number(str);
};
BSParser.parseTexatGlob = function (str) {
    return new RegExp('^'+escapeRegExp(str).replace('\\*', '.*')+'$', 'i');
};
BSParser.parseTargetGlob = function (target) {
    if (target == '?') return `!vars.chan`;
    if (target == '#') return `vars.chan`;
    return `vars.chan.match(/^(${escapeRegExp(target).replace(/ *, */, '|')})$/i)`;
};
BSParser.parseNode = function (node) {
    BS.log('parseNode:', node);
    var parse = function (node) { return BSParser.parseNode(node); };
    if (!node) return;
    switch (node.type) {
        case 'Program': {
            var program = {JS: [], events: [], aliases: {}};
            for (var i = 0; i < node.body.length; i++) {
                var programNode = node.body[i];
                switch (programNode.type) {
                    case 'Event': {
                        // TODO: optimize
                        var conds = [];
                        conds.push(`vars.type == '${programNode.name}'.toUpperCase()`);
                        if (programNode.text != '*') conds.push(`vars.text.match(${BSParser.parseTextGlob(programNode.text)})`);
                        if (programNode.target != '*') conds.push(BSParser.parseTargetGlob(programNode.target));
                        program.events.push(`\nif (${conds.join(" && ")}) ${parse(programNode.body)}`);
                        break;
                    }
                    case 'Alias': {
                        var code = `(function (server, vars) { ${parse(programNode.body)} })`;
                        BS.log('Alias:', code);
                        program.aliases[programNode.name] = eval(code);
                    }
                    case 'JS': {
                        program.JS.push(programNode.expression);
                        break;
                    }
                }
            }
            BS.scriptAliases = program.aliases; // fixme: sets aliases every time we parse a program
            program.JS = program.JS.join("\n");
            program.events.join("\n");
            program = program.JS + "\n" + program.events;
            return program;
        }
        case 'IfStatement': {
            var alternate = node.alternate ? `else ${parse(node.alternate)}` : '';
            return `\nif (BSParser.castBool(${parse(node.test)})) ${parse(node.consequent)}\n${alternate}`;
        }
        case 'WhileStatement': {
            return `\nwhile (BSParser.castBool(${parse(node.test)})) ${parse(node.body)}\n`;
        }
        case 'BinaryExpression': {
            var l = parse(node.left);
            var r = parse(node.right);
            switch (node.operator) {
                case '==': return `String(${l}).toLowerCase() == String(${r}).toLowerCase()`;
                case '===': return `${l} == ${r}`;
                case '!=': return `${l} != ${r}`;
                case '<': return `BSParser.castNumber(${l}) < BSParser.castNumber(${r})`;
                case '>': return `BSParser.castNumber(${l}) > BSParser.castNumber(${r})`;
                case '<=': return `BSParser.castNumber(${l}) <= BSParser.castNumber(${r})`;
                case '>=': return `BSParser.castNumber(${l}) >= BSParser.castNumber(${r})`;
                case 'isin': return `String(${r}).toLowerCase().indexOf(String(${l}).toLowerCase()) != -1`;
                case 'isincs': return `String(${r}).indexOf(${l}) != -1`;
                case '&&': return `BSParser.castBool(${r}) && BSParser.castBool(${l})`;
                case '||': return `BSParser.castBool(${r}) || BSParser.castBool(${l})`;
            }
            break;
        }
        case 'UnaryExpression': {
            var arg = node.argument;
            switch (node.operator) {
                case '!': return `!BSParser.castBool(${parse(arg)})`;
            }
            break;
        }
        case 'VariableDeclaration': return `BS.variables['${node.name}'] = ${node.value ? BSParser.parseTokens(node.value) : null};\n`;
        case 'VariableAssignment': return `BS.variables['${node.name}'] = ${node.value ? BSParser.parseTokens(node.value) : null};\n`;
        case 'VariableIncrement': return `BS.variables['${node.name}'] += ${node.inc ? BSParser.parseTokens(node.inc) : 1};\n`;
        case 'VariableDecrement': return `BS.variables['${node.name}'] -= ${node.dec ? BSParser.parseTokens(node.dec) : 1};\n`;
        case 'Variable': return `BS.variables['${node.name}']`;
        case 'String': {
            return "'"+node.value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")+"'";
        }
        case 'Statement': {
            return `server.call(${BSParser.parseTokens(BSParser.parseCommand(node.tokens).value)});\n`;
        }
        case 'Expression': {
            return BSParser.parseTokens(node.tokens);
        }
        case 'Block': {
            var result = [];
            for (var i = 0; i < node.statements.length; i++) result.push(parse(node.statements[i]));
            return `{\n${result.join("")}}`;
        }
        case 'Identifier': {
            if (node.source) return BSParser.parseTokens(BSParser.parseCommand(node.source).value); // fixme: dirty hack
            if (!node.name) return '$';
            if (node.name == '1-') return `vars.text`;
            var range = node.name.match(/^(\d+)(-)?(\d+)?$/);
            if (range) {
                if (range[3] != undefined) return `vars.text.split(' ').slice(${Number(range[1]) - 1}, ${Number(range[3])}).join(' ')`;
                if (range[2] != undefined) return `vars.text.split(' ').slice(${Number(range[1]) - 1}).join(' ')`;
                return `vars.text.split(' ')[${Number(range[1]) - 1}]`;
            }
            return `(server.applyIdent('${node.name}'${BSParser.parseArgs(node.value, node.prop)}, vars))`;
        }
    }
    return null;
};
BSParser.parseArgs = function (args, prop) {
    if (!args && !prop) return '';
    var result = [];
    for (var i = 0; i < args.length; i++) result.push(BSParser.parseTokens(args[i].value));
    if (prop) result.push(`'${prop}'`);
    return ', [' + result.join(', ') + ']';
};
BSParser.parseTokens = function (tokens) {
    //BS.log('parseTokens:', tokens);
    var result = [];
    var join = false, stringLast = false;
    // $+
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token.type === 'Identifier' && token.name === '+' && !token.value.length) {
            join = true;
            stringLast = false;
            var lastToken = result.length && result[result.length - 1];
            if (lastToken && lastToken.type === 'String') {
                lastToken.value = lastToken.value.replace(/ +$/, '');
                if (lastToken.value === '') result.pop();
                else stringLast = lastToken;
            }
            continue;
        }
        if (join) {
            join = false;
            if (token.type === 'String') {
                token.value = token.value.replace(/^ +/, '');
                if (token.value === '') continue;
                else if (stringLast) {
                    stringLast.value += token.value;
                    continue;
                }
            }
        }
        result.push(token);
    }
    for (var i = 0; i < result.length; i++) {
        result[i] = BSParser.parseNode(result[i]);
    }
    return result.join(" + ");
};

BSParser.parseCommand = function (code) {
    // global context
    var context = {token: false, args: 0, identifier: 0, parentesis: []};
    // context in the current level
    // stack
    var stateStack = [];
    var objStack = [];
    var obj = {type: 'Command', value: []};
    var now = Date.now();
    var pushState = function (newObj) {
        objStack.push(obj);
        obj = newObj;
    };
    var popState = function () {
        var oldObj = obj;
        obj = objStack.pop();
        obj.value.push(oldObj);
    };
    var popString = function () {
        popState();
        context.string = false;
    };
    var pushString = function (c) {
        context.string = true;
        pushState({type: 'String', value: c});
    };

    for (var i = 0, j = code.length; i < j; i++) {
        var c = code.charAt(i);
        /*BS.log('------------------------------------');
        BS.log('CHAR = "'+c+'"', JSON.stringify(obj));
        BS.log('context:', JSON.stringify(context));
        BS.log('stack:', JSON.stringify(objStack));*/

        if (context.args) {
            if (c === ')') {
                if (!context.parentesis.pop()) {
                    if (context.string || context.variableName) popState();
                    context.string = context.variableName = false;
                    context.args--;
                    popState(); //end arg
                    context.identifier--;
                    popState(); //end identifier
                    continue;
                }
            }
            else if (c === ',') {
                if (!context.parentesis.length || !context.parentesis[context.parentesis.length - 1]) {
                    if (context.string || context.identifierName || context.variableName) popState();
                    context.string = context.identifierName = context.variableName = false;
                    popState(); // end arg
                    context.token = false;
                    pushState({type: 'Argument', value: []});
                    continue;
                }
            }
        }

        if (!context.token) {
            if (c === ' ') continue;
            context.token = true;
            if (c === '$') {
                if (context.string) popString();
                context.identifier++;
                context.identifierName = true;
                pushState({type: 'Identifier', name: '', value: []});
                continue;
            }
            if (c === '%') {
                if (context.string) popString();
                context.variableName = true;
                pushState({type: 'Variable', name: '', value: []});
                continue;
            }
            if (!context.string) {
                pushString(c);
                continue;
            }
        }

        if (context.string) {
            obj.value += c;
            if (c === ' ') context.token = false;
            else if (c === '(') context.parentesis.push(true);
        }
        else if (context.variableName) {
            if (c === ' ') {
                context.variableName = false;
                context.token = false;
                popState(); // end variable
                pushString(c);
            }
            else obj.name += c;
        }
        else if (context.identifierName) {
            if (c === '(') {
                context.identifierName = false;
                context.args++;
                context.token = false;
                context.parentesis.push(false);
                pushState({type: 'Argument', value: []});
            }
            else if (c === ' ') {
                context.identifierName = false;
                context.token = false;
                popState(); // end identifier
                pushString(c);
            }
            else obj.name += c;
        }
        // space after identifier/variable
        else if (c === ' ') {
            pushString(c);
            context.token = false;
        }
    }
    while (objStack.length) popState();
    BS.log('Time to parse: '+Math.round(Date.now() - now)+' ms. Result:', obj);
    return obj;
};