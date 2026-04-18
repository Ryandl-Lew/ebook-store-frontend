/**
 * 搜索框（通用构件）
 *
 * Props:
 *   value       {string}    受控输入值
 *   onChange    {Function}  值变化回调 (event) => void
 *   placeholder {string}    占位文字
 */
function SearchBar({ value, onChange, placeholder }) {
  return (
    <section className="search-section" aria-label="图书搜索">
      <label className="search-label" htmlFor="book-search">
        搜索图书
      </label>
      <input
        id="book-search"
        className="search-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </section>
  );
}

export default SearchBar;
