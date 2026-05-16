<template>
  <div class="container mx-auto px-6 py-12 flex flex-col items-center gap-16">
    <!-- Form Section -->
    <div class="w-full flex justify-center">
      <MultiInputForm @success="refreshCalendar" />
    </div>

    <!-- Calendar Section -->
    <section class="w-full max-w-5xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 class="text-3xl font-bold text-white tracking-tight mb-2">Live Calendar View</h2>
          <p class="text-slate-400 font-medium">Instantly track and verify your AI-generated schedule entries.</p>
        </div>
        <button 
          @click="manualRefresh" 
          :disabled="isRefreshing"
          class="flex items-center gap-3 px-6 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 rounded-full transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div :class="['w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full', isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500']"></div>
          <span class="text-xs font-bold uppercase tracking-widest">{{ isRefreshing ? 'Refreshing...' : 'Refresh Calendar' }}</span>
        </button>
      </div>
      
      <div class="relative w-full aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
        <iframe 
          :key="calendarKey"
          src="https://calendar.google.com/calendar/embed?src=itcodelearner%40gmail.com&ctz=Asia%2FManila" 
          style="border: 0" 
          class="absolute inset-0 w-full h-full grayscale invert-[0.85] hue-rotate-180 brightness-90 opacity-90 transition-opacity duration-700"
          frameborder="0" 
          scrolling="no"
        ></iframe>
        
        <!-- Loading Background -->
        <div class="absolute inset-0 flex items-center justify-center bg-slate-900/50 -z-10">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <span class="text-slate-500 text-sm font-medium animate-pulse">Syncing with Google Calendar...</span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 font-medium border-t border-slate-800/50 pt-6">
        <div class="flex items-center gap-2">
          <span class="text-indigo-400">Timezone:</span>
          <span class="text-slate-400">Asia/Manila (GMT+8)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-indigo-400">Account:</span>
          <span class="text-slate-400">itcodelearner@gmail.com</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const calendarKey = ref(0);
const isRefreshing = ref(false);

const refreshCalendar = () => {
  // Automatic refresh with delay (used for post-submission)
  isRefreshing.value = true;
  setTimeout(() => {
    calendarKey.value++;
    isRefreshing.value = false;
  }, 2000); 
};

const manualRefresh = () => {
  // Immediate refresh when button is clicked
  isRefreshing.value = true;
  calendarKey.value++;
  setTimeout(() => {
    isRefreshing.value = false;
  }, 6000); // Keep spinner for a bit to show it's "syncing"
};
</script>
