<script lang="ts">
    import { closeModal } from 'svelte-modals';

    export let title: string
    export let isOpen: boolean
    export let link: string
    let inp: HTMLInputElement

    function copyToClipboard() {
        inp.setSelectionRange(0, inp.value.length);
        navigator.clipboard.writeText(link);
    }
</script>

{#if isOpen}
    <div role="dialog" class="modal">
        <div class="contents">
            <h2>{title}</h2>
            <input type="text" bind:this={inp} value={link} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <div class="actions">
                <button on:click={closeModal}>
                    Close
                </button>
                <button on:click={copyToClipboard}>
                    Copy
                </button>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    .modal {
        @apply fixed top-0 bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50;
        align-items: center;
    }

    .contents {
        @apply p-4 rounded-lg bg-white flex flex-col justify-between pointer-events-auto; 
        min-width: 240px;
    }

    button {
        @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 m-2 rounded;
    }

    h2 {
        @apply text-center text-base;
    }

    .actions {
        @apply mt-8 flex justify-between gap-2;
    }
</style>