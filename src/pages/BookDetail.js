import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Descriptions,
  Row,
  Col,
  Tag,
  Typography,
  Divider,
  Space,
  Card,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  MinusOutlined,
  PlusOutlined,
  BookOutlined,
  CalendarOutlined,
  BarcodeOutlined,
  BankOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { useCart } from '../CartContext';
import { useOrder } from '../OrderContext';
import normalizedBooks from '../utils/books';
import './BookDetail.css';
import { formatPrice } from '../utils/price';

const { Title, Paragraph, Text } = Typography;

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const { addToCart } = useCart();
  const { createDirectOrder } = useOrder();
  const [coverError, setCoverError] = useState(false);

  const book = useMemo(() => normalizedBooks.find((item) => item.id === id), [id]);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(book.stock, prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
    messageApi.success(`已将 ${quantity} 本《${book.title}》加入购物车`);
  };

  const handleBuyNow = () => {
    createDirectOrder(book, quantity);
    navigate('/orders');
  };

  if (!book) {
    return (
      <main className="detail-page">
        <article className="detail-empty">
          <Title level={2} className="detail-empty-title">
            未找到该书籍
          </Title>
          <Paragraph className="detail-empty-text">
            请返回首页重新选择图书。
          </Paragraph>
          <Link className="detail-back-link" to="/home">
            <Button type="primary" size="large">
              返回首页
            </Button>
          </Link>
        </article>
      </main>
    );
  }

  const metadataItems = [
    {
      key: 'author',
      label: (
        <span>
          <BookOutlined style={{ marginRight: 6 }} />
          作者
        </span>
      ),
      children: book.author,
      span: 2,
    },
    {
      key: 'publisher',
      label: (
        <span>
          <BankOutlined style={{ marginRight: 6 }} />
          出版社
        </span>
      ),
      children: book.publisher,
      span: 2,
    },
    {
      key: 'publishDate',
      label: (
        <span>
          <CalendarOutlined style={{ marginRight: 6 }} />
          出版时间
        </span>
      ),
      children: book.publishDate,
      span: 2,
    },
    {
      key: 'isbn',
      label: (
        <span>
          <BarcodeOutlined style={{ marginRight: 6 }} />
          ISBN
        </span>
      ),
      children: book.isbn,
      span: 2,
    },
    {
      key: 'stock',
      label: (
        <span>
          <InboxOutlined style={{ marginRight: 6 }} />
          库存
        </span>
      ),
      children: (
        <span>
          {book.stock > 0 ? (
            <Tag color="green">{book.stock} 本</Tag>
          ) : (
            <Tag color="red">暂无库存</Tag>
          )}
        </span>
      ),
      span: 2,
    },
  ];

  return (
    <main className="detail-page">
      {contextHolder}
      <div className="detail-wrapper">
        <Row gutter={[40, 32]} className="detail-main-row">
          {/* ====== 左侧：封面 ====== */}
          <Col xs={24} md={10} lg={9}>
            <Card
              className="detail-cover-card"
              bordered={false}
              cover={
                <div className="detail-cover-wrapper">
                  {coverError ? (
                    <div className="fallback-cover">
                      《{book.title}》
                    </div>
                  ) : (
                    <img
                      className="detail-cover"
                      src={book.cover}
                      alt={`《${book.title}》封面`}
                      onError={() => setCoverError(true)}
                    />
                  )}
                </div>
              }
            >
              <Card.Meta
                title={
                  <Text strong style={{ fontSize: 15 }}>
                    {book.title}
                  </Text>
                }
                description={
                  <Text type="secondary">{book.author} 著</Text>
                }
              />
            </Card>
          </Col>

          {/* ====== 右侧：详情信息 ====== */}
          <Col xs={24} md={14} lg={15}>
            <div className="detail-right-content">
              {/* 书名 + 作者 */}
              <div className="detail-header-block">
                <Title level={2} className="detail-title" style={{ marginBottom: 8 }}>
                  《{book.title}》
                </Title>
                <Space split={<Divider type="vertical" />}>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {book.author}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {book.publisher}
                  </Text>
                </Space>
              </div>

              {/* 价格展示 */}
              <div className="detail-price-block">
                <Text type="secondary" style={{ fontSize: 14 }}>
                  单价
                </Text>
                <div className="detail-price-value">{formatPrice(book.price)}</div>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              {/* 元数据 - Descriptions 组件 */}
              <Descriptions
                className="detail-descriptions"
                column={2}
                bordered
                size="small"
                items={metadataItems}
              />

              <Divider style={{ margin: '20px 0' }} />

              {/* 内容简介 */}
              <div className="detail-desc-block">
                <Title level={4} style={{ marginBottom: 12 }}>
                  内容简介
                </Title>
                <Paragraph
                  className="detail-description"
                  style={{
                    lineHeight: 1.85,
                    fontSize: 15,
                    color: '#374151',
                    textAlign: 'justify',
                  }}
                >
                  {book.description}
                </Paragraph>
              </div>

              <Divider style={{ margin: '20px 0' }} />

              {/* 购买操作 */}
              <div className="detail-action-block">
                <div className="detail-action-row">
                  <div className="detail-quantity-section">
                    <Text strong style={{ fontSize: 15, marginRight: 16 }}>
                      购买数量
                    </Text>
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        aria-label="减少数量"
                      >
                        <MinusOutlined />
                      </button>
                      <output className="quantity-value" aria-live="polite">
                        {quantity}
                      </output>
                      <button
                        className="quantity-btn"
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= book.stock}
                        aria-label="增加数量"
                      >
                        <PlusOutlined />
                      </button>
                    </div>
                    <Text type="secondary" style={{ marginLeft: 12 }}>
                      库存 {book.stock} 本
                    </Text>
                  </div>
                </div>

                <div className="detail-total-row">
                  <Text style={{ fontSize: 15 }}>小计：</Text>
                  <Text strong className="detail-total-price">
                    {formatPrice(book.price * quantity)}
                  </Text>
                </div>

                <Space size={16} className="detail-buttons">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    className="add-cart-btn"
                    onClick={handleAddToCart}
                  >
                    加入购物车
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    className="buy-now-btn"
                    onClick={handleBuyNow}
                  >
                    立即购买
                  </Button>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
}

export default BookDetail;
