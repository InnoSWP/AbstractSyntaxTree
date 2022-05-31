<script lang="ts" context="module">
    import { writable } from "svelte/store";

    type highlightInfo = [[number, number], "arr"|"tree"]
    export const arrayHighlight = writable([[-1, -1], "tree"] as highlightInfo);
    arrayHighlight.subscribe(()=>{})
</script>
