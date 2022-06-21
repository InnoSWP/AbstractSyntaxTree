import estraverse from 'estraverse';
import type { BinaryExpression } from 'estree';
import type { CompressedBinaryExpression, Node } from "./estreeExtension";
import { extractChildren, setChildren } from './estreeUtils';
//import type {Program} from 'esprima';
//import type {  Node } from "./CustomNodeTypes/estreeExtension";
//import { arrayHighlight } from "./Stores.svelte";

const operatorsToCompress = ['+', '&', '&&', '|', '||', '^', '*']

export function compressBinaryExpression(expressionToCompress: Node): Node {
    if (expressionToCompress.type != "BinaryExpression")
        return expressionToCompress;
    let binaryOperator = expressionToCompress.operator;
    if (operatorsToCompress.includes(binaryOperator)) {
        let newLeft = extractSideOfBinaryExpression(expressionToCompress.left,binaryOperator);
        let newRight = extractSideOfBinaryExpression(expressionToCompress.right,binaryOperator)

        const { left, right, type, ...inheritedPart } = expressionToCompress;
        return {
            ...inheritedPart,
            type: "CompressedBinaryExpression",
            operands: [...newLeft, ...newRight],
        } as CompressedBinaryExpression;
    }
    return expressionToCompress;
}

function extractSideOfBinaryExpression(side:Node,operator:string):Node[]{
        if (side.type == "CompressedBinaryExpression") {
            if (side.operator == operator) {
                return [...side.operands]
            } else {
                return [side]
            }
        } else {
            return [side]
        }
}

export function compressBinaryExpressionsInTree(tree: Node): Node {
    
    let oldChildren = extractChildren(tree);
    let compressedChildren = oldChildren.map(child => compressBinaryExpressionsInTree(child));
    
    setChildren(tree,compressedChildren);
    
    if (tree.type == "BinaryExpression")
        tree = compressBinaryExpression(tree);

    return tree;
}