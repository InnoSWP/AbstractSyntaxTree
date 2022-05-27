<button>
  <slot />
</button>

<style lang="postcss">
  button {
    @apply bg-blue-800 text-white px-3 py-2 rounded hover:bg-blue-900;
  }
</style>
