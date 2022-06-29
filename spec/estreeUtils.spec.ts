import { extractChildren, setChildren } from '../src/Estree/estreeUtils'
import type { Node } from '../src/Estree/estreeExtension'
import type { Literal } from 'estree'
import assert, { deepEqual, deepStrictEqual } from 'assert'

import { parseModule, Program } from 'esprima'
import { compressBinaryExpressionsInTree } from '../src/Estree/binaryExpressionCompressor'

const complexCode = `
import {s} from './l'
export function p(s2,l=2){
  
}
const np = (s,r,e,...arrayPattern)=>{}
console.log(s)
class m extends b{
  constructor(){
    super();
    console.log(\`template \$\{literal\}\`)
  }
  method(){
    let m = new m();
    throw m;
    this.method();
  }
}
console.log(objects.forEach((objectExample,s)=>{
  console.log(objectExample)
  console.log(s + s + s * s * s)
}))
let {prop1,prop2} = {prop1:"s","prop2":23}
for (let i = 0;;){
  i++;
  if (i == 0)
  continue;
  break;
}

switch(t){
  case 's':
    break;
  default:
    break;
}

while (2==3 != 2){
  try{
    do{

    }while(1 && 2 ^ 2 - 2*3)
  }catch (e){

  }
}
export { variable1 as name1, variable2 as default, nameN };

`

function recursivelySetChildren (node: Node, f: (Node) => Node) {
  const children = extractChildren(node)
  children.forEach(child => {
    recursivelySetChildren(child, f)
  })
  setChildren(node, children.map(f))
}

describe('Children extraction', () => {
  it('cancels out with children setting', async function () {
    const incrediblyComplexTree = compressBinaryExpressionsInTree(parseModule(complexCode, { range: true }))

    const initialTree = JSON.parse(JSON.stringify(incrediblyComplexTree))
    recursivelySetChildren(incrediblyComplexTree, (node) => node)
    const recursivelyResetTree = incrediblyComplexTree
    deepEqual(initialTree, recursivelyResetTree)
  })

  it('gives all information about simple expressions', async function () {
    const exampleTree = compressBinaryExpressionsInTree(parseModule('function p(s,d){console.log(s)}', { range: true })) as Program


    const functionChildren = extractChildren(exampleTree.body[0])
    
    const identifierP = functionChildren.find(node => node.type == 'Identifier' && node.name == 'p')
    const identifierS = functionChildren.find(node => node.type == 'Identifier' && node.name == 's')
    const identifierD = functionChildren.find(node => node.type == 'Identifier' && node.name == 'd')
    const functionBody = functionChildren.find(node => node.type == 'BlockStatement')

    assert(identifierD != null && identifierP != null && identifierS != null && functionBody != null && functionChildren.length == 4)
  })
})

describe('Children setting', () => {
  it('changes information about simple expressions', async function () {
    const exampleTree = compressBinaryExpressionsInTree(parseModule('2', { range: true })) as Program

    const literalStatement = exampleTree.body[0]

    const initialLiteral = extractChildren(literalStatement)
      .find(node => node.type == 'Literal' && node.value == 2) as Literal
    const changedLiteral = JSON.parse(JSON.stringify(initialLiteral)) as Literal
    changedLiteral.value = 23
    changedLiteral.raw = '23'
    changedLiteral.range = [0, 2]

    setChildren(literalStatement, [changedLiteral])

    const newLiteral = extractChildren(literalStatement)
      .find(node => node.type == 'Literal') as Literal

    deepEqual(changedLiteral, newLiteral)
  })
})
