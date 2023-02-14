/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SplashScreen } from './src/components/splashScreen';

import Routes from './Routes';

const App = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {

      setIsAppReady(true);
  }, []);


  return (
    <SplashScreen isAppReady={isAppReady}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
    </SplashScreen>
  );
};

export default App;

