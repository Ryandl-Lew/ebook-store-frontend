import { Link } from 'react-router-dom';

/**
 * 站点顶部品牌区 + 导航栏（通用构件）
 *
 * Props:
 *   title    {string}               品牌标题文字
 *   desc     {string}               副标题描述文字
 *   navLinks {Array<{label, to}>}   导航项列表
 */
function Header({ title, desc, navLinks }) {
  return (
    <header className="home-header">
      <article className="brand-area">
        <h1 className="brand-title">{title}</h1>
        <p className="brand-desc">{desc}</p>
      </article>

      <nav className="main-nav" aria-label="站点导航">
        {navLinks.map((link) => (
          <Link key={link.to} className="nav-link" to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default Header;
