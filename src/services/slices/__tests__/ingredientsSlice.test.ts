import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Флюоресцентная булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 500,
      image: 'https://example.com/image.png',
      image_mobile: 'https://example.com/mobile.png',
      image_large: 'https://example.com/large.png'
    }
  ];

  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  describe('fetchIngredients.pending', () => {
    it('должен устанавливать isLoading в true и очищать error', () => {
      const state = ingredientsReducer(initialState, fetchIngredients.pending('request-id', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен сохранять ингредиенты и устанавливать isLoading в false', () => {
      const state = ingredientsReducer(
        initialState, 
        fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен сохранять ошибку и устанавливать isLoading в false', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.rejected(new Error('Network error'), 'request-id', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('должен использовать дефолтное сообщение "Rejected" при null ошибке (стандарт RTK)', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.rejected(null, 'request-id', undefined)
      );
      // Redux Toolkit по умолчанию ставит сообщение 'Rejected', если error is null
      expect(state.error).toBe('Rejected'); 
    });
  });
});