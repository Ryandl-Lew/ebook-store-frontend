import rawBooks from '../data/Data.json';

const verifiedCoverByIsbn = {
  '9787536692930': 'https://covers.openlibrary.org/b/id/10246665-L.jpg',
  '9787020002207': 'https://covers.openlibrary.org/b/id/14344059-L.jpg',
  '9787530215593':
    'https://upload.wikimedia.org/wikipedia/zh/6/6a/%E5%B0%8F%E8%AF%B4%E6%B4%BB%E7%9D%80.jpg',
  '9787020024759': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Evl53201b_pic.jpg',
  '9787020008735':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Shuihu7.PNG/330px-Shuihu7.PNG',
  '9787020008728':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/%E6%96%B0%E5%88%8A%E6%A0%A1%E6%AD%A3%E5%8F%A4%E6%9C%AC%E5%A4%A7%E5%AD%97%E9%9F%B3%E9%87%8A%E4%B8%89%E5%9B%BD%E5%BF%97%E9%80%9A%E4%BF%97%E6%BC%94%E4%B9%89_%E6%98%8E%E4%B8%87%E5%8E%86%E5%8D%81%E4%B9%9D%E5%B9%B4%E4%B9%A6%E6%9E%97%E5%91%A8%E6%9B%B0%E6%A0%A1%E5%88%8A%E6%9C%AC_002.jpg/330px-%E6%96%B0%E5%88%8A%E6%A0%A1%E6%AD%A3%E5%8F%A4%E6%9C%AC%E5%A4%A7%E5%AD%97%E9%9F%B3%E9%87%8A%E4%B8%89%E5%9B%BD%E5%BF%97%E9%80%9A%E4%BF%97%E6%BC%94%E4%B9%89_%E6%98%8E%E4%B8%87%E5%8E%86%E5%8D%81%E4%B9%9D%E5%B9%B4%E4%B9%A6%E6%9E%97%E5%91%A8%E6%9B%B0%E6%A0%A1%E5%88%8A%E6%9C%AC_002.jpg',
  '9787539957999':
    'https://upload.wikimedia.org/wikipedia/zh/2/2b/NAMIYA_ZAKKATEN_NO_KISEKI%28TW%29.jpg',
  '9787544258609':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Cien_a%C3%B1os_de_soledad.png/330px-Cien_a%C3%B1os_de_soledad.png',
  '9787544712279':
    'https://upload.wikimedia.org/wikipedia/zh/thumb/0/05/Littleprince.JPG/330px-Littleprince.JPG',
  '9787530216781':
    'https://upload.wikimedia.org/wikipedia/zh/thumb/b/b7/XuSanguan_MaixueJi.jpg/250px-XuSanguan_MaixueJi.jpg',
  '9787540471460': 'https://upload.wikimedia.org/wikipedia/zh/6/62/Kite_runner.jpg',
  '9787530210260':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg/330px-The_Catcher_in_the_Rye_%281951%2C_first_edition_cover%29.jpg',
  '9787544253994':
    'https://upload.wikimedia.org/wikipedia/commons/5/56/Portada_de_la_novel%C2%B7la_%22The_Great_Gatsby%22.gif',
  '9787532769506':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Le_Bon_-_Psychologie_des_foules.jpg/330px-Le_Bon_-_Psychologie_des_foules.jpg',
  '9787506380263':
    'https://upload.wikimedia.org/wikipedia/zh/thumb/a/a3/BriefHistoryTime.jpg/250px-BriefHistoryTime.jpg',
};

const coverThemes = ['2f4bdb', '7a2e8e', '156f5c', '8a4d1f', 'b23a48', '255f85'];

const buildFallbackSvgCover = (title, index) => {
  const bg = coverThemes[index % coverThemes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
  <rect width="200" height="280" rx="12" fill="#${bg}" />
  <rect x="20" y="30" width="160" height="220" rx="10" fill="rgba(255,255,255,0.1)" />
  <text x="100" y="132" text-anchor="middle" fill="#ffffff" font-size="24" font-family="Microsoft YaHei, Segoe UI, Arial">${title}</text>
  <text x="100" y="238" text-anchor="middle" fill="#ffffff" opacity="0.9" font-size="12" font-family="Segoe UI, Arial">EBOOK</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

/**
 * 从 Data.json 读取原始数据，统一 price 为 Number，
 * 并用核验封面或 SVG 兜底替换 cover 字段。
 */
const normalizedBooks = rawBooks.map((book, index) => ({
  ...book,
  price: Number(book.price),
  cover: verifiedCoverByIsbn[book.isbn] || buildFallbackSvgCover(book.title, index),
}));

export default normalizedBooks;
