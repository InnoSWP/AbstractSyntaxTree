
import type { Node } from './estreeExtension'
import type estree from 'estree'


export function setChildren(n: Node, newChildrenInNewType: Node[]) {
    let newChildren = newChildrenInNewType as any[];
    return fmap(n,(_childNode)=>{
        return newChildren.splice(0,1)[0]
    })
}

function extractLastChild(arr: Array<any>) {
    return arr.splice(arr.length - 1, 1)[0];
}

function exhaustiveMatchingGuard(_: never): never {
    throw new Error('Should not be able to reach here')
}

function fmap(n:Node,f:(Node)=>Node):Node{
    let operate = (nodes:Node[]):any=>nodes.map(f)
    let operated;
    switch (n.type) {
        case 'BlockStatement':
        case 'ClassBody':
        case 'Program':
            n.body = operate(n.body)
            return;
        case 'ExpressionStatement':
            [n.expression] = operate([n.expression])
            return;
        case 'WithStatement':
            [n.object, n.body] = operate([n.object, n.body])
            return;
        case 'LabeledStatement':
            [n.label, n.body] = operate([n.label, n.body])
            return;
        case 'ContinueStatement':
            [n.label] = operate([n.label])
            return;
        case 'IfStatement':
        case 'ConditionalExpression':
            [n.test, n.consequent, n.alternate] = operate([n.test, n.consequent, n.alternate])
            return;
        case 'SwitchStatement':
            [n.discriminant, ...n.cases] = operate([n.discriminant, ...n.cases])
            return;
        case 'SwitchCase':
            [n.test, ...n.consequent] = operate([n.test, ...n.consequent])
            return;
        case 'TryStatement':
            [n.block, n.handler, n.finalizer] = operate([n.block, n.handler, n.finalizer])
            return;
        case 'CatchClause':
            [n.param, n.body] = operate([n.param, n.body])
            return;
        case 'WhileStatement':
        case 'DoWhileStatement':
            [n.test, n.body] = operate([n.test, n.body])
            return;
        case 'ForStatement':
            [n.init, n.test, n.update, n.body] = operate([n.init, n.test, n.update, n.body])
            return;
        case 'ForOfStatement':
        case 'ForInStatement':
            [n.left, n.right, n.body] = operate([n.left, n.right, n.body])
            return;
        case 'FunctionExpression':
        case 'FunctionDeclaration':
            operated = operate([n.id, ...n.params, n.body]);
            n.body = extractLastChild(operated);
            [n.id, ...n.params] = operated
            return;
        case 'VariableDeclaration':
            n.declarations = operate(n.declarations)
            return;
        case 'VariableDeclarator':
            [n.id, n.init] = operate([n.id, n.init])
            return;
        case 'ArrayExpression':
        case 'ArrayPattern':
            n.elements = operate(n.elements)
            return;
        case 'ObjectExpression':
        case 'ObjectPattern':
            n.properties = operate(n.properties)
            return;
        case 'ArrowFunctionExpression':
            operated = operate([...n.params, n.body]);
            n.body = extractLastChild(operated);
            [...n.params] = operated;
            return;
        case 'UnaryExpression':
        case 'YieldExpression': // argument?
        case 'UpdateExpression':
        case 'AwaitExpression':
        case 'SpreadElement':
        case 'ThrowStatement':
        case 'ReturnStatement':
        case 'RestElement':
            [n.argument] = operate([n.argument])
            return;
        case 'BinaryExpression':
        case 'AssignmentExpression':
        case 'LogicalExpression':
        case 'AssignmentPattern':
            [n.left, n.right] = operate([n.left, n.right])
            return;
        case 'MemberExpression':
            [n.object, n.property] = operate([n.object, n.property])
            return;
        case 'CallExpression':
        case 'NewExpression':
            [n.callee, ...n.arguments] = operate([n.callee, ...n.arguments])
            return;
        case 'TemplateLiteral':
        case 'SequenceExpression':
            n.expressions = operate(n.expressions)
            return;
        case 'CompressedBinaryExpression':
        case 'CompressedLogicalExpression':
            [...n.operands] = operate([...n.operands])
            return;
        case 'ExportAllDeclaration':
        case 'TemplateElement':
        case 'Identifier':
        case 'Literal':
        case 'EmptyStatement':
        case 'BreakStatement':
        case 'Super':
        case 'DebuggerStatement':
        case 'ThisExpression':
            return;
        case 'ClassExpression':
            [n.body] = operate([n.body])
            return;
        case 'ClassDeclaration':
            [n.id, n.body] = operate([n.id, n.body])
            return;
        case 'ExportSpecifier':
            [n.exported, n.local] = operate([n.exported, n.local])
            return;
        case 'MetaProperty':
            [n.meta, n.property] = operate([n.meta, n.property])
            return;
        case 'MethodDefinition':
        case 'Property':
            [n.key, n.value] = operate([n.key, n.value])
            return;
        case 'ImportSpecifier':
            [n.imported, n.local] = operate([n.imported, n.local])
                return;
        case 'TaggedTemplateExpression':
            [n.quasi, n.tag] = operate([n.quasi, n.tag])
            return;
        case 'ImportNamespaceSpecifier':
        case 'ImportDefaultSpecifier':
            [n.local] = operate([n.local])
            return;
        case 'ImportDeclaration':
            [n.source, ...n.specifiers] = operate([n.source, ...n.specifiers])
            return;
        case 'ExportDefaultDeclaration':
            [n.declaration] = operate([n.declaration])
            return;
        case 'ExportNamedDeclaration':
            n.specifiers = operate(n.specifiers); // declaration? source?
            return;
        default:
            return exhaustiveMatchingGuard(n);
    }
}

export function extractChildren(n: Node): Node[] {
    let extractedChildren:Node[] = []
    fmap(n,(childNode)=>{
        extractedChildren = extractedChildren.concat(childNode)
        return childNode;   
    })
    return extractedChildren;
    
}