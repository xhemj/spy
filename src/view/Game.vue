<template>
  <div v-if="game.isStartGame" class="Main">
    <div class="flex flex-row justify-between items-center">
      <h3 class="text-base font-medium text-white">
        一人选择一张牌，不许偷看哦~
      </h3>
      <router-link :to="{ name: 'setting' }" class="game-btn w-fit text-base">
        重新开始
      </router-link>
    </div>
    <!-- 游戏区 -->
    <div v-if="gameWords.length" class="flex flex-row flex-wrap w-full my-6">
      <div
        v-for="(item, index) in gameWords"
        :key="`${index}-${item.word}`"
        class="w-1/2 p-3 cursor-pointer relative"
        :class="{
          'opacity-50': item.isViewed,
        }"
        @click="showCardModal(item, index)"
      >
        <div
          class="absolute top-3 bottom-3 left-3 right-3 w-auto h-auto flex justify-center items-center"
        >
          <div
            class="absolute text-4xl font-bold text-white w-full text-center"
          >
            <div class="stroke font-sans w-[1em] mx-auto">
              {{ index + 1 }} 号
            </div>
            <!-- 调试专用 -->
            <div v-if="game.isDebugMode" class="text-lg mt-2">
              {{ item.isSpy ? (item.isBlank ? "白板" : "卧底") : "平民" }}
            </div>
          </div>
        </div>
        <img
          class="w-full h-auto"
          src="https://staticoss.xhemj.work/spy.xhemj.com/card.png"
        />
      </div>
    </div>
    <!-- 弹出框 -->
    <input
      ref="gameModalRef"
      type="checkbox"
      :id="gameModalId"
      class="modal-toggle"
    />
    <label :for="gameModalId" class="modal cursor-pointer">
      <label class="words-modal modal-box relative" for="">
        <div class="w-full mt-2">
          <img
            :key="cardModalTitle"
            class="words-face"
            :src="getRandomFace()"
          />
          <div class="text-base mt-0 mb-5 text-center">
            {{ cardModalTitle }}
          </div>
        </div>
        <h2 class="words-title font-bold text-lg mb-2 text-center">
          {{ cardModalTitle }}词语
        </h2>
        <p class="py-4 text-4xl text-center w-full font-bold">
          {{ cardModalText }}
        </p>
      </label>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGameStore } from "../stores/game";
import { randomNumber } from "../utils";
import face from "../assets/data/face.json";

const router = useRouter();
const route = useRoute();
const game = useGameStore();

const gameModalRef = ref<HTMLElement | null>(null);
const gameModalId = "game-modal";

interface GameWord {
  word: string;
  isSpy: boolean;
  isBlank: boolean;
  isViewed: boolean;
}
const gameWords: Ref<GameWord[]> = ref([]);
const spyIndexList: Ref<number[]> = ref([]);

const cardModalTitle = ref("");
const cardModalText = ref("");

const showCardModal = (item: GameWord, index) => {
  if (item.isViewed) return;
  cardModalTitle.value = index + 1 + "号";
  cardModalText.value = item.word;
  if (gameModalRef.value) {
    gameModalRef.value.checked = true;
    item.isViewed = true;
  }
};

const getRandomFace = () => {
  const randomIndex = randomNumber(face.length);
  return face[randomIndex];
};

const init = () => {
  while (spyIndexList.value.length < game.undercoverCount) {
    const randomIndex = randomNumber(game.totalPlayerCount);
    if (!spyIndexList.value.includes(randomIndex)) {
      spyIndexList.value.push(randomIndex);
    }
  }
  const blankRandomIndex = randomNumber(game.undercoverCount);

  for (let i = 0; i < game.totalPlayerCount; i++) {
    const isSpy = spyIndexList.value.includes(i);
    const isBlank =
      game.hasBlankPlayer && i === spyIndexList.value[blankRandomIndex];
    const word = isSpy ? game.undercoverWord : game.civilianWord;
    gameWords.value.push({
      word: isBlank ? "" : word,
      isSpy,
      isBlank,
      isViewed: false,
    });
  }
  console.log("卧底", [...spyIndexList.value]);
  console.log(
    "白板",
    game.hasBlankPlayer ? [spyIndexList.value[blankRandomIndex]] : null
  );
};

onMounted(() => {
  if (!game.isStartGame) {
    router.push({ name: "setting", query: route.query });
  }
  init();
});
</script>

<style scoped>
.game-btn {
  @apply text-sm px-3 py-1;
}

.stroke {
  --font-color: rgb(238, 223, 255);
  --stroke-color: rgb(102, 57, 220);
  color: var(--font-color);
  letter-spacing: 0;
  font-weight: 700;
  text-shadow: var(--stroke-color) 4px 0 0,
    var(--stroke-color) 3.87565px 0.989616px 0,
    var(--stroke-color) 3.51033px 1.9177px 0,
    var(--stroke-color) 2.92676px 2.72656px 0,
    var(--stroke-color) 2.16121px 3.36588px 0,
    var(--stroke-color) 1.26129px 3.79594px 0,
    var(--stroke-color) 0.282949px 3.98998px 0,
    var(--stroke-color) -0.712984px 3.93594px 0,
    var(--stroke-color) -1.66459px 3.63719px 0,
    var(--stroke-color) -2.51269px 3.11229px 0,
    var(--stroke-color) -3.20457px 2.39389px 0,
    var(--stroke-color) -3.69721px 1.52664px 0,
    var(--stroke-color) -3.95997px 0.56448px 0,
    var(--stroke-color) -3.97652px -0.432781px 0,
    var(--stroke-color) -3.74583px -1.40313px 0,
    var(--stroke-color) -3.28224px -2.28625px 0,
    var(--stroke-color) -2.61457px -3.02721px 0,
    var(--stroke-color) -1.78435px -3.57996px 0,
    var(--stroke-color) -0.843183px -3.91012px 0,
    var(--stroke-color) 0.150409px -3.99717px 0,
    var(--stroke-color) 1.13465px -3.8357px 0,
    var(--stroke-color) 2.04834px -3.43574px 0,
    var(--stroke-color) 2.83468px -2.82216px 0,
    var(--stroke-color) 3.44477px -2.03312px 0,
    var(--stroke-color) 3.84068px -1.11766px 0,
    var(--stroke-color) 3.9978px -0.132717px 0;
}

.modal {
  --tw-bg-opacity: 0.6;
}

.words-modal {
  height: 24.56rem;
  width: 19.25rem;
  /* background-image: url("https://staticoss.xhemj.work/spy.xhemj.com/modal-bg.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 110%; */
}

.words-title {
  background-image: url("https://staticoss.xhemj.work/spy.xhemj.com/text-bg.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.words-face {
  width: 8rem;
  height: 8rem;
  @apply mx-auto rounded-full mb-1;
}
</style>
