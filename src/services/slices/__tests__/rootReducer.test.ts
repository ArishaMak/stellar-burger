import { rootReducer } from '../../store';
import { RootState } from '../../store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при undefined state и неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        orderRequest: false,
        orderModalData: null,
        orderByNumber: null,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthenticated: false,
        isAuthChecked: false,
        loginUserError: null,
        registerUserError: null
      }
    } as unknown as RootState);
  });
});