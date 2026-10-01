import { configureStore } from '@reduxjs/toolkit';
import matchReducer from '../features/matchslice';
import playerReducer from '../features/playerslice';


export const store=configureStore({
  reducer: {
    match:matchReducer,
    player:playerReducer

  }
});