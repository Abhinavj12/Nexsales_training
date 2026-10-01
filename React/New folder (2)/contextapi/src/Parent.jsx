import React, { useContext } from 'react';
import Child from './Child';
import { ThemeDataContext } from './ThemeContext';

const Parent = () => {

    const [theme, setTheme] = useContext(ThemeDataContext);

    return (
        <div>
            <h1>Parent: {theme}</h1>

            <Child />
        </div>
    )
}

export default Parent;