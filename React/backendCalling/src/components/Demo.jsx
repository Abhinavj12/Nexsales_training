import React, { useEffect, useState } from 'react'

const Demo = () => {

    const [a,setA]=useState(0);
    const [b,setB]=useState(0);
    const changeA=()=>{
        setA(a+1);
    }
    const changeB=()=>{
        setB(b+10);
    }

    useEffect(function(){
        console.log("use effect called")
    },[a,b]);

  return (
    <div>
        <button onClick={changeA}> A</button>
        <button onClick={changeB}> B</button>
    </div>
  )
}

export default Demo