import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty } from 'antd';
import { formatPrice } from '../utils/price';

/**
 * 单本书籍卡片（通用构件）
 *
 * Props:
 *   book  {{ id, title, cover, price }}  书籍数据
 */
function BookCard({ book }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="book-card">
      <Link className="book-link" to={`/books/${book.id}`}>
        <figure className="book-figure">
          {imgError ? (
            <div
              className="book-fallback-wrapper"
              style={{
                backgroundColor: '#f4ebd8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minHeight: 200,
                borderRadius: 8,
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span
                    style={{
                      fontFamily: "'Noto Serif SC', 'Songti SC', serif",
                      color: '#4e342e',
                      fontSize: '16px',
                    }}
                  >
                    {book.title}
                  </span>
                }
              />
            </div>
          ) : (
            <img
              className="book-cover"
              src={book.cover}
              alt={`${book.title}封面`}
              onError={() => setImgError(true)}
            />
          )}
          <figcaption className="book-title">{book.title}</figcaption>
        </figure>
        <p className="book-price">{formatPrice(book.price)}</p>
      </Link>
    </article>
  );
}

export default BookCard;
