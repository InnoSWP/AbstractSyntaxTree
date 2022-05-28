<script lang="ts">
    import { onMount } from 'svelte'
    import { EditorState, basicSetup } from '@codemirror/basic-setup'
    import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
    import { indentWithTab } from '@codemirror/commands'
    import { javascript } from '@codemirror/lang-javascript'
    import { parseScript, parseModule } from 'esprima'

    onMount(() => {
        createEditor()
        tree = parseModule(view.state.doc.toString())
    })

    export let view: EditorView = null
    export let classes: string = ""
    export let doc: string = ""

    let root
    export let tree = null

    function updateHandle(v: ViewUpdate) {
        if(v.docChanged) {
            try {
                tree = parseModule(view.state.doc.toString())
            } catch {}
        }
    }

    function createEditor() {
        view = new EditorView({
            state: EditorState.create({
                extensions: [
                    EditorView.updateListener.of(updateHandle),
                    basicSetup,
                    javascript(),
                    keymap.of([indentWithTab]),
                ],
                doc: doc,
            }),
            parent: root,
        })
    }

</script>

<div bind:this={root} class={classes} />

<style lang="postcss">
    :global(.cm-editor) {
        height:100%;
        width: 100%;
    }
</style>