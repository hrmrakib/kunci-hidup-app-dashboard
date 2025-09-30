import { configureStore } from "@reduxjs/toolkit";
import baseAPI from "../api/baseAPI";
// import userReducer from "../features/auth/userSlice";
// import authReducer from "../features/auth/authTokenSlice";

import chatApi from "../features/ai/aiChatAPI";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [chatApi.reducerPath]: chatApi.reducer,

    // user: persistedUserReducer,
    // auth: persistedAuthReducer,
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
