import { configureStore } from "@reduxjs/toolkit";
import baseAPI from "../api/baseAPI";
import authReducer from "../features/auth/authSlice";

import chatApi from "../features/voice-library/voiceLibraryAPI";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    auth: authReducer,

    // user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    })
      .concat(baseAPI.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
