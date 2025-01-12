import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = {
        isDarkMode,
        toggleTheme: () => setIsDarkMode(prev => !prev),
        colors: {
            background: isDarkMode ? '#121212' : '#F0F0F0',
            surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            text: isDarkMode ? '#FFFFFF' : '#000000',
            primary: '#D9112A',
            secondary: isDarkMode ? '#B0B0B0' : '#767577',
            divider: isDarkMode ? '#2D2D2D' : '#e0e0e0'
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);