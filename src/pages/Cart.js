import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Checkbox, InputNumber, message } from 'antd';
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
      message.warning('请先勾选需要结算的商品');
      return;
    }

    createOrderFromItems(selectedItems);
    removeSelectedItems();
    navigate('/orders');
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          onChange={toggleSelectAll}
          aria-label="全选商品"
        />
      ),
      dataIndex: 'selected',
      key: 'selected',
      width: 60,
      render: (selected, record) => (
        <Checkbox
          checked={selected}
          onChange={() => toggleItemSelected(record.id)}
          aria-label={`选择${record.book.title}`}
        />
      ),
    },
    {
      title: '商品信息',
      dataIndex: 'book',
      key: 'book',
      render: (book) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <CartBookCover book={book} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{book.title}</div>
            <div style={{ color: '#888', marginTop: 4 }}>作者：{book.author}</div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'book',
      key: 'price',
      width: 120,
      align: 'right',
      render: (book) => (
        <span style={{ color: '#e74c3c', fontWeight: 600 }}>
          {formatPrice(book.price)}
        </span>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 160,
      align: 'center',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.book.stock}
          value={quantity}
          onChange={(value) => {
            const delta = value - quantity;
            if (delta !== 0) {
              changeQuantity(record.id, delta);
            }
          }}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button type="primary" danger onClick={() => removeItem(record.id)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">购物车</h1>
        <p className="cart-subtitle">确认商品信息后可直接结算</p>
      </header>

      <section className="cart-list-section" aria-label="购物车商品列表">
        <Table
          dataSource={enrichedItems}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered
        />
      </section>

      <footer className="cart-checkout-bar" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <section className="checkout-left">
          <Checkbox
            checked={allSelected}
            onChange={toggleSelectAll}
            aria-label="全选商品"
          />
          <span className="checkout-select-all-text" style={{ marginLeft: 8 }}>全选</span>
        </section>

        <section className="checkout-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <p className="checkout-total-text">
            总计：<span className="checkout-total-price" style={{ color: '#e74c3c', fontWeight: 700, fontSize: 20 }}>
              {formatPrice(totalAmount)}
            </span>
          </p>
          <Button type="primary" size="large" onClick={handleCheckout}>
            结算
          </Button>
        </section>
      </footer>

      <footer className="cart-back-footer" style={{ marginTop: 16 }}>
        <Link className="cart-back-link" to="/home">
          返回首页
        </Link>
      </footer>
    </main>
  );
}

/** 购物车中的书籍封面组件（含图片加载降级） */
function CartBookCover({ book }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        style={{
          width: 80,
          height: 112,
          borderRadius: 4,
          backgroundColor: '#e8ddd0',
          color: '#6b5c4b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 600,
          padding: 6,
          fontFamily: 'inherit',
        }}
      >
        {book.title}
      </div>
    );
  }

  return (
    <img
      className="cart-book-cover"
      src={book.cover}
      alt={`${book.title}封面`}
      style={{ width: 80, height: 112, objectFit: 'cover', borderRadius: 4 }}
      onError={() => setImgError(true)}
    />
  );
}

export default Cart;
