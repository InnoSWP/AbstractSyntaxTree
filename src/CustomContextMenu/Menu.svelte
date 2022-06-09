<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import MenuOption from "./MenuOption.svelte";

    export let x:number;
    export let y:number;
    export let options:{title:string,callback: () => void}[];

    // whenever x and y is changed, restrict box to be within bounds
    $: (() => {
        if (!menuEl) return;
        const rect = menuEl.getBoundingClientRect();
        x = Math.min(window.innerWidth - rect.width, x);
        if (y > window.innerHeight - rect.height) y -= rect.height;
    })();

    const dispatch = createEventDispatcher();

    const dispatchClick = () => dispatch('click');


    let menuEl;
    function onPageClick(e) {
        if (e.target === menuEl || menuEl.contains(e.target)) return;
        dispatch('clickoutside');
    }
</script>

<style lang="postcss">    
    div {
        @apply grid absolute bg-white;
        border: 1px solid #0003;
        box-shadow: 2px 2px 5px 0px #0002;
    }
</style>

<svelte:body on:click={onPageClick} />
<div class = "menu" transition:fade={{ duration: 100 }} bind:this={menuEl} style=" position: fixed;top: {y}px; left: {x}px;">
    {#each options as option}
        <MenuOption
                dispatchClick = {dispatchClick}
                on:click={option.callback}
                text={option.title} />
    {/each}
</div>