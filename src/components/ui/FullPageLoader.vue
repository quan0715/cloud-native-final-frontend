<!-- FullPageLoader.vue -->
<template>
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
  >
    <svg class="h-10 w-10 animate-spin" viewBox="0 0 24 24">
      <circle
        class="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" stroke-width="4" fill="none"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  </div>
</template>
