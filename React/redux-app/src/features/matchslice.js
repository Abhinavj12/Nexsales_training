// for crating  slice we need to import createSlice from redux toolkit
import { createSlice } from "@reduxjs/toolkit";
const matchSlice = createSlice(
  {
    name:"match",
    initialState:{ 
    runs: 0,
    wickets: 0,
    overs: 0.0
  },
  //reducers are the functions which will update the state,there can be many reducers in a slice
  reducers:{
      addRuns:(state)=>{
        state.runs+=1
      }
  }
}
);
export const {addRuns}=matchSlice.actions;
export default matchSlice.reducer;