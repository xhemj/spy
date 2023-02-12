<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" :duration="300">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "./stores/game";
import face from "./assets/data/face.json";

const router = useRouter();
const game = useGameStore();
const transitionName = ref("slide-right");

router.beforeEach((to, from) => {
  const fromLevel = from.meta.level || 0;
  const toLevel = to.meta.level || 1;
  if (fromLevel > toLevel) {
    transitionName.value = "slide-right";
  } else {
    transitionName.value = "slide-left";
  }
});

onMounted(() => {
  game.reset();
  // 预请求 face 中的图片
  face.forEach((item) => {
    const img = new Image();
    img.src = item;
  });
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute !important;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  overflow: hidden;
}

.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.3s;
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.5s;
}

.slide-left-enter-from {
  opacity: 1;
  transform: translateX(100%);
}

.slide-right-enter-from {
  opacity: 1;
  transform: translateX(-100%);
}

.slide-left-leave-to {
  opacity: 0.7;
  transform: translateX(-50%);
}

.slide-right-leave-to {
  opacity: 0.7;
  transform: translateX(50%);
}

/* .slide-left-leave-to,
.slide-right-leave-to {
  opacity: 0.3;
} */
</style>