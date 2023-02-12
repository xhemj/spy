import axios from "axios";
import { lyricParser, LyricParser } from "../utils/lyrics";

const $fetch = axios.create({
  baseURL: "https://music-api.xhemj.work",
  timeout: 5000,
});

export default {
  /**
   * 检查登录状态
   */
  getLoginStatus: async (
    cookie?: string | null
  ): Promise<{ isLogin: boolean; data: any }> => {
    const { data: loginData } = await $fetch.post(
      `/login/status?timerstamp=${Date.now()}`,
      {
        cookie,
      }
    );
    const isLogin = loginData.data.profile !== null;
    return {
      isLogin,
      data: loginData.data,
    };
  },
  /**
   * 获取登录二维码
   */
  getLoginQRCode: async (): Promise<{
    qrKey: string;
    qrImg: string;
    qrUrl: string;
  }> => {
    const { data: keyData } = await $fetch.get(
      `/login/qr/key?timerstamp=${Date.now()}`
    );
    const qrKey = keyData.data.unikey;
    const { data: qrData } = await $fetch.get(
      `/login/qr/create?key=${qrKey}&qrimg=true&timerstamp=${Date.now()}`
    );
    const qrImg = qrData.data.qrimg;
    const qrUrl = qrData.data.qrurl;
    return {
      qrKey,
      qrImg,
      qrUrl,
    };
  },
  /**
   * 检查二维码扫码状态
   * @param {string} qrKey
   */
  checkQRLoginStatus: async (
    qrKey: string
  ): Promise<{
    data: any;
    isExpired: boolean;
    isWaiting: boolean;
    isScanned: boolean;
    isSuccess: boolean;
  }> => {
    if (!qrKey) {
      throw new Error("qrKey is required");
    }
    const { data } = await $fetch.get(
      `/login/qr/check?key=${qrKey}&timerstamp=${Date.now()}`
    );
    const EXPIRED = 800;
    const WAITING = 801;
    const SCANNED = 802;
    const SUCCESS = 803;

    const isExpired = data.code === EXPIRED;
    const isWaiting = data.code === WAITING;
    const isScanned = data.code === SCANNED;
    const isSuccess = data.code === SUCCESS;
    return {
      data,
      isExpired,
      isWaiting,
      isScanned,
      isSuccess,
    };
  },
  /**
   * 根据 id 获取歌曲播放地址
   * @param {string} id 歌曲 id
   * @param {string} quality 音质
   * @param {string} cookie 登录 cookie
   */
  getPlayUrl: async (
    id: string,
    quality: string,
    cookie?: string | null
  ): Promise<string> => {
    if (!id) {
      throw new Error("id is required");
    }
    const { data } = await $fetch.post(
      `/song/url/v1?id=${id}&level=${quality}&timerstamp=${Date.now()}`,
      {
        cookie,
      }
    );
    const url = data.data[0].url;
    return String(url).replace("http://", "https://");
  },
  /**
   * 获取歌曲详情
   */
  getSongDetail: async (id: string): Promise<any> => {
    if (!id) {
      throw new Error("id is required");
    }
    const { data } = await $fetch.get(
      `/song/detail?ids=${id}&timerstamp=${Date.now()}`
    );
    return data.songs[0];
  },
  /**
   * 获取歌词
   */
  getLyric: async (id: string): Promise<LyricParser> => {
    if (!id) {
      throw new Error("id is required");
    }
    const { data } = await $fetch.get(
      `/lyric?id=${id}&timerstamp=${Date.now()}`
    );
    return lyricParser(data);
  },
  /**
   * 搜索歌曲
   */
  search: async (keyword: string): Promise<String[]> => {
    if (!keyword) {
      throw new Error("keyword is required");
    }
    const { data } = await $fetch.get(
      `/cloudsearch?keywords=${keyword}&timerstamp=${Date.now()}`
    );
    return data.result.songs;
  },
  /**
   * 听歌打卡
   */
  scrobble: async (opt: {
    id: number;
    sourceid: number;
    time: number;
    cookie: string;
  }) => {
    const { data } = await $fetch.post(`/scrobble`, opt);
    return data;
  },
};
