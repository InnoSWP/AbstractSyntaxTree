<script lang="ts">
    import { onMount } from 'svelte'
    import { EditorState, basicSetup } from '@codemirror/basic-setup'
    import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
    import { indentWithTab } from '@codemirror/commands'
    import { javascript, esLint } from '@codemirror/lang-javascript'
    import { parseScript, parseModule, Program } from 'esprima'
    import type {  CompressedBinaryExpression, Node } from "./Estree/estreeExtension";
    import { compressBinaryExpression, compressBinaryExpressionsInTree } from './Estree/binaryExpressionCompressor';
    import { markerField, markerPlugin } from './MarkerPlugin.svelte'
    import { linter } from '@codemirror/lint'
    import Linter from "eslint4b-prebuilt";

    onMount(() => {
        createEditor()
        tree = parseModule(view.state.doc.toString(), { range: true })
        tree = compressBinaryExpressionsInTree(tree)
    })
    export let view: EditorView = null
    export let doc: string = ""

    let root
    export let tree: Node = null

    // Function to update handle
    function updateHandle(v: ViewUpdate): void {
        if(v.docChanged) {
            try {
                tree = parseModule(view.state.doc.toString(), { range: true })
                tree = compressBinaryExpressionsInTree(tree)
            } catch {}
        }
    }

    // Function for creating code editor for user
    function createEditor(): void {
        view = new EditorView({
            state: EditorState.create({
                extensions: [
                    linter(esLint(new Linter())),
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