import type { CompressedBinaryExpression, CompressedLogicalExpression, Node } from "./estreeExtension";
import { extractChildren, setChildren } from './estreeUtils';

const operatorsToCompress = ['+', '&', '&&', '|', '||', '^', '*']

// Function to compress binary expression
export function compressBinaryExpression(expressionToCompress: Node): Node {
    if (expressionToCompress.type != "BinaryExpression" && expressionToCompress.type != "LogicalExpression")
        return expressionToCompress;
    let binaryOperator = expressionToCompress.operator;
    if (operatorsToCompress.includes(binaryOperator)) {
        let newLeft = extractSideOfBinaryExpression(expressionToCompress.left, binaryOperator);
        let newRight = extractSideOfBinaryExpression(expressionToCompress.right, binaryOperator)

        const { left, right, type, ...inheritedPart } = expressionToCompress;
        if (expressionToCompress.type == "BinaryExpression") {
            return {
                ...inheritedPart,
                type: "CompressedBinaryExpression",
                operands: [...newLeft, ...newRight],
            } as CompressedBinaryExpression;
        } else {
            return {
                ...inheritedPart,
                type: "CompressedLogicalExpression",
                operands: [...newLeft, ...newRight],
            } as CompressedLogicalExpression;
        }
    }
    return expressionToCompress;
}

// Function to extract side of given binary expression
function extractSideOfBinaryExpression(side: Node, operator: string): Node[] {
    if (side.type == "CompressedBinaryExpression" || side.type == "CompressedLogicalExpression") {
        if (side.operator == operator) {
            return [...side.operands]
        } else {
            return [side]
        }
    } else {
        return [side]
    }
}

// Function to compress binary expression in tree
export function compressBinaryExpressionsInTree(tree: Node): Node {

    let oldChildren = extractChildren(tree);
    let compressedChildren = oldChildren.map(child => compressBinaryExpressionsInTree(child));

    setChildren(tree, compressedChildren);

    if (tree.type == "BinaryExpression" || tree.type == "LogicalExpression")
        tree = compressBinaryExpression(tree);

    return tree;
}