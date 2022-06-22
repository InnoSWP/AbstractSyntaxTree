<script lang="ts">
    import { onMount } from 'svelte'
    import { EditorState, basicSetup } from '@codemirror/basic-setup'
    import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
    import { indentWithTab } from '@codemirror/commands'
    import { javascript } from '@codemirror/lang-javascript'
    import { parseScript, parseModule, Program } from 'esprima'
    import type {  CompressedBinaryExpression, Node } from "./Estree/estreeExtension";
    import { markerField, markerPlugin } from './MarkerPlugin.svelte'
    import estraverse from 'estraverse'
    import { compressBinaryExpression, compressBinaryExpressionsInTree } from './Estree/BinaryExpressionComressor';

    onMount(() => {
        createEditor()
        tree = parseModule(view.state.doc.toString(), { range: true })
    })
    export let view: EditorView = null
    export let doc: string = ""

    let root
    export let tree: Node = null

    function updateHandle(v: ViewUpdate): void {
        if(v.docChanged) {
            try {
                tree = parseModule(view.state.doc.toString(), { range: true })
                tree = compressBinaryExpressionsInTree(tree)
            } catch(e) {
            }
        }
    }

    function createEditor(): void {
        view = new EditorView({
            state: EditorState.create({
                extensions: [
                    EditorView.updateListener.of(updateHandle),
                    basicSetup,
                    javascript(),
                    keymap.of([indentWithTab]),
                    markerField.extension,
                    markerPlugin.extension,
                ],
                doc: doc,
            }),
            parent: root,
        })
    }

</script>

<div bind:this={root} class="h-full w-full" />

<style lang="postcss">
    :global(.cm-editor) {
        @apply h-full w-full;
    }

    :global(.highlightedRoot) {
        @apply bg-amber-300;
    }
</style>