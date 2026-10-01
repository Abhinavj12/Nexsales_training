u want to share common component to all componrs





theme dark,light

change

parent->child usually data transfer through pops



props trailing



to avoild  sue context-> global state

anyone can change it,accessc it











import React from 'react'



const Child = (props) => {



&#x20;   props.setTheme('light');

&#x20;   console.log(props.children)

&#x20; return (

&#x20;   <div>Child :{props.theme}</div>

&#x20; )

}



export default Child





import React, { useState } from 'react';

import Child from './Child';



const Parent = () => {



&#x20;   const \[theme,setTheme]=useState("dark");

&#x20; return (

&#x20;   <div>Parent {theme}

&#x20;       <Child theme={theme} setTheme={setTheme}>

&#x20;           <h1> i am h1</h1>

&#x20;           <p1>I am p tag</p1>

&#x20;           </Child>

&#x20;   </div>

&#x20; )

}



export default Parent

\----------------------------------------------------

context api,redusx->sharing global state common

\---------------------------------------------





Step 1 : Create Context

Step 2: Provide Context

Step 3 :Use Context



There CAn be multiple value share

for every value make separate file



for pure appliacation

\-----------------------------------------------



src

│

├── App.jsx

├── Parent.jsx

├── Child.jsx

├── ThemeContext.jsx

├── main.jsx

└── index.css



**ThemeContext.jsx**

|import React, { createContext, useState } from 'react';<br /><br />export const ThemeDataContext = createContext();<br /><br />const ThemeContext = (props) => {<br /><br />    const \[theme, setTheme] = useState('dark');<br /><br />    return (<br />        <ThemeDataContext.Provider value={\[theme, setTheme]}><br />            {props.children}<br />        </ThemeDataContext.Provider><br />    );<br />}<br /><br />export default ThemeContext;|
|-|



**main.jsx**

|import { StrictMode } from 'react'<br />import { createRoot } from 'react-dom/client'<br />import './index.css'<br />import App from './App.jsx'<br />import ThemeContext from './ThemeContext.jsx'<br /><br />createRoot(document.getElementById('root')).render(<br />    <ThemeContext><br />        <App /><br />    </ThemeContext><br />)|
|-|



**App.jsx**

|import React from "react";<br />import Parent from "./Parent";<br /><br />const App = () => {<br />    return (<br />        <div><br />            <Parent /><br />        </div><br />    );<br />};<br /><br />export default App;|
|-|

**Parent.jsx**

|import React, { useContext } from 'react';<br />import Child from './Child';<br />import { ThemeDataContext } from './ThemeContext';<br /><br />const Parent = () => {<br /><br />    const \[theme, setTheme] = useContext(ThemeDataContext);<br /><br />    return (<br />        <div><br />            <h1>Parent: {theme}</h1><br /><br />            <Child /><br />        </div><br />    )<br />}<br /><br />export default Parent;|
|-|



**Child.jsx**



|import React, { useContext } from 'react'<br />import { ThemeDataContext } from './ThemeContext';<br /><br />const Child = () => {<br /><br />    const \[theme, setTheme] = useContext(ThemeDataContext);<br /><br />    return (<br />        <div><br />            <h2>Child: {theme}</h2><br /><br />            <button onClick={() => setTheme('light')}><br />                Light<br />            </button><br /><br />            <button onClick={() => setTheme('dark')}><br />                Dark<br />            </button><br />        </div><br />    )<br />}<br /><br />export default Child;|
|-|



**Avoid over Use**



**When to use**



**70-80 -> Theme COntext me aano**



**1.Theme**

**2. App level**

&#x09;**eg Language**

**3.To store information of login User**



**token->local Storage-> extract user**

**use context** 

**Auth Context**



**Not to Make for every chez**





**To see Best Practices**





**Where i can avoid**

**where i can better**



**-------------------------**



🧠 Remember the 4 main words



For Context API, remember:



CREATE

&#x20;  ↓

createContext()



CREATE DATA

&#x20;  ↓

useState()



PROVIDE

&#x20;  ↓

<ThemeDataContext.Provider value={...}>



ACCESS

&#x20;  ↓

useContext(ThemeDataContext)





Your current file is mainly doing:



CREATE → CREATE DATA → PROVIDE



Then your Parent and Child do:



ACCESS



That's the whole idea.



