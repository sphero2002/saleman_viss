import React, { useState, createContext } from 'react';

export const JsonObjectContext = createContext();

export function JsonObjectProvider({ children }) {
    const [jsonObject, setJsonObject] = useState({});

    return (
        <JsonObjectContext.Provider value={{ jsonObject, setJsonObject }}>
            {children}
        </JsonObjectContext.Provider>
    );
};

