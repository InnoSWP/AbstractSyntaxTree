import type { Node }  from "../Estree/estreeExtension";
import { extractChildren, setChildren } from '../Estree/estreeUtils';
import * as gr from 'ts-graphviz';


export function generateGraphviz(tree: Node){
    if (tree != null) {
        console.log(extractChildren(tree));
    }
    const G = new gr.Digraph();
    const A = new gr.Subgraph('A');
        
    const node1 = new gr.Node('node1', {
      [gr.attribute.color]: 'red'
    });

    const node2 = new gr.Node('node2', {
      [gr.attribute.color]: 'blue'
    });

    const edge = new gr.Edge([node1, node2], {
      [gr.attribute.label]: 'Edge Label',
      [gr.attribute.color]: 'pink'
    });

    G.addSubgraph(A);
    A.addNode(node1);
    A.addNode(node2);
    A.addEdge(edge);
    const dot = gr.toDot(G);
    //console.log(dot);
    return dot;
}