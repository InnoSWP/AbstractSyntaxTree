
import type { Node } from "./Estree/estreeExtension";
import { extractChildren } from "./Estree/estreeUtils"


type transactionDescription = { from: number, to: number, replaceWith: string }
type foldResponse = { hasFoldedCompletely: boolean, descriptions: transactionDescription[] }

// Function to fold constants recursively
export function recursivelyFoldConstants(node: Node): foldResponse {
    if (node.type == "Literal") {
        return { hasFoldedCompletely: true, descriptions: [{ from: node.range[0], to: node.range[1], replaceWith: node.raw }] }
    }

    let children:Node[] = extractChildren(node)
    let allChildrenFolded = true
    let descriptions: transactionDescription[] = []
    children.forEach(child => {
        let response = recursivelyFoldConstants(child)
        descriptions = descriptions.concat(response.descriptions)
        allChildrenFolded = allChildrenFolded && response.hasFoldedCompletely
    })

    if (allChildrenFolded && (node.type == "BinaryExpression" || node.type == "LogicalExpression")) {
        let expressionToEvaluate =
            descriptions[0].replaceWith +
            node.operator +
            descriptions[1].replaceWith
        let evaluatatedExpression = JSON.stringify(eval(expressionToEvaluate))
        return { hasFoldedCompletely: true, descriptions: [{ from: node.left.range[0], to: node.right.range[1], replaceWith: evaluatatedExpression }] }
    } else if (allChildrenFolded && (node.type == "CompressedBinaryExpression" || node.type == "CompressedLogicalExpression")) {
        let expressionToEvaluate = descriptions.map(description => description.replaceWith).join(node.operator)
        let evaluatatedExpression = JSON.stringify(eval(expressionToEvaluate))

        let firstOperand = node.operands[0], lastOperand = node.operands[node.operands.length - 1];

        return { hasFoldedCompletely: true, descriptions: [{ from: firstOperand.range[0], to: lastOperand.range[1], replaceWith: evaluatatedExpression }] }
    }

    return { hasFoldedCompletely: false, descriptions }
}