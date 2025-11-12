import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";

// Ignore specific warnings
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'Require cycle:',
  'ReactProgressBarViewManager',
  'The app is running using the Legacy Architecture',
  'SafeAreaView has been deprecated',
  'ProgressBarShadowNode',
]);

// Suppress New Architecture warnings in development
if (__DEV__) {
  const originalConsoleWarn = console.warn;
  console.warn = function (...args) {
    const message = args[0];
    if (typeof message === 'string') {
      // Suppress specific warnings
      if (
        message.includes('ReactProgressBarViewManager') ||
        message.includes('ProgressBarShadowNode') ||
        message.includes('Legacy Architecture') ||
        message.includes('SafeAreaView has been deprecated') ||
        message.includes('ViewPropTypes') ||
        message.includes('Require cycle')
      ) {
        return;
      }
    }
    originalConsoleWarn.apply(console, args);
  };
}

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;