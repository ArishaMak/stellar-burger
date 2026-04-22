import { forwardRef, useMemo, Ref } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '@ui';
import { useSelector } from '../../services/store';

function IngredientsCategoryInner(
  { title, titleRef, ingredients }: TIngredientsCategoryProps,
  ref: Ref<HTMLUListElement>
) {
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    constructorIngredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
}

export const IngredientsCategory = forwardRef(IngredientsCategoryInner);
