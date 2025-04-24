import React, { useReducer } from 'react';

// 리듀서 함수 정의
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CART':
      return {
        productsInCart: [...state.productsInCart, action.product],
        totalQuantity: (state.totalQuantity += action.product.quantity),
      };

    case 'CLEAR_CART':
      break;
  }
};

// 새로운 Context 생성
const CartContext = React.createContext({
  productsInCart: [],
  totalQuantity: 0,
  addCart: () => {},
  clearCart: () => {},
});

export const CartContextProvider = (props) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    productsInCart: [],
    totalQuantity: 0,
  });

  const addCart = (product) => {
    dispatch({
      type: 'ADD_CART',
      product,
    });
    console.log('장바구니: ', cartState);
  };

  return (
    <CartContext.Provider
      value={{
        productsInCart: cartState.productsInCart,
        totalQuantity: cartState.totalQuantity,
        addCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;
