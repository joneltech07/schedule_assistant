<template>
  <div
    class="w-full max-w-2xl mx-auto p-6 md:p-10 bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/10 text-slate-100 box-border relative overflow-hidden group"
  >
    <!-- Background Glow -->
    <div
      class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"
    ></div>
    <div
      class="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700"
    ></div>

    <div class="relative z-10">
      <div class="flex flex-col items-center mb-10">
        <div
          class="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500"
        >
          <CalendarIcon class="w-8 h-8" />
        </div>
        <h2
          class="text-4xl font-black text-center mt-0 mb-2 bg-gradient-to-br from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight"
        >
          Schedule Task
        </h2>
        <p class="text-slate-400 text-sm font-medium">
          AI-Powered Calendar Integration
        </p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Unified Input / Drag Zone -->
        <div
          class="flex flex-col gap-4 bg-slate-950/40 border-2 rounded-[2rem] p-6 transition-all duration-500 relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
          :class="[
            dragover
              ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02] shadow-indigo-500/10'
              : 'border-white/5 hover:border-white/10',
            textContent && imagePreviews.length > 0
              ? 'border-amber-500/50 bg-amber-500/5'
              : '',
          ]"
          @dragover.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
          @drop.prevent="onDrop"
        >
          <!-- Text Area -->
          <div class="relative">
            <textarea
              v-model="textContent"
              rows="4"
              :placeholder="
                imagePreviews.length > 0
                  ? 'Text input disabled while images are attached'
                  : 'Describe your task...'
              "
              :disabled="imagePreviews.length > 0"
              class="w-full bg-transparent text-slate-100 text-xl outline-none placeholder-slate-600 resize-none min-h-[120px] border-none focus:ring-0 leading-relaxed font-medium disabled:opacity-30 transition-opacity"
            ></textarea>
            <div
              v-if="imagePreviews.length > 0"
              class="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <span
                class="text-xs font-bold text-amber-500/40 uppercase tracking-widest bg-slate-950/50 px-3 py-1 rounded-full backdrop-blur-sm"
                >Image Mode Active</span
              >
            </div>
          </div>

          <!-- Image Previews Container -->
          <TransitionGroup
            name="list"
            tag="div"
            class="flex flex-wrap gap-4 mt-2"
            v-if="imagePreviews.length > 0"
          >
            <div
              v-for="(img, index) in imagePreviews"
              :key="img.url"
              class="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group/img flex-shrink-0"
            >
              <img
                :src="img.url"
                :alt="'Preview ' + index"
                class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
              />
              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
              >
                <button
                  type="button"
                  @click.stop="removeImage(index)"
                  class="bg-white/10 hover:bg-red-500/80 text-white w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                  aria-label="Remove Image"
                >
                  <span class="text-xl">✕</span>
                </button>
              </div>
            </div>
          </TransitionGroup>

          <!-- Footer Actions -->
          <div
            class="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-5 mt-2 gap-4"
          >
            <div class="w-full sm:w-auto relative group/btn-container">
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                ref="fileInput"
                :disabled="textContent.length > 0"
                @change="handleFileSelect"
              />
              <button
                type="button"
                @click="triggerFileInput"
                :disabled="textContent.length > 0"
                class="w-full sm:w-auto flex items-center justify-center gap-3 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl transition-all duration-300 text-sm font-bold cursor-pointer border border-white/10 hover:border-white/20 group/btn disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span
                  class="text-xl group-hover/btn:scale-125 transition-transform duration-300"
                  >🖼️</span
                >
                Attach Media
              </button>
              <div
                v-if="textContent.length > 0"
                class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn-container:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900 text-amber-500 text-[10px] px-2 py-1 rounded border border-amber-500/20"
              >
                Remove text to attach images
              </div>
            </div>

            <button
              type="submit"
              class="w-full sm:w-auto px-10 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white border-none rounded-2xl font-bold text-base cursor-pointer transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_20px_40px_-12px_rgba(99,102,241,0.5)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
              :disabled="
                isSubmitting || (!textContent && imagePreviews.length === 0)
              "
            >
              <span class="tracking-wide">{{
                isSubmitting ? "Scheduling..." : "Schedule Event"
              }}</span>
              <div v-if="isSubmitting" class="relative w-5 h-5">
                <div
                  class="absolute inset-0 border-2 border-white/20 rounded-full"
                ></div>
                <div
                  class="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
              </div>
              <CalendarIcon v-else class="w-5 h-5 opacity-80" />
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Overlay Progress Loader -->
    <Transition name="fade">
      <div
        v-if="isSubmitting"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl p-10 text-center"
      >
        <div class="relative w-32 h-32 mb-8 flex items-center justify-center">
          <!-- Concentric Spinner -->
          <div
            class="absolute inset-0 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-4 border-4 border-purple-500/10 border-b-purple-500 rounded-full animate-spin"
            style="animation-direction: reverse; animation-duration: 1.5s"
          ></div>
          <span class="text-4xl">🤖</span>
        </div>

        <div class="space-y-2 mb-10">
          <h3
            class="text-2xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight"
          >
            {{ currentStatusTitle }}
          </h3>
          <p
            class="text-slate-400 text-sm font-medium animate-pulse leading-relaxed max-w-[280px]"
          >
            {{ currentStatusDesc }}
          </p>
        </div>

        <!-- Progress Indicator Beads -->
        <div class="flex items-center gap-2">
          <div
            v-for="step in images.length > 0 ? 4 : 3"
            :key="step"
            class="h-1 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            :class="[
              currentStep >= step ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-800',
            ]"
          ></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ImagePreview {
  file: File;
  url: string;
}

const textContent = ref<string>("");
const images = ref<File[]>([]);
const imagePreviews = ref<ImagePreview[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const dragover = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

// Progress Loader State
const currentStep = ref(1);
const currentStatusTitle = ref("Ingesting Data...");
const currentStatusDesc = ref("Securing connection to AI framework...");
let simulationInterval: any = null;

const STATUS_MATRIX = {
  image: [
    {
      title: "Analyzing Image",
      desc: "Extracting timeline details and context from your media assets...",
    },
    {
      title: "Formatting Extracted Data",
      desc: "Structuring unstructured text arrays into a standardized timeline schema...",
    },
    {
      title: "AI Calendar Scheduling",
      desc: "Validating scheduling conflicts and constructing calendar events...",
    },
    {
      title: "Finalizing",
      desc: "Pushing entities to Google Calendar core layers...",
    },
  ],
  text: [
    {
      title: "Parsing Schedule Text",
      desc: "Running advanced LLM processing chains on your description...",
    },
    {
      title: "Constructing Timeline Schema",
      desc: "Formatting chronological sequences for localized dates...",
    },
    {
      title: "Finalizing",
      desc: "Syncing verified changes directly into Google Calendar...",
    },
  ],
};

const runProgressSimulation = (isImageMode: boolean) => {
  const steps = isImageMode ? STATUS_MATRIX.image : STATUS_MATRIX.text;
  currentStep.value = 1;

  simulationInterval = setInterval(() => {
    if (currentStep.value < steps.length) {
      const currentData = steps[currentStep.value - 1];
      currentStatusTitle.value = currentData.title;
      currentStatusDesc.value = currentData.desc;
      currentStep.value++;
    }
  }, 2200);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const processFiles = (files: FileList | File[] | null) => {
  if (!files) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      images.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          imagePreviews.value.push({
            file,
            url: e.target.result,
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
  target.value = "";
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
  runProgressSimulation(images.value.length > 0);

  const webhookUrl =
    "https://joneltech7-n8n-app.hf.space/webhook/schedule-ingest";

  try {
    let body;
    let headers = {};

    if (images.value.length > 0) {
      const formData = new FormData();
      formData.append("type", "image");
      if (textContent.value) {
        formData.append("content", textContent.value);
      }
      images.value.forEach((img, i) => {
        formData.append(`image_${i}`, img);
      });
      body = formData;
    } else {
      body = JSON.stringify({
        type: "text",
        content: textContent.value,
      });
      headers = { "Content-Type": "application/json" };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      body,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    emit("success");
    textContent.value = "";
    images.value = [];
    imagePreviews.value = [];
  } catch (error) {
    console.error("Submission error:", error);
    alert(
      "Failed to schedule task. Please check if the n8n workflow is active.",
    );
  } finally {
    if (simulationInterval) clearInterval(simulationInterval);
    isSubmitting.value = false;
  }
};

const emit = defineEmits(["success"]);
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}
</style>
