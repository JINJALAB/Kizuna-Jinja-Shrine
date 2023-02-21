import { configureStore } from "@reduxjs/toolkit";
import donateReducer from "store/reducers/donate";

export const store = configureStore({
  reducer: {
    donate: donateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
