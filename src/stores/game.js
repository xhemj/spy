import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      /**
       * 选定词语id
       * @type {number}
       */
      selectedWordId: 0,
      /**
       * 平民词语
       * @type {string}
       */
      civilianWord: "",
      /**
       * 卧底词语
       * @type {string}
       */
      undercoverWord: "",
      /**
       * 总游戏人数
       * @type {number}
       */
      totalPlayerCount: 4,
      /**
       * 卧底人数
       * @type {number}
       */
      undercoverCount: 1,
      /**
       * 是否有白板玩家
       * @type {boolean}
       * @default false
       */
      hasBlankPlayer: false,
      /**
       * 是否已加载词库
       * @type {boolean}
       */
      isLoadedWordList: false,
      /**
       * 是否开始游戏
       * @type {boolean}
       */
      isStartGame: false,
      /**
       * 是否自定义词语模式
       * @type {boolean}
       */
      isCustomWordMode: false,
    };
  },
  actions: {
    /**
     * 重置
     */
    reset() {
      this.civilianWord = "";
      this.undercoverWord = "";
      this.totalPlayerCount = 4;
      this.undercoverCount = 1;
      this.hasBlankPlayer = false;
      this.isLoadedWordList = false;
      this.isStartGame = false;
      this.isCustomWordMode = false;
    },
  },
});
