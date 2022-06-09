<script lang="ts" context="module">
    import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, EditorView, } from '@codemirror/view';
    import { arrayHighlight, constantFolding } from './Stores.svelte';
    import type { Node } from 'estree';
    import { _view } from './App.svelte'
    import { extractChildren } from './ArrayRepresentation.svelte';

    type transactionDescription = {from:number,to:number,replaceWith:string}
    type foldResponse = {hasFoldedCompletely:boolean, descriptions:transactionDescription[]}

    function recursivelyFoldConstants(node:Node):foldResponse{
        if (node.type == "Literal"){
            return {hasFoldedCompletely:true, descriptions:[{from:node.range[0],to:node.range[1],replaceWith:node.raw}]}
        }

        let children = extractChildren(node)
        let allChilrenFolded = true
        let descriptions:transactionDescription[] = []
        children.forEach(child =>{
            let response = recursivelyFoldConstants(child)
            descriptions = descriptions.concat(response.descriptions)
            allChilrenFolded = allChilrenFolded && response.hasFoldedCompletely
        })

        if (allChilrenFolded && node.type == "BinaryExpression"){
            let expressionToEvaluate = 
                descriptions[0].replaceWith +
                node.operator +
                descriptions[1].replaceWith
            let evaluatatedExpression = JSON.stringify(eval(expressionToEvaluate))
            return {hasFoldedCompletely:true, descriptions:[{from:node.left.range[0],to:node.right.range[1],replaceWith:evaluatatedExpression}]}
        }

        return {hasFoldedCompletely:false, descriptions}
    }
    
    constantFolding.subscribe( nodeToFold => {
        if(nodeToFold == null) {
            return;
        }
        let transactionDescriptions = recursivelyFoldConstants(nodeToFold).descriptions
        let transactionSpecs = transactionDescriptions.map(({from,to,replaceWith}) =>
             {return {changes: {from:from, to:to, insert:  replaceWith}}})
        _view.dispatch(_view.state.update(...transactionSpecs))
        constantFolding.set(null)
    })

</script>
