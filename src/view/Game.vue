<template>
  <div v-if="game.isStartGame" class="Main">
    <div class="flex flex-row justify-between items-center">
      <h3 class="text-base font-medium text-white">
        {{
          isGameStart ? "游戏开始，长按投票出局" : "一人选择一张牌，不许偷看哦~"
        }}
      </h3>
      <router-link
        :to="{ name: 'setting' }"
        class="game-btn btn-small w-fit text-base"
      >
        重新开始
      </router-link>
    </div>
    <!-- 游戏区 -->
    <div v-if="gameWords.length" class="flex flex-row flex-wrap w-full my-6">
      <div
        v-for="(item, index) in gameWords"
        :key="`${index}-${item.word}`"
        class="game-card w-1/2 p-3 cursor-pointer relative"
        :class="{
          'pointer-events-none game-eliminated': item.isEliminated,
        }"
        @click="
          () => {
            if (!item.isViewed) {
              showCardModal(item, index);
            }
          }
        "
        v-on-long-press="[
          () => {
            if (isGameStart) {
              eliminate(item, index);
            }
          },
          { delay: 500 },
        ]"
      >
        <div
          class="absolute top-3 bottom-3 left-3 right-3 w-auto h-auto flex justify-center items-center"
        >
          <!-- 未查看 -->
          <div
            v-if="!item.isViewed"
            class="absolute text-4xl font-bold text-white w-full text-center"
          >
            <div
              class="stroke-text stroke select-none font-sans w-[1em] mx-auto"
            >
              {{ index + 1 }} 号
            </div>
            <!-- 调试专用 -->
            <div v-if="game.isDebugMode" class="text-lg mt-2">
              {{ item.isSpy ? (item.isBlank ? "白板" : "卧底") : "平民" }}
            </div>
          </div>
          <!-- 已查看 -->
          <div v-else class="absolute text-black w-full text-center">
            <img
              :key="`${index}-${item.word}`"
              class="words-face !h-20 !w-20"
              :src="getRandomFace(index)"
            />
            <div class="text-lg mt-0 text-center">
              {{ index + 1 + "号" }}
            </div>
            <div
              class="game-btn btn-small btn-review mt-1 w-fit mx-auto text-base text-white"
              :class="{
                visible: isGameStart,
                invisible: !isGameStart,
                disabled: item.isViewed && item.isReviewed,
              }"
              @click="showCardModal(item, index)"
            >
              忘词
            </div>
          </div>
        </div>
        <img
          class="w-full h-auto"
          :src="
            item.isViewed
              ? 'https://staticoss.xhemj.work/spy.xhemj.com/card-viewed.png'
              : 'https://staticoss.xhemj.work/spy.xhemj.com/card.png'
          "
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
    <div class="modal flex flex-col justify-center items-center">
      <div class="words-modal modal-box relative">
        <div class="w-full mt-2">
          <img
            :key="`${currentViewId}-${currentViewText}`"
            class="words-face"
            :src="getRandomFace(currentViewId)"
          />
          <div class="text-base mt-0 mb-5 text-center">
            {{ currentViewId + 1 + "号" }}
          </div>
        </div>
        <h2 class="words-title font-bold text-lg mb-2 text-center">
          {{ currentViewId + 1 }}号词语
        </h2>
        <p class="py-4 text-4xl text-center w-full font-bold">
          {{ currentViewText }}
        </p>
      </div>
      <div class="w-full mt-8 text-center">
        <div
          class="game-btn mx-auto"
          @click="
            () => {
              if (gameModalRef) {
                onAfterCloseModal();
                gameModalRef.checked = false;
              }
            }
          "
        >
          我记下了
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { vOnLongPress } from "@vueuse/components";
import { useGameStore } from "../stores/game";
import { randomNumber, GameWord } from "../utils";
import face from "../assets/data/face.json";

const router = useRouter();
const route = useRoute();
const game = useGameStore();

const gameModalRef = ref<HTMLInputElement | null>(null);
const gameModalId = "game-modal";

const gameWords: Ref<GameWord[]> = ref([]);
const spyIndexList: Ref<number[]> = ref([]);
const unViewedWords: Ref<number[]> = ref([]);
const unEliminatedSpyIndexList: Ref<number[]> = ref([]);
const unEliminatedCivilianIndexList: Ref<number[]> = ref([]);

const currentViewId = ref(0);
const currentViewText = ref("");

let onAfterCloseModal: any = () => {};

const isGameStart = computed(() => {
  return gameWords.value.length > 0 && unViewedWords.value.length === 0;
});

const showCardModal = (item: GameWord, index) => {
  if (item.isViewed && item.isReviewed) return;
  if (item.isEliminated) return;
  currentViewId.value = index;
  currentViewText.value = item.word;
  if (gameModalRef.value) {
    gameModalRef.value.checked = true;
    // 卡片关闭后 isViewed 状态改变
    onAfterCloseModal = () => {
      unViewedWords.value = unViewedWords.value.filter((i) => i !== index);
      if (gameWords.value[index].isViewed) {
        gameWords.value[index].isReviewed = true;
      } else {
        gameWords.value[index].isViewed = true;
      }
    };
  }
};

// 淘汰
const eliminate = (item: GameWord, index: number) => {
  if (item.isSpy) {
    unEliminatedSpyIndexList.value = unEliminatedSpyIndexList.value.filter(
      (i) => i !== index
    );
  } else {
    unEliminatedCivilianIndexList.value =
      unEliminatedCivilianIndexList.value.filter((i) => i !== index);
  }
  item.isEliminated = true;
  if (
    unEliminatedCivilianIndexList.value.length === 0 ||
    unEliminatedSpyIndexList.value.length === 0
  ) {
    if (unEliminatedSpyIndexList.value.length === 0) {
      // 平民胜利
      game.result.win = "civilian";
    } else if (unEliminatedCivilianIndexList.value.length === 0) {
      // 卧底胜利
      game.result.win = "spy";
    }
    game.result.gameWords = gameWords.value.map((item, index) => {
      return {
        ...item,
        face: getRandomFace(index),
        id: index,
      };
    });
    router.push({ name: "result" });
  }
};

const randomFaceOffset = randomNumber(face.length);
const getRandomFace = (id: number) => {
  // 随机偏移，防止每次都是同一个人的头像
  const n = (id + randomFaceOffset) % face.length;
  return face[n];
};

const init = () => {
  while (spyIndexList.value.length < game.undercoverCount) {
    const randomIndex = randomNumber(game.totalPlayerCount);
    if (!spyIndexList.value.includes(randomIndex)) {
      spyIndexList.value.push(randomIndex);
      unEliminatedSpyIndexList.value.push(randomIndex);
    }
  }
  const blankRandomIndex = randomNumber(game.undercoverCount);

  for (let i = 0; i < game.totalPlayerCount; i++) {
    unViewedWords.value.push(i);
    const isSpy = spyIndexList.value.includes(i);
    const isBlank =
      game.hasBlankPlayer && i === spyIndexList.value[blankRandomIndex];
    const word = isSpy ? game.undercoverWord : game.civilianWord;
    gameWords.value.push({
      word: isBlank ? "" : word,
      isSpy,
      isBlank,
      isViewed: false,
      isReviewed: false,
      isEliminated: false,
    });
    if (!isSpy) {
      unEliminatedCivilianIndexList.value.push(i);
    }
  }
  // console.log("卧底", [...spyIndexList.value]);
  // console.log(
  //   "白板",
  //   game.hasBlankPlayer ? [spyIndexList.value[blankRandomIndex]] : null
  // );
};

onMounted(() => {
  if (!game.isStartGame) {
    router.push({ name: "setting", query: route.query });
  }
  init();
});
</script>

<style scoped>
.game-btn.btn-small {
  @apply text-sm px-3 py-1;
}

.game-btn.btn-review {
  background-color: var(--theme-blue);
  @apply px-6;
}

.stroke-text {
  --font-color: rgb(238, 223, 255);
  --stroke-color: rgb(102, 57, 220);
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

.game-card::after {
  content: "";
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);
  background-image: url("https://staticoss.xhemj.work/spy.xhemj.com/card-eliminated.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0;
  z-index: 10;
  @apply transition-opacity duration-150 pointer-events-none;
}

.game-card.game-eliminated::after {
  opacity: 1;
}
</style>
