import orderReducer, { createOrder, fetchOrderByNumber, clearOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '12345',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  } as TOrder;

  const initialState = {
    order: null,
    orderRequest: false,
    orderModalData: null,
    orderByNumber: null,
    error: null
  };

  describe('createOrder.pending', () => {
    it('должен устанавливать orderRequest в true', () => {
      const state = orderReducer(initialState, createOrder.pending('request-id', [], ['ing1']));
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('createOrder.fulfilled', () => {
    it('должен сохранять заказ в order и orderModalData', () => {
      const state = orderReducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'request-id', ['ing1'])
      );
      expect(state.orderRequest).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderModalData).toEqual(mockOrder);
    });
  });

  describe('createOrder.rejected', () => {
    it('должен сохранять ошибку', () => {
      const state = orderReducer(
        initialState,
        createOrder.rejected(new Error('Failed'), 'request-id', ['ing1'])
      );
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Failed');
    });
  });

  describe('fetchOrderByNumber.pending', () => {
    it('должен устанавливать orderRequest в true', () => {
      const state = orderReducer(initialState, fetchOrderByNumber.pending('request-id', 12345));
      expect(state.orderRequest).toBe(true);
    });
  });

  describe('fetchOrderByNumber.fulfilled', () => {
    it('должен сохранять заказ в orderByNumber (не в orderModalData)', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.fulfilled(mockOrder, 'request-id', 12345)
      );
      expect(state.orderRequest).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('fetchOrderByNumber.rejected', () => {
    it('должен сохранять ошибку', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.rejected(new Error('Not found'), 'request-id', 12345)
      );
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Not found');
    });
  });

  describe('clearOrder', () => {
    it('должен очищать все поля заказа', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderModalData: mockOrder,
        orderByNumber: mockOrder
      };
      const state = orderReducer(stateWithOrder, clearOrder());
      expect(state.order).toBeNull();
      expect(state.orderModalData).toBeNull();
      expect(state.orderByNumber).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});