import { createSlice } from "@reduxjs/toolkit";
import { addRuns } from "./matchslice";

const playerSlice=createSlice(
  {
  name:"player",
  initialState:{
    playerName:"Rohit",
    playerRuns:0
  },
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(addRuns,(state)=>{
      state.playerRuns+=1
  })
}
 }
);
export default playerSlice.reducer;