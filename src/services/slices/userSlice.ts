import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';

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
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserError = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserError = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
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
