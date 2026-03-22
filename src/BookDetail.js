import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from './CartContext';
import { useOrder } from './OrderContext';
import mockBooks from './mockBooks';
import './BookDetail.css';
import { formatPrice } from './utils/price';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { createDirectOrder } = useOrder();

  const book = useMemo(() => mockBooks.find((item) => item.id === id), [id]);

  if (!book) {
    return (
      <main className="detail-page">
        <article className="detail-empty">
          <h1 className="detail-empty-title">未找到该书籍</h1>
          <p className="detail-empty-text">请返回首页重新选择图书。</p>
          <Link className="detail-back-link" to="/home">
            返回首页
          </Link>
        </article>
      </main>
    );
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(book.stock, prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    window.alert('已成功加入购物车');
  };

  const handleBuyNow = () => {
    createDirectOrder(book, quantity);
    navigate('/orders');
  };

  return (
    <main className="detail-page">
      <article className="detail-container">
        <section className="detail-cover-section" aria-label="书籍封面">
          <figure className="detail-figure">
            <img className="detail-cover" src={book.cover} alt={`${book.title}封面`} />
            <figcaption className="detail-caption">{book.title}</figcaption>
          </figure>
        </section>

        <section className="detail-info-section" aria-label="书籍信息">
          <header className="detail-header">
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">作者：{book.author}</p>
          </header>

          <dl className="detail-meta-list">
            <div className="detail-meta-item">
              <dt className="detail-meta-label">ISBN</dt>
              <dd className="detail-meta-value">{book.isbn}</dd>
            </div>
            <div className="detail-meta-item">
              <dt className="detail-meta-label">出版社</dt>
              <dd className="detail-meta-value">{book.publisher}</dd>
            </div>
            <div className="detail-meta-item">
              <dt className="detail-meta-label">出版时间</dt>
              <dd className="detail-meta-value">{book.publishTime}</dd>
            </div>
            <div className="detail-meta-item">
              <dt className="detail-meta-label">库存</dt>
              <dd className="detail-meta-value">{book.stock} 本</dd>
            </div>
            <div className="detail-meta-item">
              <dt className="detail-meta-label">单价</dt>
              <dd className="detail-price">{formatPrice(book.price)}</dd>
            </div>
          </dl>

          <section className="detail-description-section">
            <h2 className="detail-subtitle">作品简介</h2>
            <p className="detail-description">{book.description}</p>
          </section>

          <section className="detail-action-section" aria-label="购买操作">
            <h2 className="detail-subtitle">购买数量</h2>
            <div className="quantity-control">
              <button className="quantity-btn" type="button" onClick={decreaseQuantity}>
                -
              </button>
              <output className="quantity-value" aria-live="polite">
                {quantity}
              </output>
              <button className="quantity-btn" type="button" onClick={increaseQuantity}>
                +
              </button>
            </div>

            <div className="action-buttons">
              <button className="add-cart-btn" type="button" onClick={handleAddToCart}>
                加入购物车
              </button>
              <button className="buy-now-btn" type="button" onClick={handleBuyNow}>
                立即购买
              </button>
            </div>
          </section>
        </section>
      </article>
    </main>
  );
}

export default BookDetail;
