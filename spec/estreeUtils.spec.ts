import { extractChildren, setChildren } from '../src/Estree/estreeUtils';
import type { Node } from '../src/Estree/estreeExtension'
import assert, { deepEqual } from "assert";

import { parseModule } from "esprima";

let complexCode = `
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

function recursivelySetChildren(node: Node, f: (Node) => Node) {
  let children = extractChildren(node)
  children.forEach(child => {
    recursivelySetChildren(child, f);
  })
  setChildren(node, children.map(f))
}

describe("Children extraction", () => {
  it("cancels out with children setting", async function () {
    let incrediblyComplexTree = parseModule(complexCode, { range: true })

    let initialTree = JSON.parse(JSON.stringify(incrediblyComplexTree))
    recursivelySetChildren(incrediblyComplexTree, (node) => node)
    let recursivelyResetTree = incrediblyComplexTree;
    deepEqual(initialTree, recursivelyResetTree)
  });

})