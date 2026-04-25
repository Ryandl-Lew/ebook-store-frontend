/**
 * 极简顶部标识（仅保留系统名称，无导航功能）
 *
 * Props:
 *   title {string} 系统名称
 */
function Header({ title }) {
  return (
    <header className="home-header">
      <h1 className="brand-title">{title}</h1>
    </header>
  );
}

export default Header;
