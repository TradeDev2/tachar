import { configureStore } from "@reduxjs/toolkit"
import mainReducer from "./reducers/reducers"
import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, mainReducer)

export const store = configureStore({
  reducer: {
    main: persistedReducer
  },
  middleware: [thunk]
})

export const persistor = persistStore(store)