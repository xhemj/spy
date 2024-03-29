<template>
  <div class="Main">
    <div class="w-fit bg-black rounded-lg">
      <router-link :to="{ name: 'home' }">
        <ChevronLeftIcon class="text-3xl font-bold text-white" />
      </router-link>
    </div>
    <div
      class="w-full bg-white rounded-xl border-[3px] border-solid border-gray-700 shadow-md mt-8 p-4"
    >
      <div class="w-full text-center">
        <img
          class="h-full w-auto max-w-[150px] max-h-[25px] mx-auto"
          src="https://staticoss.xhemj.work/spy.xhemj.com/text-setting.png"
          alt="游戏设置"
        />
      </div>
      <div class="w-full mt-8 px-4">
        <!-- 游戏人数 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">游戏人数</h2>
          <t-input-number
            :step="1"
            :min="minTotalPlayerCount"
            v-model="game.totalPlayerCount"
          />
        </div>

        <!-- 卧底人数 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">卧底人数</h2>
          <t-input-number
            :step="1"
            :min="1"
            :max="maxUndercoverCount"
            v-model="game.undercoverCount"
          />
        </div>

        <!-- 白板玩家 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">白板玩家</h2>
          <t-radio-group v-model="game.hasBlankPlayer">
            <t-radio :value="true">有</t-radio>
            <t-radio :value="false">无</t-radio>
          </t-radio-group>
        </div>

        <!-- 自定义词语 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">自定义词语</h2>
          <label :for="settingModalId">
            <h2
              class="text-base font-medium text-[var(--td-brand-color)] cursor-pointer flex flex-row items-center"
            >
              {{ isSetCustomWords ? "已设置" : "未设置" }}<ChevronRightIcon />
            </h2>
          </label>
        </div>

        <!-- 调试模式 -->
        <div
          class="flex flex-row justify-between items-center border-t border-[var(--td-border-level-1-color)] border-dashed pt-6 mb-6"
        >
          <h2 class="text-lg font-medium">调试模式</h2>
          <t-radio-group v-model="game.isDebugMode">
            <t-radio :value="true">开</t-radio>
            <t-radio :value="false">关</t-radio>
          </t-radio-group>
        </div>
      </div>
    </div>
    <!-- 开始游戏 -->
    <div class="w-full mt-8 text-center">
      <span class="game-btn mx-auto" @click="handleStartGame"> 开始游戏 </span>
    </div>

    <!-- 自定义词语弹窗 -->
    <input
      ref="modalRef"
      type="checkbox"
      :id="settingModalId"
      class="modal-toggle"
    />
    <div class="modal">
      <div class="modal-box">
        <h2 class="font-bold text-lg text-center">自定义词语</h2>
        <div class="absolute top-2 right-2 z-50">
          <label
            :for="settingModalId"
            class="btn btn-sm btn-circle btn-ghost"
            title="关闭"
          >
            <CloseIcon size="1.5rem" />
          </label>
        </div>
        <p class="py-4 text-left space-y-4">
          <t-input
            label="平民词"
            placeholder="请输入平民词"
            v-model="customCivilianWord"
          />
          <t-input
            label="卧底词"
            placeholder="请输入卧底词"
            v-model="customUndercoverWord"
          />
        </p>
        <div class="text-center mt-4">
          <span
            class="game-btn game-btn-small mx-auto"
            :class="{
              disabled: !isSetCustomWords,
            }"
            @click="handleCustomWords"
          >
            确定
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "tdesign-icons-vue-next";
import { computed, ref } from "vue";
import { useGameStore } from "../stores/game";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const game = useGameStore();

const settingModalId = "setting-modal";
const modalRef = ref<HTMLInputElement | null>(null);

const customCivilianWord = ref("");
const customUndercoverWord = ref("");

const minTotalPlayerCount = computed(() => {
  return game.undercoverCount + 1;
});

const maxUndercoverCount = computed(() => {
  return game.totalPlayerCount - 1;
});

const isSetCustomWords = computed(() => {
  return customCivilianWord.value && customUndercoverWord.value;
});

const handleCustomWords = () => {
  if (isSetCustomWords.value) {
    game.isCustomWordMode = true;
    game.civilianWord = customCivilianWord.value;
    game.undercoverWord = customUndercoverWord.value;
    game.selectedWordId = -1;
    if (modalRef.value) {
      modalRef.value.checked = false;
    }
  }
};

const handleStartGame = async () => {
  if (!game.isCustomWordMode) {
    const words = (await import("../assets/data/words.json")).default;
    const randomIndex = Math.floor(Math.random() * words.length);
    game.selectedWordId = randomIndex;
    game.civilianWord = words[randomIndex][0];
    game.undercoverWord = words[randomIndex][1];
  }
  game.isStartGame = true;
  router.push({ name: "game", query: route.query });
};

game.handleStartGame = handleStartGame;
</script>

<style scoped>
:deep(.t-input-number) {
  @apply w-24 h-8;
}

:deep(.t-input-number .t-input-number__decrease),
:deep(.t-input-number .t-input-number__increase) {
  background-color: var(--theme-yellow);
  border-color: var(--bg-black);
  @apply rounded-full border-2 border-solid  shadow-lg;
}

:deep(.t-input-number .t-input-number__decrease.t-is-disabled:hover),
:deep(.t-input-number .t-input-number__increase.t-is-disabled:hover) {
  border-color: var(--bg-black);
}

:deep(.t-input-number::before) {
  content: "";
  width: calc(100% - 32px);
  left: 16px;
  background-color: var(--bg-black);
  @apply absolute  h-full;
}

:deep(.t-input-number .t-input) {
  background-color: var(--bg-black);
  @apply border-none p-0;
}

:deep(.t-input-number .t-input__inner) {
  @apply text-white font-normal text-center text-base;
}

:deep(.t-input-number .t-button:not(.t-is-disabled) .t-icon) {
  color: var(--bg-black);
}
:deep(.t-input-number .t-button .t-icon) {
  @apply text-2xl font-bold;
}

:deep(.t-radio__input) {
  border-color: var(--bg-black) !important;
  @apply border-2 border-solid rounded-full;
}

:deep(.t-radio .t-radio__input) {
  width: 20px;
  height: 20px;
  background-color: #fff;
}

:deep(.t-radio.t-is-checked .t-radio__input) {
  border-color: var(--bg-black) !important;
}

:deep(.t-radio__input::after) {
  background-color: var(--theme-yellow);
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
}

:deep(.t-radio-group .t-radio) {
  @apply mr-4 last:mr-0;
}

:deep(.t-input) {
  background-color: rgb(238, 238, 238);
  @apply w-full border-none px-4 py-6 rounded-lg;
}

:deep(.t-input .t-input__prefix) {
  @apply font-medium text-gray-500;
}

:deep(.t-input .t-input__prefix),
:deep(.t-input .t-input__inner) {
  @apply text-base;
}

:deep(.t-input .t-input__prefix:not(:empty)) {
  @apply mr-4;
}

:deep(.t-input--focused) {
  box-shadow: none;
}
</style>
