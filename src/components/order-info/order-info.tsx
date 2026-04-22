import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const { orderModalData, orderRequest } = useSelector((state) => state.order);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) dispatch(fetchOrderByNumber(Number(number)));
    if (!ingredients.length) dispatch(fetchIngredients());
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderModalData || !ingredients.length) return null;

    const date = new Date(orderModalData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderModalData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return { ...orderModalData, ingredientsInfo, date, total };
  }, [orderModalData, ingredients]);

  if (orderRequest || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
