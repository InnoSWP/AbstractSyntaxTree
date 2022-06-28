import { recursivelyFoldConstants } from '../src/constantFolding'
import assert from 'assert'

import { parseModule } from 'esprima'

describe('Constant folding', () => {
  it('folds binary expressions', async function () {
    const { descriptions } = recursivelyFoldConstants(parseModule('console.log(1+1)', { range: true }))

    const foldedIntoOneConstant = descriptions.length == 1
    assert(foldedIntoOneConstant)

    const replacedWithDesirableConstant = descriptions[0].replaceWith == '2'
    assert(replacedWithDesirableConstant)
  })

  it('folds logical expressions', async function () {
    const { descriptions } = recursivelyFoldConstants(parseModule('console.log(true || false)', { range: true }))

    const foldedIntoOneConstant = descriptions.length == 1
    assert(foldedIntoOneConstant)

    const replacedWithDesirableConstant = descriptions[0].replaceWith == 'true'
    assert(replacedWithDesirableConstant)
  })

  it('does not fold variables', async function () {
    const { descriptions } = recursivelyFoldConstants(parseModule('console.log(a + b)', { range: true }))

    const didNoFoldings = descriptions.length == 0
    assert(didNoFoldings)
  })

  it('folds nested expressions', async function () {
    const { descriptions } = recursivelyFoldConstants(parseModule('console.log(1+(2*3)+4)', { range: true }))

    const foldedIntoOneConstant = descriptions.length == 1
    assert(foldedIntoOneConstant)

    const replacedWithDesirableConstant = descriptions[0].replaceWith == '11'
    assert(replacedWithDesirableConstant)
  })
})
