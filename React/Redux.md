**Redux**



**C1->C2->C3 ..heircahy passing (Parents to child)**

**to overcome we use Context APi**



Global State manangemnet is also done by redux

&#x20;IF state is change is frequentty then will b e using redux

&#x20;If state is not change Frequent then ContextApi 



UI level Changes->Context Api

Session cHange->Redux



Take eg

cricbuzz

suppose react me bana hota 

kisi ne 1 run score kiya,differrnts stats will change..player record change,team score change,partnerhsip change etc



Redus is 2 way

Redux toolkit(advance)

red lib



State->Reducer ->like fumction jo change karega

1 reducer have can different actions

this actions will take on state

ye akun batyga ..event batyga ui ke andar





Which Action=>Reducer

\----------------------

New Concept -> Slice(Realted to UI) ->Jaha changes reflect hoga



Match score

player score



Store jaha pe data rakhnefg



Step 1: create Store

Pure Applicaton ko store provide karna 



&#x09;In Main.jsx

&#x09;<Provider store={store}>  

&#x20;    		<App />

&#x20;	</Provider>



now we have to create multiple slices

src/features



1.matchslice.js	

|// for crating  slice we need to import createSlice from redux toolkit<br />import { createSlice } from "@reduxjs/toolkit";<br />const matchSlice = createSlice(<br />  {<br />    name:"match",<br />    initialState:{ <br />    runs: 0,<br />    wickets: 0,<br />    overs: 0.0<br />  },<br />  //reducers are the functions which will update the state,there can be many reducers in a slice<br />  reducers:{<br />      addRuns:(state)=>{<br />        state.runs+=1<br />      }<br />  }<br />}<br />);<br />export const {addRuns}=matchSlice.actions;<br />export default matchSlice.reducer;|
|-|



2.playerslice.js

|import { createSlice } from "@reduxjs/toolkit";<br />import { addRuns } from "./matchslice";<br /><br />const playerSlice=createSlice(<br />  {<br />  name:"player",<br />  initialState:{<br />    playerName:"Rohit",<br />    playerRuns:0<br />  },<br />  reducers:{},<br />  extraReducers:(builder)=>{<br />    builder.addCase(addRuns,(state)=>{<br />      state.playerRuns+=1<br />  })<br />}<br /> }<br />);|
|-|









slices are something reprsting values of different compontss



Now we will make UI



src/components/ScoreBoard.jsx

|import React from 'react'<br />import { useDispatch, useSelector } from 'react-redux'<br />import { addRuns } from '../features/matchslice'<br /><br />const ScoreBoard = () => {<br />    const dispatch = useDispatch()<br />    const {runs,wickets,overs}=useSelector((state)=>state.match)<br />    const {playerName,playerRuns}=useSelector((state)=>state.player)<br /><br />  return (<br />    <div>ScoreBoard<br />        <p><br />            <button onClick={() => dispatch(addRuns())}>+1</button><br />        </p><br />        <p><br />            Match Score  :      Total Score:{runs}<br />                                Wickets:{wickets}<br />                                Overs :{overs}<br />        </p><br />        <p><br />            Player Scpre  :  Player Name:{playerName}<br />                            Player runs:{playerRuns}<br />        </p><br />    </div><br />  )<br />}<br /><br />export default ScoreBoard|
|-|













