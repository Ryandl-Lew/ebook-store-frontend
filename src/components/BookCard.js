import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/price';

const getFallbackCover = (title) =>
  `https://placehold.co/200x280/2f4bdb/ffffff?text=${encodeURIComponent(title)}`;

/**
 * 单本书籍卡片（通用构件）
 *
 * Props:
 *   book  {{ id, title, cover, price }}  书籍数据
 */
function BookCard({ book }) {
  return (
    <article className="book-card">
      <Link className="book-link" to={`/books/${book.id}`}>
        <figure className="book-figure">
          <img
            className="book-cover"
            src={book.cover}
            alt={`${book.title}封面`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getFallbackCover(book.title);
            }}
          />
          <figcaption className="book-title">{book.title}</figcaption>
        </figure>
        <p className="book-price">{formatPrice(book.price)}</p>
      </Link>
    </article>
  );
}

export default BookCard;
