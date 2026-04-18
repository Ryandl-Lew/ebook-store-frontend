import { useMemo, useState } from 'react';
import './Home.css';
import normalizedBooks from '../utils/books';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';

const NAV_LINKS = [
  { label: '购物车', to: '/cart' },
  { label: '我的订单', to: '/orders' },
  { label: '个人主页', to: '/profile' },
];

function Home() {
  const [searchText, setSearchText] = useState('');

  const filteredBooks = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return normalizedBooks;
    }
    return normalizedBooks.filter((book) => {
      const titleMatched = book.title.toLowerCase().includes(keyword);
      const authorMatched = book.author.toLowerCase().includes(keyword);
      const isbnMatched = book.isbn.toLowerCase().includes(keyword);
      return titleMatched || authorMatched || isbnMatched;
    });
  }, [searchText]);

  return (
    <main className="home-page">
      <Header
        title="电子书店"
        desc="精选全球热门图书，快速查找并加入购物车。"
        navLinks={NAV_LINKS}
      />

      <SearchBar
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="请输入书名、作者或 ISBN"
      />

      {filteredBooks.length === 0 ? (
        <p className="status-text">未搜索到匹配图书，请尝试其他关键词。</p>
      ) : null}

      <section className="book-list-section" aria-label="书籍列表">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </main>
  );
}

export default Home;
