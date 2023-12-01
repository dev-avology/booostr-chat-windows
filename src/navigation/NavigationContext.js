import React, { createContext, useContext } from 'react';

const NavigationContext = createContext();

export function useNavigation() {
  const navigation = useContext(NavigationContext);
  if (!navigation) {
    throw new Error('NavigationContext not found. Make sure your component is wrapped in a NavigationProvider.');
  }
  return navigation;
}

export function NavigationProvider({ children, navigation }) {
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
}