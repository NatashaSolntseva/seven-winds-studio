import { configureStore } from "@reduxjs/toolkit";
import { rowReducer } from "./reducers/row";

export const store = configureStore({
  reducer: {
    row: rowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
