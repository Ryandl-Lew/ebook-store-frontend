import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const USERS_STORAGE_KEY = 'ebook_users';
const DEFAULT_USER = { username: 'reins', password: '123456' };

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

function Profile({ currentUsername, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUsername) {
      navigate('/login');
    }
  }, [currentUsername, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const users = readUsers();
    const existingUser = users.find((user) => user.username === currentUsername);
    const validOldPassword = existingUser
      ? existingUser.password === formData.oldPassword
      : currentUsername === DEFAULT_USER.username && formData.oldPassword === DEFAULT_USER.password;

    if (!validOldPassword) {
      setError('原密码不正确，请重新输入。');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的新密码不一致，请重新输入。');
      return;
    }

    const userExistsInStorage = users.some((user) => user.username === currentUsername);
    const nextUsers = userExistsInStorage
      ? users.map((user) =>
          user.username === currentUsername ? { ...user, password: formData.newPassword } : user
        )
      : [...users, { username: currentUsername, password: formData.newPassword }];

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    setError('');
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    window.alert('密码修改成功');
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <main className="profile-page">
      <article className="profile-card">
        <header className="profile-header">
          <h1 className="profile-title">个人主页</h1>
          <p className="profile-subtitle">当前登录用户：{currentUsername}</p>
        </header>

        <section className="profile-section" aria-label="修改密码">
          <h2 className="profile-section-title">修改密码</h2>
          <form className="profile-form" onSubmit={handleSubmit}>
            <fieldset className="profile-fieldset">
              <legend className="profile-legend">账号安全设置</legend>

              <label className="profile-label" htmlFor="oldPassword">
                原密码
              </label>
              <input
                className="profile-input"
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="请输入原密码"
                required
              />

              <label className="profile-label" htmlFor="newPassword">
                新密码
              </label>
              <input
                className="profile-input"
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="请输入新密码"
                required
              />

              <label className="profile-label" htmlFor="confirmPassword">
                确认新密码
              </label>
              <input
                className="profile-input"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请再次输入新密码"
                required
              />
            </fieldset>

            {error ? (
              <p className="profile-error" role="alert">
                {error}
              </p>
            ) : null}

            <button className="profile-submit-btn" type="submit">
              确认修改
            </button>
          </form>
        </section>

        <footer className="profile-footer">
          <button className="profile-logout-btn" type="button" onClick={handleLogoutClick}>
            退出登录 / 切换账号
          </button>
        </footer>
      </article>
    </main>
  );
}

export default Profile;
