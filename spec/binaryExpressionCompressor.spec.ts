import { compressBinaryExpressionsInTree } from '../src/Estree/binaryExpressionCompressor'
import assert from 'assert'

import { extractChildren } from '../src/Estree/estreeUtils.js'
import { parseModule } from 'esprima'
import type { CompressedBinaryExpression, CompressedLogicalExpression, Node } from '../src/Estree/estreeExtension'

function collectAllCompressedExpressions (node: Node): Array<CompressedBinaryExpression | CompressedLogicalExpression> {
  const children: Node[] = extractChildren(node)
  let collectedCompressedExpressions = [].concat(...children.map(child => collectAllCompressedExpressions(child)))
  if (node.type == 'CompressedBinaryExpression' || node.type == 'CompressedLogicalExpression') {
    collectedCompressedExpressions = collectedCompressedExpressions.concat(node)
  }
  return collectedCompressedExpressions
}

describe('Expression compressor', () => {
  it('compresses binary expressions', async function () {
    const initialTree = parseModule('console.log(3+3+3)', { range: true })
    const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

    const hasOnlyOneCompressedExpression = compressedExpressions.length == 1
    assert(hasOnlyOneCompressedExpression)

    const onlyExpression = compressedExpressions[0]

    const expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3
    const isAddition = onlyExpression.operator == '+'
    const isBinaryExpression = onlyExpression.type == 'CompressedBinaryExpression'
    assert(expressionConsistsOfThreeLiterals && isAddition && isBinaryExpression)
  })

  it('compresses logical expressions', async function () {
    const initialTree = parseModule('console.log(true && true && false)', { range: true })
    const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

    const hasOnlyOneCompressedExpression = compressedExpressions.length == 1
    assert(hasOnlyOneCompressedExpression)

    const onlyExpression = compressedExpressions[0]

    const expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3
    const isAnd = onlyExpression.operator == '&&'
    const isLogicalExpression = onlyExpression.type == 'CompressedLogicalExpression'
    assert(expressionConsistsOfThreeLiterals && isAnd && isLogicalExpression)
  })

  it('compresses all associative operations', async function () {
    for (const operator of ['+', '&', '&&', '|', '||', '^', '*']) {
      const initialTree = parseModule(`console.log(a ${operator} b ${operator} c)`, { range: true })
      const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

      const hasOnlyOneCompressedExpression = compressedExpressions.length == 1
      assert(hasOnlyOneCompressedExpression)

      const onlyExpression = compressedExpressions[0]

      const expressionConsistsOfThreeLiterals = onlyExpression.operands.length == 3
      const isCorrectOperator = onlyExpression.operator == operator
      assert(expressionConsistsOfThreeLiterals && isCorrectOperator)
    }
  })

  it('does not compress non-associative operations', async function () {
    for (const operator of ['-', '==', '!=', '/', '%']) {
      const initialTree = parseModule(`console.log(a ${operator} b ${operator} c)`, { range: true })
      const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

      const doesNotHaveCompressedExpressions = compressedExpressions.length == 0
      assert(doesNotHaveCompressedExpressions)
    }
  })

  it('does not compress incompressable expressions', async function () {
    const initialTree = parseModule('console.log(arr[index]).func()', { range: true })
    const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

    const doesNotHaveCompressedExpressions = compressedExpressions.length == 0
    assert(doesNotHaveCompressedExpressions)
  })

  it('compresses nested expressions', async function () {
    const initialTree = parseModule('console.log(3+3+3+(3-3-3*2*3*4))', { range: true })
    const compressedExpressions = collectAllCompressedExpressions(compressBinaryExpressionsInTree(initialTree))

    const plusExpression = compressedExpressions.find(expr => expr.operator == '+')
    assert(plusExpression != null && plusExpression.operands.length == 4)

    const multiplicationExpression = compressedExpressions.find(expr => expr.operator == '*')
    assert(multiplicationExpression != null && multiplicationExpression.operands.length == 4)
  })
})
