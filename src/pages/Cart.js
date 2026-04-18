import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useOrder } from '../OrderContext';
import './Cart.css';
import { formatPrice } from '../utils/price';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, toggleItemSelected, toggleAllSelected, changeQuantity, removeItem, removeSelectedItems } =
    useCart();
  const { createOrderFromItems } = useOrder();

  const enrichedItems = useMemo(() => cartItems.filter((item) => item.book), [cartItems]);

  const selectedCount = enrichedItems.filter((item) => item.selected).length;
  const allSelected = enrichedItems.length > 0 && selectedCount === enrichedItems.length;
  const totalAmount = enrichedItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + Number(item.quantity) * Number(item.book.price), 0);

  const toggleSelectAll = () => {
    toggleAllSelected(!allSelected);
  };

  const handleCheckout = () => {
    const selectedItems = enrichedItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      window.alert('请先勾选需要结算的商品');
      return;
    }

    createOrderFromItems(selectedItems);
    removeSelectedItems();
    navigate('/orders');
  };

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">购物车</h1>
        <p className="cart-subtitle">确认商品信息后可直接结算</p>
      </header>

      <section className="cart-list-section" aria-label="购物车商品列表">
        {enrichedItems.map((item) => (
          <article className="cart-item-row" key={item.id}>
            <section className="cart-col-select">
              <input
                className="cart-checkbox"
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleItemSelected(item.id)}
                aria-label={`选择${item.book.title}`}
              />
            </section>

            <section className="cart-col-book">
              <img className="cart-book-cover" src={item.book.cover} alt={`${item.book.title}封面`} />
              <section className="cart-book-meta">
                <h2 className="cart-book-title">{item.book.title}</h2>
                <p className="cart-book-author">作者：{item.book.author}</p>
              </section>
            </section>

            <section className="cart-col-price">{formatPrice(item.book.price)}</section>

            <section className="cart-col-quantity">
              <button
                className="qty-btn"
                type="button"
                onClick={() => changeQuantity(item.id, -1)}
                aria-label="减少数量"
              >
                -
              </button>
              <output className="qty-value">{item.quantity}</output>
              <button
                className="qty-btn"
                type="button"
                onClick={() => changeQuantity(item.id, 1)}
                aria-label="增加数量"
              >
                +
              </button>
            </section>

            <section className="cart-col-action">
              <button className="delete-btn" type="button" onClick={() => removeItem(item.id)}>
                删除
              </button>
            </section>
          </article>
        ))}
      </section>

      <footer className="cart-checkout-bar">
        <section className="checkout-left">
          <input
            className="cart-checkbox"
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            aria-label="全选商品"
          />
          <span className="checkout-select-all-text">全选</span>
        </section>

        <section className="checkout-right">
          <p className="checkout-total-text">
            总计：<span className="checkout-total-price">{formatPrice(totalAmount)}</span>
          </p>
          <button className="checkout-btn" type="button" onClick={handleCheckout}>
            结算
          </button>
        </section>
      </footer>

      <footer className="cart-back-footer">
        <Link className="cart-back-link" to="/home">
          返回首页
        </Link>
      </footer>
    </main>
  );
}

export default Cart;
