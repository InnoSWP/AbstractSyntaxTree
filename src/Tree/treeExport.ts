import type { Node } from '../Estree/estreeExtension'
import { extractChildren } from '../Estree/estreeUtils'
import * as gr from 'ts-graphviz'
import { extractValue } from '../ArrayRepresentation.svelte'

export function generateGraphviz (tree: Node) {
  if (tree == null) {
    throw new Error('There is no tree to export')
  }
  const G = new gr.Digraph()
  const Tree = new gr.Subgraph('Tree')
  G.addSubgraph(Tree)

  function addAllNodes (tree: Node) {
    const curNode = new gr.Node(tree.type.toString() + '\n' + extractValue(tree), {
      // [gr.attribute.color]: 'black'
    })
    extractChildren(tree).forEach(element => {
      if (extractChildren(element).length == 0) {
        const leaf = new gr.Node(element.type.toString() + '\n' + extractValue(element), {
          // [gr.attribute.color]: 'black'
        })
        const edge = new gr.Edge([curNode, leaf])
        Tree.addNode(leaf)
        Tree.addEdge(edge)
      } else {
        const node = new gr.Node(element.type.toString() + '\n' + extractValue(element), {
          // [gr.attribute.color]: 'black'
        })
        const edge_ = new gr.Edge([curNode, node])
        Tree.addNode(node)
        Tree.addEdge(edge_)
        addAllNodes(element)
      }
    })
  }

  addAllNodes(tree)
  const dot = gr.toDot(G)
  return dot
}
