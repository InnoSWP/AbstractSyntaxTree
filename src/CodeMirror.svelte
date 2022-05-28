<script lang="ts">
    import { onMount } from 'svelte'
    import { EditorState, basicSetup } from '@codemirror/basic-setup'
    import { EditorView, keymap, ViewUpdate, DecorationSet, ViewPlugin } from '@codemirror/view'
    import { indentWithTab } from '@codemirror/commands'
    import { javascript } from '@codemirror/lang-javascript'
    import { parseScript, parseModule } from 'esprima'
    import { markerUpdate, markerField } from './App.svelte'

    onMount(() => {
        createEditor()
        tree = parseModule(view.state.doc.toString(), { range: true })
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

    const markerPlugin = ViewPlugin.fromClass(class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = view.state.field(markerField)
        }

        update(update: ViewUpdate) {
            if(update.transactions.length != 0) {
                this.decorations = update.view.state.field(markerField)
            }
            console.log(this.decorations)
        }
    }, {
        decorations: v => v.decorations
    })

    function createEditor() {
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

<div bind:this={root} class={classes} />

<style lang="postcss">
    :global(.cm-editor) {
        height:100%;
        width: 100%;
    }

    :global(.highlighted) {
        background-color: rgb(253 230 138);
    }
</style>