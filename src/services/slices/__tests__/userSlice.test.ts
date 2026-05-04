import userReducer, { getUser } from '../userSlice';

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isAuthChecked: false,
    loginUserError: null,
    registerUserError: null
  };

  describe('getUser.pending', () => {
    it('не меняет isLoading, но это асинхронный экшен', () => {
      // userSlice не имеет поля isLoading, проверяем базовую логику
      const state = userReducer(initialState, getUser.pending('request-id'));
      expect(state).toEqual(initialState);
    });
  });

  describe('getUser.fulfilled', () => {
    it('должен устанавливать пользователя и isAuthenticated', () => {
      const mockUser = { email: 'test@test.ru', name: 'Test' };
      const state = userReducer(initialState, getUser.fulfilled(mockUser, 'request-id'));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('getUser.rejected', () => {
    it('должен устанавливать isAuthChecked в true', () => {
      const state = userReducer(initialState, getUser.rejected(new Error('Auth error'), 'request-id'));
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });
});