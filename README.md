# Smart Restaurant Frontend

Frontend dùng React + Vite + TypeScript, tổ chức theo feature.
UI đã chọn Tailwind CSS, tích hợp bằng `@tailwindcss/vite`.
Theme và utilities được nạp trong `src/styles/global.css`; hiện bỏ Preflight
để giữ giao diện CSS sẵn có. CSS cũ nằm trong layer components để utilities
có thể ghi đè. Viết class trực tiếp trong JSX, ví dụ `className="p-4 rounded-lg"`.
Tham khảo [hướng dẫn Tailwind cho Vite](https://tailwindcss.com/docs/installation/using-vite).
Xem [hướng dẫn cấu trúc và cách phát triển](docs/FRONTEND_STRUCTURE.md).

Chạy `npm install`, sau đó `npm run dev`. Kiểm tra bằng `npm run build` và
`npm run lint`. Hiện có khung trang `/menu`, `/cart`, Router, Redux Toolkit,
TanStack Query và Axios; chưa tích hợp backend hoặc luồng đặt món.

Cây thư mục đầy đủ đã được tạo theo yêu cầu. Các file mới có chú thích
`KHUNG SOURCE`/`TODO` chỉ giữ vị trí, chưa triển khai nghiệp vụ và chưa gắn route.

## Tài liệu template ban đầu

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
