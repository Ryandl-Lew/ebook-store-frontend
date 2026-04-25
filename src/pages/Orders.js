import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { useOrder } from '../contexts/OrderContext';
import './Orders.css';
import { formatPrice } from '../utils/price';

/** 订单中的书籍封面组件（含图片加载降级） */
function OrderBookCover({ book }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        style={{
          width: 100,
          height: 132,
          borderRadius: 8,
          backgroundColor: '#e8ddd0',
          color: '#6b5c4b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 600,
          padding: 8,
          fontFamily: 'inherit',
        }}
      >
        {book.title}
      </div>
    );
  }

  return (
    <img
      className="order-book-cover"
      src={book.cover}
      alt={`${book.title}封面`}
      onError={() => setImgError(true)}
    />
  );
}

function Orders() {
  const { orders, cancelOrder, payOrder } = useOrder();

  return (
    <main className="orders-page">
      <header className="orders-header">
        <h1 className="orders-title">我的订单</h1>
        <p className="orders-subtitle">查看订单状态并进行支付或取消操作</p>
      </header>

      <section className="orders-list" aria-label="订单列表">
        {orders.map((order) => {
          const orderItems = Array.isArray(order.items) ? order.items.filter((item) => item?.book) : [];
          if (orderItems.length === 0) {
            return null;
          }
          const totalPrice = Number(
            order.totalPrice ||
              orderItems.reduce((sum, item) => sum + Number(item.unitPrice) * Number(item.quantity), 0)
          );
          const isPending = order.status === '待付款';

          return (
            <article className="order-card" key={order.orderNo}>
              <header className="order-card-header">
                <p className="order-no">订单号：{order.orderNo}</p>
                <Tag color={
                  order.status.includes('取消') ? 'volcano' :
                  order.status.includes('完成') || order.status.includes('成功') ? 'success' :
                  isPending ? 'warning' : 'default'
                }>
                  {order.status}
                </Tag>
              </header>

              <section className="order-items" aria-label="订单商品信息">
                {orderItems.map((item, index) => (
                  <section className="order-item" key={`${order.orderNo}-${item.book.id}-${index}`}>
                    <figure className="order-book-figure">
                      <OrderBookCover book={item.book} />
                    </figure>

                    <section className="order-book-info">
                      <h2 className="order-book-title">{item.book.title}</h2>
                      <p className="order-book-meta">数量：{item.quantity}</p>
                      <p className="order-book-meta">单价：{formatPrice(item.unitPrice)}</p>
                    </section>
                  </section>
                ))}
              </section>

              <footer className="order-card-footer">
                <p className="order-total">订单总计：{formatPrice(totalPrice)}</p>
                {isPending ? (
                  <section className="order-actions" aria-label="订单操作">
                    <Button type="primary" danger className="btn-cancel" onClick={() => cancelOrder(order.orderNo)}>
                      取消订单
                    </Button>
                    <Button type="primary" className="btn-pay" onClick={() => payOrder(order.orderNo)}>
                      立即付款
                    </Button>
                  </section>
                ) : null}
              </footer>
            </article>
          );
        })}
      </section>

      <footer className="orders-page-footer">
        <Link className="orders-back-link" to="/home">
          返回首页
        </Link>
      </footer>
    </main>
  );
}

export default Orders;
