<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export const arrayHighlight = writable([0, 0] as [number, number]);
    arrayHighlight.subscribe(()=>{})
</script>
