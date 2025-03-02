import React, { createContext, useContext, ReactNode } from 'react';
import * as LucideIcons from 'lucide-react-native';

// Create a context for icons
const IconContext = createContext<Record<string, any>>({});

// Icon provider component
export function IconProvider({ children }: { children: ReactNode }) {
  return (
    <IconContext.Provider value={LucideIcons}>
      {children}
    </IconContext.Provider>
  );
}

// Hook to use icons
export function useIcon(iconName: string) {
  const icons = useContext(IconContext);
  
  if (!icons[iconName]) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }
  
  return icons[iconName];
}

// Optimized icon component
export function Icon({ 
  name, 
  size = 24, 
  color = '#000', 
  ...props 
}: { 
  name: string; 
  size?: number; 
  color?: string; 
  [key: string]: any 
}) {
  const icons = useContext(IconContext);
  const IconComponent = icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent size={size} color={color} {...props} />;
}