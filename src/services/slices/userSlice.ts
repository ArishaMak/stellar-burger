import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginUserError: string | null;
  registerUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginUserError: null,
  registerUserError: null
};

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk('user/register', registerUserApi);
export const loginUser = createAsyncThunk('user/login', loginUserApi);
export const logoutUser = createAsyncThunk('user/logout', logoutApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.loginUserError = null;
      state.registerUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('LOGIN SUCCESS - Payload:', action.payload);
        console.log('accessToken:', action.payload.accessToken);
        console.log('refreshToken:', action.payload.refreshToken);

        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserError = null;

        // Сохраняем токены
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);

        console.log('Cookie после setCookie:', document.cookie);
        console.log(
          'LocalStorage после setItem:',
          localStorage.getItem('refreshToken')
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('LOGIN FAILED:', action.error);
        state.loginUserError = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('REGISTER SUCCESS - Payload:', action.payload);

        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.registerUserError = null;

        // Сохраняем токены
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);

        // Проверяем
        console.log('Cookie после регистрации:', document.cookie);
        console.log(
          'LocalStorage после регистрации:',
          localStorage.getItem('refreshToken')
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error('REGISTER FAILED:', action.error);
        state.registerUserError = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log('LOGOUT');
        state.user = null;
        state.isAuthenticated = false;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserError = action.error.message || 'Ошибка обновления';
      });
  }
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
