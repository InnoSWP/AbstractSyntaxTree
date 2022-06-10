<script>
    export let isDisabled = false;
    export let text = '';

    export let dispatchClick:()=>void;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    const handleClick = e => {
        if (isDisabled) return;

        dispatch('click');
        dispatchClick();
    }
</script>

<style lang="postcss">
    div {
        @apply cursor-default items-center flex;
        padding: 4px 15px;
        font-size: 14px;
        grid-gap: 5px;
    }
    div:hover {
        background: #0002;
    }
    div.disabled {
        @apply hover:bg-white;
        color: #0006;
    }
</style>

<div
        class:disabled={isDisabled}
        on:click={handleClick}
>
    {#if text}
        {text}
    {:else}
        <slot />
    {/if}
</div>
