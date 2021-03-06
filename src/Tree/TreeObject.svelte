<script lang="ts">
    import TreePrimitive from "./TreePrimitive.svelte";
    import TreeArray from "./TreeArray.svelte";
    import { slide } from 'svelte/transition';
    import {contextMenu, arrayHighlight, constantFolding, highlightStates, nodeIndex, storedArrayHighlight } from "../Stores.svelte";
    import type {  Node } from "../Estree/estreeExtension";
    import CodeMirror from "../CodeMirror.svelte";
    import { get } from "svelte/store";

    export let obj: Node
    export let expanded = true
    export let key: string = ""

    let hfrom: number, hto: number, hsrc: string
    $: [[hfrom, hto], hsrc] = $arrayHighlight


    let from: number, to: number, src: string
    $: {
        if(obj.range != undefined) {
            [from, to] = obj.range
        } else {
            [from, to] = [0, 0]
        }
    }

    // Function to  change state of tree object (if it expanded or not)
    function toggle() {
        expanded = !expanded
    }

    // Function to check if tree object is primitive
    function isPrimitive(val) {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    // Function to hangle mouse position when it enter tree object zone
    function handleMouseEnter() {
        clearHighlight()
        arrayHighlight.set([[from, to], "tree"])
        $highlightStates[$nodeIndex.get(obj)] = "highlightedRoot"
    }

    // Function to hangle mouse position when it leave tree object zone
    function handleMouseLeave() {
        clearHighlight()
        arrayHighlight.set($storedArrayHighlight)
    }

    // Function to clear hithlight from tree object 
    function clearHighlight() {
        for (let i = 0; i < get(highlightStates).length; i++){
            $highlightStates[i] = ""
        }
    }

    // Function to fold constants 
    function getFoldConstantsFunction():null|(()=>void){
        return ()=>{
            constantFolding.set(obj)
        };
    }

    // Function to handle click RMB on tree object
    function rightClick(e){
        let folding = getFoldConstantsFunction();
        if (folding == null)
            return;
        let pos = { x: e.clientX, y: e.clientY };
        let options = [{title:"Fold constants",callback:folding}]
        contextMenu.set([options,pos])
    }

</script>

<li class="entry togglable {expanded ? "open" : ""} {$highlightStates[$nodeIndex.get(obj)]}">
    <span class="value" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} on:contextmenu|preventDefault={rightClick}>
        <span class="tokenName nc">
            {obj.type != undefined ? obj.type : key}
        </span>
    </span>

    <span class="prefix p">{' {'}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each Object.entries(obj) as [k, v]}
                {#if isPrimitive(v) && k != 'type' && k != 'sourceType'}
                    <TreePrimitive key={k} value={v}/>
                {:else if Array.isArray(v) && k != 'range'}
                    <TreeArray key={k} value={v} parent={obj}/>
                {:else if k != 'range' && k != 'type' && k != 'sourceType'}
                    <svelte:self obj={v} key={k} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{'}'}</div>
</li>
