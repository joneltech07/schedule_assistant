<template>
  <div class="max-w-4xl mx-auto py-12 px-6">
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-4">
        Schedule Assistant Documentation
      </h1>
      <p class="text-slate-400 text-lg">
        Documentation for the Schedule-to-Calendar automation workflow and AI prompting logic.
      </p>
    </div>

    <div class="space-y-12 text-slate-300">
      <!-- 1. n8n Workflow Architecture -->
      <section class="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
          <span class="bg-indigo-500/20 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          n8n Workflow Architecture
        </h2>
        <p class="mb-6 text-slate-400">The application relies on an n8n webhook workflow to process the schedule text/images and generate structured events. The workflow executes in the following sequence:</p>
        
        <div class="font-mono text-sm text-slate-300 bg-slate-950/80 p-6 rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
          <div class="flex flex-col gap-8 w-max">
            <!-- Initial Path -->
            <div class="flex items-center gap-4">
              <div class="px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg shrink-0">Webhook (POST)</div>
              <div class="text-slate-600">→</div>
              <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">Check If Image or Text</div>
              <div class="text-slate-600">↘</div>
            </div>

            <!-- Branching Paths -->
            <div class="flex gap-12 ml-20">
              <!-- Image Path -->
              <div class="flex flex-col gap-4">
                <div class="text-[10px] text-pink-400 font-bold uppercase tracking-widest">If Image</div>
                <div class="flex items-center gap-4">
                  <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0">Analyze an Image</div>
                  <div class="text-slate-600">→</div>
                  <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">Format Data (Image)</div>
                </div>
              </div>

              <!-- Text Path -->
              <div class="flex flex-col gap-4">
                <div class="text-[10px] text-amber-400 font-bold uppercase tracking-widest">If Text</div>
                <div class="flex items-center gap-4">
                  <div class="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0 flex flex-col items-center">
                    <span>Basic LLM Chain</span>
                    <span class="text-[9px] opacity-60">Gemini / OpenRouter</span>
                  </div>
                  <div class="text-slate-600">→</div>
                  <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">Format Data (Text)</div>
                </div>
              </div>
            </div>

            <!-- Merged Final Path -->
            <div class="flex items-center gap-4">
              <div class="text-slate-600 ml-[400px]">↘</div>
              <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">Format Data for Calendar</div>
              <div class="text-slate-600">→</div>
              <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">Check if all day</div>
              <div class="text-slate-600">→</div>
              <div class="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg shrink-0 flex items-center gap-2">
                <CalendarIcon class="w-3 h-3" />
                <span>Create Calendar Event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. AI Prompting & JSON Structure -->
      <section class="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
          <span class="bg-indigo-500/20 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          AI Prompt & JSON Structure
        </h2>
        <p class="mb-6 text-slate-400">The LLM is configured to act as a precise Data Extraction Specialist. It strictly returns a JSON object, ensuring consistency with the UI rendering logic.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">JSON Structure Rules</h3>
            <ul class="space-y-4 text-sm text-slate-400">
              <li class="flex flex-col gap-1">
                <span class="text-slate-300 font-medium">Rule 1</span>
                <span>Every response MUST be a valid JSON object. Reasoning or explanations are forbidden.</span>
              </li>
              <li class="flex flex-col gap-1">
                <span class="text-slate-300 font-medium">Output Schema</span>
                <code class="text-xs text-indigo-300 bg-slate-950 p-3 rounded border border-slate-800 block mt-2">
                  { "output": { "type": "Schedule", "entries": [...] } }
                </code>
              </li>
              <li class="flex flex-col gap-1">
                <span class="text-slate-300 font-medium">Date Format</span>
                <span class="italic">All dates MUST follow YYYY-MM-DD format. Use current year if missing.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Critical Logic & Mapping</h3>
            <ul class="space-y-4 text-sm text-slate-400">
              <li class="flex gap-3">
                <div class="mt-0.5 text-indigo-400">•</div>
                <div>
                  <strong class="text-slate-300 block mb-1">Mutual Exclusivity</strong>
                  System strictly processes either Text OR Image to prevent data fusion conflicts.
                </div>
              </li>
              <li class="flex gap-3">
                <div class="mt-0.5 text-indigo-400">•</div>
                <div>
                  <strong class="text-slate-300 block mb-1">Date Splitting</strong>
                  Date ranges (e.g. "4 & 5") are automatically split into multiple sequential entries.
                </div>
              </li>
              <li class="flex gap-3">
                <div class="mt-0.5 text-indigo-400">•</div>
                <div>
                  <strong class="text-slate-300 block mb-1">Role Mapping</strong>
                  Intelligently maps roles like "PPT", "OBS", or "Meeting" to specific categories.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Full LLM System Prompt</h3>
          <div class="bg-slate-950 rounded-xl p-5 border border-slate-800 overflow-x-auto custom-scrollbar">
            <pre v-pre class="text-sm text-emerald-400/90 font-mono whitespace-pre-wrap leading-relaxed">STRICT_JSON_ONLY: Begin your response immediately with '{'. Do not include any introductory text or markdown formatting. 

Act as a precise Data Extraction Specialist. Your task is to convert raw Media Ministry schedules into a structured JSON format matching this schema:

{
  "output": {
    "type": "string",
    "entries": [ { "date": "YYYY-MM-DD", "category": "string", "name": "string" } ]
  }
}

### RULES:
1. OUTPUT: Return ONLY valid JSON.
2. DATES: Format all dates as YYYY-MM-DD.
3. RANGES: Split ranges like "4 & 5" into separate objects.</pre>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Documentation page
</script>

<style scoped>
/* Webkit (Chrome, Safari, Edge) */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 9999px;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(99, 102, 241, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(99, 102, 241, 0.6);
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}

.custom-scrollbar:hover {
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}
</style>
