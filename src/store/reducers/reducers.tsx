import { createSlice } from '@reduxjs/toolkit';
import { IState } from './IReducers';

export const mainReducer:any = createSlice({
    name: 'main',
    initialState: {
        login: {
            id: 0,
            token: "",
            name: ""
        }
    },
    reducers: {
        setLogin: (state, action) => {
            state.login.token = action.payload.token;
            state.login.name = action.payload.name;
            state.login.id = action.payload.id;
        },
        setLogout: (state) => {
            state.login.token = "";
            state.login.name = "";
            state.login.id = 0;
        }
    }
})

export const { setLogin, setLogout } = mainReducer.actions;

export const selectLogin = (state: IState) => state.main.login;

export default mainReducer.reducer;