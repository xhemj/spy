<template>
  <div class="Main">
    <Header class="absolute top-0 left-0 right-0 w-full px-4 py-8" />
    <div class="absolute top-0 left-0 right-0 w-full">
      <div class="flex justify-center items-center min-h-[70vh]">
        <img
          class="w-full h-auto max-w-[500px] mx-auto"
          src="https://staticoss.xhemj.work/spy.xhemj.com/banner.png"
          alt="谁是卧底"
        />
      </div>
      <div class="w-full mt-8 text-center">
        <router-link
          :to="{ name: 'setting', query: route.query }"
          class="game-btn mx-auto a--click--CreateGame"
        >
          创建游戏
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import Header from "../components/Header.vue";

const route = useRoute();
</script>

<style scoped></style>
