<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Simplified app.vue matching reference project structure
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #020617; /* slate-950 */
}

/* Custom Scrollbar matching reference style */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Selection color */
::selection {
  background-color: rgba(99, 102, 241, 0.3);
  color: white;
}
</style>
