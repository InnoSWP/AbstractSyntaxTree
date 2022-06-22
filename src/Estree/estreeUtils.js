"use strict"



export function setChildren(n,newChildren ) {
    switch(n.type) {
        case 'BlockStatement':
        case 'Program':
            n.body=newChildren;
            return;
        case 'ExpressionStatement':
            [n.expression]=newChildren;
            return;
        case 'WithStatement':
            [n.object, n.body]=newChildren;
            return;
        case 'ThrowStatement':
        case 'ReturnStatement':
        case 'UnaryExpression':
        case 'UpdateExpression':
            [n.argument]=newChildren;
            return;
        case 'LabeledStatement':
            [n.label, n.body]=newChildren;
            return;
        case 'BreakStatement':
            return;
        case 'ContinueStatement':
            [n.label]=newChildren;
            return;
        case 'ConditionalExpression':
        case 'IfStatement':
            [n.test, n.consequent, n.alternate]=newChildren;
            return;
        case 'SwitchStatement':
            [n.discriminant, ...n.cases]=newChildren;
            return;
        case 'SwitchCase':
            [n.test, ...n.consequent]=newChildren;
            return;
        case 'TryStatement':
            [n.block, n.handler, n.finalizer]=newChildren;
            return;
        case 'CatchClause':
            [n.param, n.body]=newChildren;
            return;
        case 'WhileStatement':
        case  'DoWhileStatement':
            [n.test, n.body]=newChildren;
            return;
        case 'ForStatement':
            [n.init, n.test, n.update, n.body]=newChildren;
            return;
        case 'ForOfStatement':
        case 'ForInStatement':
            [n.left, n.right, n.body]=newChildren;
            return;
        case 'FunctionExpression':
        case 'FunctionDeclaration':
            n.body  = extractLastChild(newChildren);
            [n.id, ...n.params]=newChildren;
            return;
        case 'VariableDeclaration':
            n.declarations=newChildren;
            return;
        case 'VariableDeclarator':
            [n.id, n.init]=newChildren;
            return;
        case 'ArrayExpression':
            n.elements=newChildren;
            return;
        case 'ObjectExpression':
            n.properties=newChildren;
            return; 
        case 'Property':
            [n.key, n.value]=newChildren;
            return;
        case 'ArrowFunctionExpression':
            n.body = extractLastChild(newChildren);
            [...n.params]=newChildren;
            return;
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'LogicalExpression':
            [n.left, n.right]=newChildren;
            return;
        case 'MemberExpression':
            [n.object, n.property]=newChildren;
            return;
        case 'CallExpression':
        case 'NewExpression':
            [n.callee, ...n.arguments]=newChildren;
            return;
        case 'SequenceExpression':
            n.expressions=newChildren;
            return;
        case 'CompressedBinaryExpression':
            n.operands=newChildren;
            return;
    }
}

function extractLastChild(arr){
    return arr.splice(arr.length-1,1);
}

export function extractChildren(n) {
    switch(n.type) {
        case 'BlockStatement':
        case 'Program':
            return n.body;
        case 'ExpressionStatement':
            return [n.expression];
        case 'WithStatement':
            return [n.object, n.body];
        case 'ThrowStatement':
        case 'ReturnStatement':
            return [n.argument];
        case 'LabeledStatement':
            return [n.label, n.body];
        case 'BreakStatement':
            return [];
        case 'ContinueStatement':
            return [n.label];
        case 'IfStatement':
            return [n.test, n.consequent, n.alternate]
        case 'SwitchStatement':
            return [n.discriminant, ...n.cases];
        case 'SwitchCase':
            return [n.test, ...n.consequent];
        case 'TryStatement':
            return [n.block, n.handler, n.finalizer];
        case 'CatchClause':
            return [n.param, n.body];
        case 'WhileStatement':
        case  'DoWhileStatement':
            return [n.test, n.body];
        case 'ForStatement':
            return [n.init, n.test, n.update, n.body];
        case 'ForOfStatement':
        case 'ForInStatement':
            return [n.left, n.right, n.body];
        case 'FunctionDeclaration':
            return [n.id, ...n.params, n.body];
        case 'VariableDeclaration':
            return n.declarations;
        case 'VariableDeclarator':
            return [n.id, n.init];
        case 'ArrayExpression':
            return n.elements;
        case 'ObjectExpression':
            return n.properties;
        case 'Property':
            return [n.key, n.value];
        case 'FunctionExpression':
            return [n.id, ...n.params, n.body];
        case 'ArrowFunctionExpression':
            return [...n.params, n.body];
        case 'UnaryExpression':
        case 'UpdateExpression':
            return [n.argument];
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'LogicalExpression':
            return [n.left, n.right];
        case 'MemberExpression':
            return [n.object, n.property];
        case 'ConditionalExpression':
            return [n.test, n.consequent, n.alternate];
        case 'CallExpression':
        case 'NewExpression':
            return [n.callee, ...n.arguments];
        case 'SequenceExpression':
            return n.expressions;
        case 'CompressedBinaryExpression':
            return [...n.operands];
    }

    return [];
}