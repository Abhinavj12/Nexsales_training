import React, { createContext, useState } from 'react'

// Creating
 export const ThemeDataContext=createContext()

const ThemeContext = (props) => {

    //what to share
    const [theme,setTheme]=useState('dark');
   
  return (
    <div>
        {/* //providing */}
        <ThemeDataContext.Provider value={[theme,setTheme]}>
            {props.children}

        </ThemeDataContext.Provider>


    </div>
  )
}

export default ThemeContext;