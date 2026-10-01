import React, { useContext } from 'react';
import { ThemeDataContext } from './ThemeContext';

const Child = (props) => {

    const [theme, setTheme] = useContext(ThemeDataContext);

    return (
        <div>
            <h2>Child: {theme}</h2>

            <button onClick={() => setTheme('light')}>
                Light
            </button>

            <button onClick={() => setTheme('dark')}>
                Dark
            </button>
        </div>
    )
}

export default Child;