import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "@/app/redux/features/user/userApi";
import { newsApi } from "@/app/redux/features/news/newsApi";
import { videoApi } from "@/app/redux/features/youtubeVideo/videoApi";
import { adsApi } from "../redux/features/ads/adsApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [newsApi.reducerPath]: newsApi.reducer,
      [videoApi.reducerPath]: videoApi.reducer,
      [adsApi.reducerPath]: adsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(newsApi.middleware)
        .concat(videoApi.middleware)
        .concat(adsApi.middleware),
  });

  setupListeners(store.dispatch);
  return store;
};
