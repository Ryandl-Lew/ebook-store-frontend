import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './Register.css';

const USERS_STORAGE_KEY = 'ebook_users';

const readUsers = () => {
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

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致，请重新输入。');
      return;
    }

    const users = readUsers();
    const usernameExists = users.some((user) => user.username === formData.username);
    if (usernameExists) {
      setError('该用户名已存在，请更换用户名。');
      return;
    }

    const nextUsers = [
      ...users,
      {
        username: formData.username,
        password: formData.password,
      },
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    window.alert('注册成功');
    navigate('/login');
  };

  return (
    <main className="register-page">
      <article className="register-card" aria-labelledby="register-title">
        <header className="register-header">
          <section className="register-logo" aria-hidden="true">
            E
          </section>
          <h1 className="register-title" id="register-title">
            新用户注册
          </h1>
          <p className="register-subtitle">创建账号，开启你的电子书店体验</p>
        </header>

        <form className="register-form" onSubmit={handleRegister}>
          <label className="register-label" htmlFor="username">
            用户名
          </label>
          <input
            className="register-input"
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名"
            required
          />

          <label className="register-label" htmlFor="password">
            密码
          </label>
          <input
            className="register-input"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
            required
          />

          <label className="register-label" htmlFor="confirmPassword">
            确认密码
          </label>
          <input
            className="register-input"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="请再次输入密码"
            required
          />

          {error ? (
            <p className="register-error" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="primary" htmlType="submit" className="register-btn">
            立即注册
          </Button>
        </form>

        <footer className="register-footer">
          <p className="register-footer-text">
            已有账号？
            <Link className="register-link" to="/login">
              直接登录
            </Link>
          </p>
        </footer>
      </article>
    </main>
  );
}

export default Register;
