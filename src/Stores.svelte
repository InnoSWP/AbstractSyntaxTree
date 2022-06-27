<script lang="ts" context="module">
import { highlightingFor } from "@codemirror/language";
    import type {  Node } from "./Estree/estreeExtension";

    import { writable } from "svelte/store";

    type highlightInfo = [[number, number], "arr"|"tree"]
    export const arrayHighlight = writable([[-1, -1], "tree"] as highlightInfo);
    arrayHighlight.subscribe(()=>{})

    type highlightState = "" | "highlighted" | "highlightedRoot"
    export const highlightStates = writable([] as highlightState[])
    highlightStates.subscribe(()=>{})

    export const nodeIndex = writable(new Map())
    nodeIndex.subscribe(()=>{})

    type option = {
        title: string,
        callback: () => void,
    }
    type contextMenuInfo = [
         option[],
        {x:number,y:number}
    ]
    export const contextMenu = writable([[],{x:0,y:0}] as contextMenuInfo);
    contextMenu.subscribe(()=>{})


    export const constantFolding = writable(null as Node);
    constantFolding.subscribe(()=>{})

</script>
