<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <div class="app-layout-main">
    <nav class="main-navbar shadow-sm">
      <div class="nav-container">
        <span class="brand-title">🏢 Smart Library Management</span>
        <div class="nav-links">
          <RouterLink to="/" class="nav-item" active-class="active-link">
            📚 คลังหนังสือ
          </RouterLink>
          <RouterLink to="/users" class="nav-item" active-class="active-link">
            👥 ระบบสมาชิก
          </RouterLink>
          <RouterLink to="/borrows" class="nav-item" active-class="active-link">
            🔄 การยืม-คืน
          </RouterLink>
        </div>
      </div>
    </nav>

    <main class="content-body">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global CSS สำหรับครอบ Layout ทั้งเว็บ */
.app-layout-main {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #dbeafe 0%, transparent 25%),
              radial-gradient(circle at bottom right, #ede9fe 0%, transparent 25%),
              #f8fafc;
  font-family: 'Inter', 'Kanit', sans-serif;
}
.main-navbar {
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 999;
}
.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand-title {
  color: white;
  font-weight: 700;
  font-size: 1.15rem;
}
.nav-links {
  display: flex;
  gap: 0.75rem;
}
.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: all 0.2s;
}
.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}
.active-link {
  color: white !important;
  background: #2563eb !important;
}
.content-body {
  padding: 1rem 0;
}
</style>