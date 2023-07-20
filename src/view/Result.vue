<template>
  <div class="Main">
    <div class="py-6 px-4">
      <img class="w-full h-auto" :src="bannerImg" />
    </div>
    <ResultCard>
      <template #role>
        <span>卧底</span>
      </template>
      <template #word>
        <span class="text-red-500 font-bold">
          {{ spyWord }}
        </span>
      </template>
      <template #default>
        <div
          class="w-1/4 mb-2"
          v-for="(item, index) of spyPlayerList"
          :key="`${index}-${item.word}`"
        >
          <img
            :key="`${index}-${item.word}`"
            class="mx-auto rounded-full mb-1 h-10 w-10"
            :src="item.face"
          />
          <div class="text-base mt-0 text-center">
            {{ item.id + 1 + "号" }}
          </div>
        </div>
      </template>
    </ResultCard>
    <ResultCard>
      <template #role>
        <span>平民</span>
      </template>
      <template #word>
        <span class="text-blue-500 font-bold">
          {{ civilianWord }}
        </span>
      </template>
      <template #default>
        <div
          class="w-1/4 mb-2"
          v-for="(item, index) of civilianPlayerList"
          :key="`${index}-${item.word}`"
        >
          <img
            :key="`${index}-${item.word}`"
            class="mx-auto rounded-full mb-1 h-10 w-10"
            :src="item.face"
          />
          <div class="text-base mt-0 text-center">
            {{ item.id + 1 + "号" }}
          </div>
        </div>
      </template>
    </ResultCard>
    <div class="w-full mt-8 text-center space-y-2">
      <span
        class="game-btn mx-auto"
        @click="
          () => {
            game.reset();
            game.handleStartGame();
          }
        "
      >
        再来一局
      </span>
      <span
        class="game-btn mx-auto btn-theme-blue"
        @click="
          () => {
            router.push({
              name: 'home',
            });
          }
        "
      >
        返回首页
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import ResultCard from "../components/ResultCard.vue";
import { useGameStore } from "../stores/game";

const game = useGameStore();
const router = useRouter();

const SPY_WIN_IMG = "https://staticoss.xhemj.work/spy.xhemj.com/spy-win.png";
const CIVILIAN_WIN_IMG =
  "https://staticoss.xhemj.work/spy.xhemj.com/civilian-win.png";

const spyWord = ref("");
const civilianWord = ref("");

const spyPlayerList: Ref<any> = ref([]);
const civilianPlayerList: Ref<any> = ref([]);

const bannerImg = computed(() => {
  if (game.result.win === "civilian") {
    return CIVILIAN_WIN_IMG;
  } else {
    return SPY_WIN_IMG;
  }
});

const init = () => {
  for (let item of game.result.gameWords) {
    if (item.isSpy) {
      spyWord.value = item.word;
      spyPlayerList.value.push(item);
    } else {
      civilianWord.value = item.word;
      civilianPlayerList.value.push(item);
    }
  }
};

onMounted(() => {
  if (game.result.gameWords.length === 0) {
    router.push({ name: "setting" });
  }
  init();
});
</script>

<style scoped></style>
