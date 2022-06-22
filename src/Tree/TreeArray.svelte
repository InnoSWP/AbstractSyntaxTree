<script lang="ts">
    import TreeObject from "./TreeObject.svelte";
    import { slide } from 'svelte/transition';
    import { arrayHighlight , contextMenu, highlightStates, nodeIndex} from "../Stores.svelte";
    import type { Node } from 'estree';
import { get } from "svelte/store";

    export let expanded: boolean = true
    export let key: string = "", value = []
    export let parent: Node


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

    function toggle() {
        expanded = !expanded
    }

    function isPrimitive(val): boolean {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    function handleMouseEnter() {
        let range = calculateRange()
        if(range.from == undefined) {
            range.from = 0
            range.to = 0
        }
        $highlightStates[$nodeIndex.get(parent)] = "highlightedRoot"
        arrayHighlight.set([[range.from, range.to], "tree"])
    }

    function clearHighlight() {
        for (let i = 0; i < get(highlightStates).length; i++)
            $highlightStates[i] = ""
    }

    function handleMouseLeave() {
        arrayHighlight.set([[0, 0], "tree"])
        clearHighlight()
    }

    function rightClick(e){
        let pos = { x: e.clientX, y: e.clientY };
        let options = [{title:"TreeArray sample option",callback:()=>console.log("tree array option clicked")}]
        contextMenu.set([options,pos])
    }

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