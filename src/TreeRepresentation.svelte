<script lang="ts">
    import TreeObject from "./Tree/TreeObject.svelte";
    export let tree = null;
</script>

<div class="tree-representation overflow-scroll h-screen">
    <ul>
        {#if tree != null}
            <TreeObject obj={tree}/>
        {/if}
    </ul>
</div>

<style lang="postcss">
    .tree-representation {
        @apply flex flex-col overflow-auto m-0 pl-5;
        background-color: #efefef;
    }

    ul {
        @apply flex-1 cursor-default font-mono box-border;
    }

    :global(li.entry) {
        @apply m-0 p-2 relative list-none;

        list-style-image: initial;
        text-align: match-parent;
    }

    :global(.entry.togglable::before) {
        @apply absolute -left-3 text-green-500;
        content: '+';
    }

    :global(.entry.togglable.open::before) {
        @apply text-red-500;
        content: '-';
    }

    :global(.entry.togglable > .key, .tokenName) {
        @apply cursor-pointer;
    }

    :global(.tokenName:hover, .entry.togglable > .key:hover > .name) {
        @apply underline;
    }

    :global(.nc) {
        @apply text-blue-400;
    }

    :global(.nb) {
        @apply text-amber-500;
    }

    :global(.p) {
        @apply text-gray-400;
    }

    :global(.s) {
        @apply text-sky-400;
    }

    :global(.value) {
        @apply whitespace-pre-wrap;
    }

    :global(.value-body) {
        @apply block pl-5;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;

        min-width: 300px;
        width: fit-content;
    }

</style>