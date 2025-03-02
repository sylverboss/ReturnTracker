import React, { createContext, useContext } from 'react';
import { NavigationContainerRef, useNavigationContainerRef } from '@react-navigation/native';

const NavigationContext = createContext<NavigationContainerRef<any> | null>(null);

export const NavigationProvider: React.FC = ({ children }) => {
    const navigationRef = useNavigationContainerRef();

    return (
        <NavigationContext.Provider value={navigationRef}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigationContext must be used within a NavigationProvider');
    }
    return context;
}; 