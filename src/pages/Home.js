import { useMemo, useState } from 'react';
import './Home.css';
import booksData from '../data/Data.json';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';

function Home() {
  const [searchText, setSearchText] = useState('');

  const filteredBooks = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return booksData;
    }
    return booksData.filter((book) => {
      const titleMatched = book.title.toLowerCase().includes(keyword);
      const authorMatched = book.author.toLowerCase().includes(keyword);
      const isbnMatched = book.isbn.toLowerCase().includes(keyword);
      return titleMatched || authorMatched || isbnMatched;
    });
  }, [searchText]);

  return (
    <main className="home-page">
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
