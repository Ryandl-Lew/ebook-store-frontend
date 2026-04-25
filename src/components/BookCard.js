import { useState } from 'react';
import { Link } from 'react-router-dom';
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
            <div className="fallback-cover">
              {book.title}
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
