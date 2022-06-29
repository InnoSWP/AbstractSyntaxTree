<script lang="ts" context="module">
    import {
        Decoration,
        DecorationSet,
        ViewPlugin,
        ViewUpdate,
        EditorView,
    } from "@codemirror/view";
    import { arrayHighlight, constantFolding } from "./Stores.svelte";
    import type { Node } from "./Estree/estreeExtension";
    import { extractChildren } from "./Estree/estreeUtils";
    import { _view } from "./App.svelte";
    import { recursivelyFoldConstants } from "./ConstantFolding";

    constantFolding.subscribe((nodeToFold) => {
        if (nodeToFold == null) {
            return;
        }
        let transactionDescriptions =
            recursivelyFoldConstants(nodeToFold).descriptions;
        let transactionSpecs = transactionDescriptions.map(
            ({ from, to, replaceWith }) => {
                return { changes: { from: from, to: to, insert: replaceWith } };
            }
        );
        _view.dispatch(_view.state.update(...transactionSpecs));
        constantFolding.set(null);
    });
</script>
