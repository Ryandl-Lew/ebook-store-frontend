import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import mockBooks from './mockBooks';
import { formatPrice } from './utils/price';

function Home() {
  const [books] = useState(mockBooks);
  const [searchText, setSearchText] = useState('');

  const filteredBooks = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return books;
    }

    return books.filter((book) => {
      const titleMatched = book.title.toLowerCase().includes(keyword);
      const authorMatched = book.author.toLowerCase().includes(keyword);
      const isbnMatched = book.isbn.toLowerCase().includes(keyword);
      return titleMatched || authorMatched || isbnMatched;
    });
  }, [books, searchText]);

  const getFallbackCover = (title) =>
    `https://placehold.co/200x280/2f4bdb/ffffff?text=${encodeURIComponent(title)}`;

  return (
    <main className="home-page">
      <header className="home-header">
        <article className="brand-area">
          <h1 className="brand-title">电子书店</h1>
          <p className="brand-desc">精选全球热门图书，快速查找并加入购物车。</p>
        </article>

        <nav className="main-nav" aria-label="站点导航">
          <Link className="nav-link" to="/cart">
            购物车
          </Link>
          <Link className="nav-link" to="/orders">
            我的订单
          </Link>
          <Link className="nav-link" to="/profile">
            个人主页
          </Link>
        </nav>
      </header>

      <section className="search-section" aria-label="图书搜索">
        <label className="search-label" htmlFor="book-search">
          搜索图书
        </label>
        <input
          id="book-search"
          className="search-input"
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="请输入书名、作者或 ISBN"
        />
      </section>

      {filteredBooks.length === 0 ? (
        <p className="status-text">未搜索到匹配图书，请尝试其他关键词。</p>
      ) : null}

      <section className="book-list-section" aria-label="书籍列表">
        {filteredBooks.map((book) => (
          <article className="book-card" key={book.id}>
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
        ))}
      </section>
    </main>
  );
}

export default Home;
