<template>
  <div class="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-indigo-500/30">
    <!-- Navigation Bar -->
    <header class="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <CalendarIcon class="w-6 h-6 text-indigo-400" />
          <span class="font-bold text-lg tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Schedule Assistant
          </span>
        </NuxtLink>
        
        <nav class="flex items-center gap-6">
          <NuxtLink 
            to="/" 
            class="text-sm font-medium transition-colors hover:text-indigo-400"
            active-class="text-indigo-400"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/documentation" 
            class="text-sm font-medium transition-colors hover:text-indigo-400"
            active-class="text-indigo-400"
          >
            Documentation
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col relative">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-950/50 py-6 mt-auto">
      <div class="container mx-auto px-6 text-center text-sm text-slate-500">
        <p>Designed & Built by <span class="font-semibold text-indigo-400">Jonel Uligan</span></p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Layout structure copied from automated_sermon_slide_generator
</script>
