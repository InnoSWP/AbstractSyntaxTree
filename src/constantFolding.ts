
import type { Node } from './Estree/estreeExtension'
import { extractChildren } from './Estree/estreeUtils'

interface transactionDescription { from: number, to: number, replaceWith: string }
interface foldResponse { hasFoldedCompletely: boolean, descriptions: transactionDescription[] }

export function recursivelyFoldConstants (node: Node): foldResponse {
  if (node.type == 'Literal') {
    return { hasFoldedCompletely: true, descriptions: [{ from: node.range[0], to: node.range[1], replaceWith: node.raw }] }
  }

  const children: Node[] = extractChildren(node)
  let allChildrenFolded = true
  let descriptions: transactionDescription[] = []
  children.forEach(child => {
    const response = recursivelyFoldConstants(child)
    descriptions = descriptions.concat(response.descriptions)
    allChildrenFolded = allChildrenFolded && response.hasFoldedCompletely
  })

  if (allChildrenFolded && (node.type == 'BinaryExpression' || node.type == 'LogicalExpression')) {
    const expressionToEvaluate =
            descriptions[0].replaceWith +
            node.operator +
            descriptions[1].replaceWith
    const evaluatatedExpression = JSON.stringify(eval(expressionToEvaluate))
    return { hasFoldedCompletely: true, descriptions: [{ from: node.left.range[0], to: node.right.range[1], replaceWith: evaluatatedExpression }] }
  } else if (allChildrenFolded && (node.type == 'CompressedBinaryExpression' || node.type == 'CompressedLogicalExpression')) {
    const expressionToEvaluate = descriptions.map(description => description.replaceWith).join(node.operator)
    const evaluatatedExpression = JSON.stringify(eval(expressionToEvaluate))

    const firstOperand = node.operands[0]; const lastOperand = node.operands[node.operands.length - 1]

    return { hasFoldedCompletely: true, descriptions: [{ from: firstOperand.range[0], to: lastOperand.range[1], replaceWith: evaluatatedExpression }] }
  }

  return { hasFoldedCompletely: false, descriptions }
}