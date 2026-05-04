import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid-mock'
}));

describe('constructorSlice', () => {
  const mockIngredient: TIngredient = {
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
  };

  const mockIngredientSauce: TIngredient = {
    ...mockIngredient,
    _id: '643d69a5c3f7b9001cfa093d',
    type: 'sauce',
    name: 'Соус спайси'
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('addIngredient', () => {
    it('должен добавлять булку в поле bun', () => {
      const state = constructorReducer(initialState, addIngredient(mockIngredient));
      
      expect(state.bun).toBeDefined();
      expect(state.bun?.name).toBe(mockIngredient.name);
      expect(state.bun?._id).toBe(mockIngredient._id);
      expect(state.bun?.id).toBe('test-uuid-mock'); // Проверяем сгенерированный id
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавлять начинку в массив ingredients', () => {
      const state = constructorReducer(initialState, addIngredient(mockIngredientSauce));
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(mockIngredientSauce.name);
      expect(state.ingredients[0]._id).toBe(mockIngredientSauce._id);
      expect(state.ingredients[0].id).toBe('test-uuid-mock');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [
          { ...mockIngredientSauce, id: 'test-id-2' } as TConstructorIngredient, 
          { ...mockIngredientSauce, id: 'test-id-3' } as TConstructorIngredient
        ]
      };
      const state = constructorReducer(stateWithItems, removeIngredient('test-id-3'));
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('test-id-2');
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент вверх', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [
          { ...mockIngredientSauce, id: 'id-1' } as TConstructorIngredient,
          { ...mockIngredientSauce, id: 'id-2' } as TConstructorIngredient,
          { ...mockIngredientSauce, id: 'id-3' } as TConstructorIngredient
        ]
      };
      const state = constructorReducer(stateWithItems, moveIngredient({ index: 2, direction: 'up' }));
      
      expect(state.ingredients[1].id).toBe('id-3');
      expect(state.ingredients[2].id).toBe('id-2');
    });

    it('должен перемещать ингредиент вниз', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [
          { ...mockIngredientSauce, id: 'id-1' } as TConstructorIngredient,
          { ...mockIngredientSauce, id: 'id-2' } as TConstructorIngredient,
          { ...mockIngredientSauce, id: 'id-3' } as TConstructorIngredient
        ]
      };
      const state = constructorReducer(stateWithItems, moveIngredient({ index: 0, direction: 'down' }));
      
      expect(state.ingredients[0].id).toBe('id-2');
      expect(state.ingredients[1].id).toBe('id-1');
    });

    it('не должен перемещать вверх, если индекс 0', () => {
      const stateWithItems = {
        bun: null,
        ingredients: [{ ...mockIngredientSauce, id: 'id-1' } as TConstructorIngredient]
      };
      const state = constructorReducer(stateWithItems, moveIngredient({ index: 0, direction: 'up' }));
      
      expect(state.ingredients[0].id).toBe('id-1');
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      const stateWithItems = {
        bun: { ...mockIngredient, id: 'test-bun-id' } as TConstructorIngredient,
        ingredients: [{ ...mockIngredientSauce, id: 'test-sauce-id' } as TConstructorIngredient]
      };
      const state = constructorReducer(stateWithItems, clearConstructor());
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});