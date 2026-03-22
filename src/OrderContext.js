import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const OrderContext = createContext(null);

const buildOrderStorageKey = (username) => `orders_${username}`;

const readOrdersByUser = (username) => {
  if (!username) {
    return [];
  }

  try {
    const raw = localStorage.getItem(buildOrderStorageKey(username));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const buildOrderNo = () => `OD${Date.now()}${Math.floor(Math.random() * 1000)}`;

function OrderProvider({ children, currentUsername }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(readOrdersByUser(currentUsername));
  }, [currentUsername]);

  useEffect(() => {
    if (!currentUsername) {
      return;
    }
    localStorage.setItem(buildOrderStorageKey(currentUsername), JSON.stringify(orders));
  }, [orders, currentUsername]);

  const createOrderFromItems = useCallback((items) => {
    if (!currentUsername) {
      window.alert('请先登录');
      return;
    }

    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    const normalizedItems = items.map((item) => ({
      book: item.book,
      quantity: item.quantity,
      unitPrice: item.book.price,
    }));
    const totalPrice = normalizedItems.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
      0
    );

    const newOrder = {
      orderNo: buildOrderNo(),
      status: '待付款',
      items: normalizedItems,
      totalPrice,
      createdAt: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
  }, [currentUsername]);

  const createDirectOrder = useCallback(
    (book, quantity) => {
      if (!currentUsername) {
        window.alert('请先登录');
        return;
      }

      if (!book || quantity <= 0) {
        return;
      }

      createOrderFromItems([{ book, quantity }]);
    },
    [currentUsername, createOrderFromItems]
  );

  const cancelOrder = useCallback((orderNo) => {
    if (!currentUsername) {
      return;
    }
    setOrders((prev) =>
      prev.map((order) => (order.orderNo === orderNo ? { ...order, status: '已取消' } : order))
    );
  }, [currentUsername]);

  const payOrder = useCallback((orderNo) => {
    if (!currentUsername) {
      return;
    }
    setOrders((prev) =>
      prev.map((order) => (order.orderNo === orderNo ? { ...order, status: '已完成' } : order))
    );
  }, [currentUsername]);

  const value = useMemo(
    () => ({
      orders,
      createOrderFromItems,
      createDirectOrder,
      cancelOrder,
      payOrder,
    }),
    [orders, createOrderFromItems, createDirectOrder, cancelOrder, payOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export { OrderProvider, useOrder };
