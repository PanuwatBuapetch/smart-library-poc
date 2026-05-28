# 📚 Smart Library System

ระบบจัดการทรัพยากรห้องสมุดอัจฉริยะ พัฒนาด้วย Vue 3 + TypeScript + Bootstrap + Axios
รองรับการจัดการหนังสือแบบ CRUD (Create, Read, Update, Delete)

---

## 🚀 Features

* 📖 แสดงรายการหนังสือทั้งหมด
* ➕ เพิ่มหนังสือใหม่
* ✏️ แก้ไขข้อมูลหนังสือ
* 🗑️ ลบหนังสือ
* 🎨 Modern UI Design
* ⚡ Responsive Layout
* 🔄 เชื่อมต่อ REST API ด้วย Axios
* 🪄 Modal Popup แบบ Custom

---

# 🛠️ Tech Stack

* Vue 3
* TypeScript
* Vite
* Bootstrap 5
* Axios
* CSS3

---

# 📂 Project Structure

```bash
src/
│
├── assets/
│   └── main.css
│
├── components/
│   ├── BookCard.vue
│   ├── AddBookModal.vue
│   └── DetailModal.vue
│
├── App.vue
├── main.ts
└── vite-env.d.ts
```

---

# ⚙️ Installation

## 1️⃣ Clone Project

```bash
git clone https://github.com/your-username/smart-library-system.git
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run Project

```bash
npm run dev
```

---

# 🌐 API Endpoint

```bash
http://localhost:3000/api/books
```

---

# 📦 Install Required Packages

## Bootstrap

```bash
npm install bootstrap
```

## Axios

```bash
npm install axios
```

---

# 🔧 main.ts

```ts
import { createApp } from 'vue'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).mount('#app')
```

---

# 🧠 TypeScript Fix

สร้างไฟล์:

```bash
src/vite-env.d.ts
```

แล้วใส่:

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

---

# 🎨 UI Preview

## Main Features

* Modern Card Layout
* Smooth Animation
* Custom Modal
* Responsive Design
* Soft Shadow UI
* Gradient Header

---

# 📱 Responsive Support

รองรับ:

* Desktop
* Tablet
* Mobile

---

# 🖼️ Screenshot

## Dashboard

* แสดงหนังสือทั้งหมด
* สถานะ Available / Borrowed
* ปุ่ม CRUD

---

# 📌 Future Improvements

* 🔍 Search Books
* 📚 Categories
* 👤 User Authentication
* 📊 Dashboard Statistics
* 🌙 Dark Mode
* ☁️ Deploy Online

---

# 👨‍💻 Developer

พัฒนาโดย

**Panuwat Buapetch**

---

# 📄 License

MIT License

---

# ❤️ Thank You

ขอบคุณที่ใช้งาน Smart Library System 🚀
