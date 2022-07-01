<script lang="ts">
    import TreeObject from "./TreeObject.svelte";
    import { slide } from 'svelte/transition';
    import { arrayHighlight , contextMenu, highlightStates, nodeIndex, storedArrayHighlight } from "../Stores.svelte";
    import type { Node } from '../Estree/estreeExtension';
    import { get } from "svelte/store";

    export let expanded: boolean = true
    export let key: string = "", value = []
    export let parent: Node


    // Function to calculate the range of tree array
    function calculateRange(): {from: number, to: number} {
        let from, to
        for(let el of value) {
            if(typeof el != 'object') {
                continue;
            }

            if(!from) {
                from = el.range[0]
            }
            if(!to) {
                to = el.range[0]
            }
            from = Math.min(from, el.range[0])
            to = Math.max(to, el.range[1])
        }

        return {from:from, to:to}
    }

    // Function to change state of tree array (if it expanded or not)
    function toggle() {
        expanded = !expanded
    }

    // Function to check if tree array is primitive
    function isPrimitive(val): boolean {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    // Function to hangle mouse position when it enter tree array zone
    function handleMouseEnter() {
        clearHighlight()
        let range = calculateRange()
        if(range.from == undefined) {
            range.from = 0
            range.to = 0
        }
        $highlightStates[$nodeIndex.get(parent)] = "highlightedRoot"
        arrayHighlight.set([[range.from, range.to], "tree"])
    }

    // Function to clear highlight from tree array
    function clearHighlight() {
        for (let i = 0; i < get(highlightStates).length; i++){
            $highlightStates[i] = ""
        }
    }

    // Function to hangle mouse position when it leave tree array zone
    function handleMouseLeave() {
        clearHighlight()
        arrayHighlight.set($storedArrayHighlight)
    }

    // Function to handle click RMB on array tree zone
    function rightClick(e){
        let pos = { x: e.clientX, y: e.clientY };
        let options = [{title:"TreeArray sample option",callback:()=>console.log("tree array option clicked")}]
        contextMenu.set([options,pos])
    }

    // Function to highlight all elements in tree array
    function getHighlight() {
        value.forEach(element => {
            if ($highlightStates[$nodeIndex.get(element)] == "highlighted")
                return "highlighted"
        });
        return ""
    }
</script>

<li class="entry togglable {expanded ? "open" : ""} {getHighlight()}">
    <span class="key" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}  on:contextmenu|preventDefault={rightClick}>
        <span class="name nb">
            {key}
        </span>
        <span class="p">{': '}</span>
    </span>
    <span class="prefix p">{" ["}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each value as e}
                {#if isPrimitive(e)}
                    <li>
                        <span class="entry">
                            <span class="value">
                                <span class="s">{e}</span>
                            </span>
                        </span>
                    </li>
                {:else}
                    <TreeObject obj={e} expanded={false}/>
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{"]"}</div>
</li>