import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const buildCartStorageKey = (username) => `cart_${username}`;

const readCartItemsByUser = (username) => {
  if (!username) {
    return [];
  }

  try {
    const raw = localStorage.getItem(buildCartStorageKey(username));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

function CartProvider({ children, currentUsername }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(readCartItemsByUser(currentUsername));
  }, [currentUsername]);

  useEffect(() => {
    if (!currentUsername) {
      return;
    }
    localStorage.setItem(buildCartStorageKey(currentUsername), JSON.stringify(cartItems));
  }, [cartItems, currentUsername]);

  const addToCart = useCallback((book, quantity) => {
    if (!currentUsername) {
      window.alert('请先登录');
      return;
    }

    if (!book || quantity <= 0) {
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.book.id === book.id);
      if (existingItem) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${book.id}`,
          quantity,
          selected: true,
          book,
        },
      ];
    });
  }, [currentUsername]);

  const toggleItemSelected = useCallback((id) => {
    if (!currentUsername) {
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  }, [currentUsername]);

  const toggleAllSelected = useCallback((nextSelected) => {
    if (!currentUsername) {
      return;
    }
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: nextSelected })));
  }, [currentUsername]);

  const changeQuantity = useCallback((id, delta) => {
    if (!currentUsername) {
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const maxStock = item.book?.stock ?? Infinity;
        const nextQuantity = Math.max(1, Math.min(maxStock, item.quantity + delta));
        return { ...item, quantity: nextQuantity };
      })
    );
  }, [currentUsername]);

  const removeItem = useCallback((id) => {
    if (!currentUsername) {
      return;
    }
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, [currentUsername]);

  const removeSelectedItems = useCallback(() => {
    if (!currentUsername) {
      return;
    }
    setCartItems((prev) => prev.filter((item) => !item.selected));
  }, [currentUsername]);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      toggleItemSelected,
      toggleAllSelected,
      changeQuantity,
      removeItem,
      removeSelectedItems,
    }),
    [
      cartItems,
      addToCart,
      toggleItemSelected,
      toggleAllSelected,
      changeQuantity,
      removeItem,
      removeSelectedItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
