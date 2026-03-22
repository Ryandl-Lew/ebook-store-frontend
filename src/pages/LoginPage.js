import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const TEST_USER = {
  username: 'reins',
  password: '123456',
};
const USERS_STORAGE_KEY = 'ebook_users';

const readRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const users = readRegisteredUsers();
    const accountInUsers = users.find((user) => user.username === formData.username);
    const matchedRegisteredUser = Boolean(
      accountInUsers && accountInUsers.password === formData.password
    );
    const isDefaultUser =
      formData.username === TEST_USER.username && formData.password === TEST_USER.password;
    const isValidUser = accountInUsers ? matchedRegisteredUser : isDefaultUser;

    if (!isValidUser) {
      setError('用户名或密码错误，请重新输入。');
      return;
    }

    setError('');
    onLoginSuccess(formData.username);
    navigate('/home');
  };

  return (
    <main className="login-page">
      <article className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <figure className="brand-figure">
            <span className="brand-icon" aria-hidden="true">
              E
            </span>
            <figcaption>网上购书商城</figcaption>
          </figure>
          <h1 id="login-title">用户登录</h1>
          <p>请输入测试账号进行体验</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">用户名</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名"
            required
          />

          <label htmlFor="password">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
            required
          />

          {error ? (
            <p className="error-text" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit">登录</button>
        </form>
        <section className="login-link-section">
          <p className="login-link-text">
            没有账号？
            <Link className="login-link" to="/register">
              立即注册
            </Link>
          </p>
        </section>
      </article>
    </main>
  );
}

export default LoginPage;
