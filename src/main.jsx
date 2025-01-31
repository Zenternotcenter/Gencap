import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';  // ✅ ตรวจสอบว่ามีการ import Bootstrap
import App from './App';

const root = document.getElementById('root');  // ✅ ตรวจสอบว่าหา `root` ได้

if (root) { // ✅ เช็คว่า `root` มีอยู่จริง
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("ไม่พบ #root ใน index.html!");
}
