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
    <div class="absolute bottom-2 left-0 right-0">
      <div class="w-full text-center text-xs text-white">
        <p>
          <span>谁是卧底网页版 </span>
          <span class="border-b border-dashed border-white">{{
            new Date(now).toLocaleDateString()
          }}</span>
          <span> - </span>
          <span class="border-b border-dashed border-white">{{
            commitSha
          }}</span>
        </p>
        <p>
          改编于小米应用商店软件<a
            href="https://app.mi.com/details?id=com.moguplan.main"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white underline"
            >谁是卧底</a
          >，仅供学习交流使用
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import Header from "../components/Header.vue";

const route = useRoute();
// @ts-ignore
const commitSha = __COMMIT_HASH__;
// @ts-ignore
const now = __BUILD_DATE__;
</script>

<style scoped></style>
