<template>
  <div class="w-full max-w-2xl mx-auto p-6 md:p-8 bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/5 text-slate-100 box-border">
    <h2 class="text-3xl font-bold text-center mt-0 mb-6 bg-gradient-to-br from-purple-400 to-indigo-500 bg-clip-text text-transparent">
      Schedule Task
    </h2>

    <form @submit.prevent="handleSubmit">
      <!-- Unified Input / Drag Zone -->
      <div 
        class="flex flex-col gap-3 bg-slate-800/60 border-2 rounded-2xl p-4 transition-all duration-300 relative shadow-inner"
        :class="dragover ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-white/10 hover:border-white/20'"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="onDrop"
      >
        <!-- Text Area -->
        <textarea 
          v-model="textContent" 
          rows="4"
          placeholder="Describe your task, or drag & drop images here..."
          class="w-full bg-transparent text-slate-100 text-lg outline-none placeholder-slate-500 resize-y min-h-[100px] border-none focus:ring-0"
        ></textarea>

        <!-- Image Previews Container -->
        <TransitionGroup 
          name="list" 
          tag="div" 
          class="flex flex-wrap gap-3 mt-2"
          v-if="imagePreviews.length > 0"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300 ease-in absolute"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-75"
        >
          <div v-for="(img, index) in imagePreviews" :key="img.url" class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-md border border-white/10 group flex-shrink-0">
            <img :src="img.url" :alt="'Preview ' + index" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <button 
              type="button" 
              @click.stop="removeImage(index)" 
              class="absolute top-1.5 right-1.5 bg-black/70 text-white w-7 h-7 rounded-full border-none flex items-center justify-center text-xs cursor-pointer opacity-0 transition-all duration-200 backdrop-blur-sm group-hover:opacity-100 hover:bg-red-500 hover:scale-110 shadow-sm" 
              aria-label="Remove Image"
            >
              ✕
            </button>
          </div>
        </TransitionGroup>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between border-t border-white/10 pt-3 mt-1">
          <div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              class="hidden" 
              ref="fileInput"
              @change="handleFileSelect"
            />
            <button 
              type="button" 
              @click="triggerFileInput"
              class="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold cursor-pointer border border-indigo-500/20"
            >
              <span class="text-xl leading-none">🖼️</span> Attach Media
            </button>
          </div>
          
          <button 
            type="submit" 
            class="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none rounded-xl font-semibold text-base cursor-pointer transition-all duration-300 flex items-center gap-2 shadow-[0_5px_15px_rgba(99,102,241,0.3)] hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_20px_rgba(99,102,241,0.4)] disabled:opacity-70 disabled:cursor-not-allowed active:not-disabled:translate-y-px"
            :disabled="isSubmitting || (!textContent && imagePreviews.length === 0)"
          >
            <span>{{ isSubmitting ? 'Scheduling...' : 'Schedule' }}</span>
            <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          </button>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ImagePreview {
  file: File;
  url: string;
}

const textContent = ref<string>('');
const images = ref<File[]>([]);
const imagePreviews = ref<ImagePreview[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const dragover = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const processFiles = (files: FileList | File[] | null) => {
  if (!files) return;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      images.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          imagePreviews.value.push({
            file,
            url: e.target.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  processFiles(target.files);
  // Reset input value so same files can be selected again if removed
  target.value = '';
};

const onDrop = (event: DragEvent) => {
  dragover.value = false;
  processFiles(event.dataTransfer?.files || null);
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!textContent.value && images.value.length === 0) return;
  
  isSubmitting.value = true;
  const webhookUrl = 'http://localhost:5678/webhook-test/schedule-ingest';
  
  try {
    if (images.value.length > 0) {
      // 🖼️ IMAGE REQUEST (FormData)
      const formData = new FormData();
      formData.append('type', 'image');
      
      // Optionally preserve the text if they submitted both simultaneously
      if (textContent.value) {
        formData.append('content', textContent.value);
      }

      images.value.forEach((img, i) => {
        formData.append(`image_${i}`, img); // must match n8n binary key
      });
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else if (textContent.value) {
      // 📝 TEXT REQUEST (JSON via Nuxt $fetch)
      await $fetch(webhookUrl, {
        method: 'POST',
        body: {
          type: 'text',
          content: textContent.value
        }
      });
    }

    alert('Task scheduled successfully!');
    
    // Reset the form
    textContent.value = '';
    images.value = [];
    imagePreviews.value = [];
  } catch (error) {
    console.error('Submission failed:', error);
    alert('Failed to schedule task. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
