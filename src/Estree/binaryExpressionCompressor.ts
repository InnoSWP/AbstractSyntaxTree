import type { CompressedBinaryExpression, CompressedLogicalExpression, Node } from './estreeExtension'
import { extractChildren, setChildren } from './estreeUtils'

const operatorsToCompress = ['+', '&', '&&', '|', '||', '^', '*']

export function compressBinaryExpression (expressionToCompress: Node): Node {
  if (expressionToCompress.type != 'BinaryExpression' && expressionToCompress.type != 'LogicalExpression') { return expressionToCompress }
  const binaryOperator = expressionToCompress.operator
  if (operatorsToCompress.includes(binaryOperator)) {
    const newLeft = extractSideOfBinaryExpression(expressionToCompress.left, binaryOperator)
    const newRight = extractSideOfBinaryExpression(expressionToCompress.right, binaryOperator)

    const { left, right, type, ...inheritedPart } = expressionToCompress
    if (expressionToCompress.type == 'BinaryExpression') {
      return {
        ...inheritedPart,
        type: 'CompressedBinaryExpression',
        operands: [...newLeft, ...newRight]
      } as CompressedBinaryExpression
    } else {
      return {
        ...inheritedPart,
        type: 'CompressedLogicalExpression',
        operands: [...newLeft, ...newRight]
      } as CompressedLogicalExpression
    }
  }
  return expressionToCompress
}

function extractSideOfBinaryExpression (side: Node, operator: string): Node[] {
  if (side.type == 'CompressedBinaryExpression' || side.type == 'CompressedLogicalExpression') {
    if (side.operator == operator) {
      return [...side.operands]
    } else {
      return [side]
    }
  } else {
    return [side]
  }
}

export function compressBinaryExpressionsInTree (tree: Node): Node {
  const oldChildren = extractChildren(tree)
  const compressedChildren = oldChildren.map(child => compressBinaryExpressionsInTree(child))

  setChildren(tree, compressedChildren)

  if (tree.type == 'BinaryExpression' || tree.type == 'LogicalExpression') { tree = compressBinaryExpression(tree) }

  return tree
}
