import { Link } from 'react-router-dom';
import { useOrder } from '../OrderContext';
import './Orders.css';
import { formatPrice } from '../utils/price';

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
                <span className={isPending ? 'status-tag status-pending' : 'status-tag status-done'}>
                  {order.status}
                </span>
              </header>

              <section className="order-items" aria-label="订单商品信息">
                {orderItems.map((item, index) => (
                  <section className="order-item" key={`${order.orderNo}-${item.book.id}-${index}`}>
                    <figure className="order-book-figure">
                      <img className="order-book-cover" src={item.book.cover} alt={`${item.book.title}封面`} />
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
                    <button className="btn-cancel" type="button" onClick={() => cancelOrder(order.orderNo)}>
                      取消订单
                    </button>
                    <button className="btn-pay" type="button" onClick={() => payOrder(order.orderNo)}>
                      立即付款
                    </button>
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
