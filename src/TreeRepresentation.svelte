<script lang="ts">
    import TreeObject from "./Tree/TreeObject.svelte";
    import type { Program } from "esprima";
    export let tree: Program = null;
</script>

<div class="tree-representation overflow-scroll h-full text-xs">
    <ul>
        {#if tree != null}
            <TreeObject obj={tree}/>
        {/if}
    </ul>
</div>

<style lang="postcss">
    :global(.highlighted) {
        @apply bg-amber-300;
    }

    .tree-representation {
        @apply flex flex-col m-0 pl-5 bg-treebg;
    }

    ul {
        @apply flex-1 cursor-default font-mono box-border;
    }

    :global(li.entry) {
        @apply m-0 p-0 relative list-none;

        list-style-image: initial;
        text-align: match-parent;
    }

    :global(.entry.togglable::before) {
        @apply absolute -left-4 top-0.5 w-3 h-3;
        content: "";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M9 5l7 7-7 7' /%3E%3C/svg%3E");
    }

    :global(.entry.togglable.open::before) {
        content: "";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E");
    }

    :global(.entry.togglable > .key, .tokenName) {
        @apply cursor-pointer;
    }

    :global(.tokenName:hover, .entry.togglable > .key:hover > .name) {
        @apply underline;
    }

    :global(.nc) {
        @apply text-keyword;
    }

    :global(.nb) {
        @apply text-identifier;
    }

    :global(.p) {
        @apply text-gray-400;
    }

    :global(.s) {
        @apply text-literal;
    }

    :global(.value) {
        @apply whitespace-pre-wrap;
    }

    :global(.value-body) {
        @apply block pl-5;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 20px;

        min-width: 300px;
        width: fit-content;
    }

</style>