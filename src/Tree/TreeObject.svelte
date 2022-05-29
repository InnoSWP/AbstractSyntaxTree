<script lang="ts">
    import TreePrimitive from "./TreePrimitive.svelte";
    import TreeArray from "./TreeArray.svelte";
    import { slide } from 'svelte/transition';
    import { highlight, deselectAll} from '../App.svelte';

    export let obj
    export let expanded = true

    function toggle() {
        expanded = !expanded
    }

    function isPrimitive(val) {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    function handleMouseEnter() {
        console.log(obj)
        highlight({from: obj.range[0], to: obj.range[1]})
    }

    function handleMouseLeave() {
        deselectAll()
    }
</script>

<li class="entry togglable {expanded ? "open" : ""}">
    <span class="value" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <span class="tokenName nc">
            {obj.type}
        </span>
    </span>
    <span class="prefix p">{' {'}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each Object.entries(obj) as e}
                {#if isPrimitive(e[1])}
                    <TreePrimitive key={e[0]} value={e[1]}/>
                {:else if Array.isArray(e[1]) && e[0] != 'range'}
                    <TreeArray key={e[0]} value={e[1]}/>
                {:else if e[0] != 'range'}
                    <svelte:self obj={e[1]} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{'}'}</div>
</li>

<style lang="postcss">

</style>