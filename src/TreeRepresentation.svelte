<script lang="ts">
    import TreeObject from "./Tree/TreeObject.svelte";
    export let tree = null;
</script>

<div class="tree-representation overflow-scroll h-screen">
    <ul>
        {#if tree != null}
            <TreeObject obj={tree} />
        {/if}
    </ul>
</div>

<style lang="postcss">
    .tree-representation {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding-left: 20px;
        overflow: auto;
        background-color: #efefef;
    }

    ul {
        cursor: default;
        box-sizing: border-box;
        font-family: monospace;
        flex: 1;
    }

    :global(li.entry) {
        list-style-image: initial;
        margin: 0;
        list-style: none;
        padding: 5px;
        position: relative;
        text-align: match-parent;
    }

    :global(.entry.togglable::before) {
        content: '+';
        color: green;
        position: absolute;
        left: -10px;
    }

    :global(.entry.togglable.open::before) {
        content: '-';
        color: red;
    }

    :global(.entry.togglable > .key) {
        cursor: pointer;
    }

    :global(.tokenName, .entry.togglable) {
        cursor: pointer;
    }

    :global(.nc) {
        color: rgb(78, 150, 202);
    }

    :global(.nb) {
        color: goldenrod;
    }

    :global(.p) {
        color: darkgray;
    }

    :global(.s) {
        color: #2aa198;
    }

    :global(.value) {
        white-space: pre-wrap;
    }

    :global(.value-body) {
        display: block;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;

        min-width: 300px;
        width: fit-content;
        padding-left: 20px;
    }

</style>