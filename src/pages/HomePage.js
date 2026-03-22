import './HomePage.css';

function HomePage() {
  return (
    <main className="home-page">
      <header className="home-header">
        <h1>网上购书商城首页</h1>
        <p>欢迎你，reins。你已成功登录。</p>
      </header>

      <section className="book-section" aria-label="推荐书籍">
        <article className="book-card">
          <figure>
            <div className="book-cover" aria-hidden="true">
              React
            </div>
            <figcaption>《React 实战指南》</figcaption>
          </figure>
          <p>从基础到项目实战，快速掌握 React 前端开发。</p>
        </article>

        <article className="book-card">
          <figure>
            <div className="book-cover" aria-hidden="true">
              JS
            </div>
            <figcaption>《JavaScript 高级程序设计》</figcaption>
          </figure>
          <p>系统梳理 JavaScript 核心能力，夯实工程化开发基础。</p>
        </article>
      </section>
    </main>
  );
}

export default HomePage;
