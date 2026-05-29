<template>
  <div class="container-fluid py-4 px-4">
    <header class="text-center mb-5 header-section">
      <h1 class="display-5 fw-bold text-gradient mb-3">👥 Member Management</h1>
      <p class="text-muted fs-5">ระบบบริหารจัดการข้อมูลสมาชิกและสิทธิ์ผู้ใช้งานจากฐานข้อมูลจริง</p>
      <div class="header-line"></div>
    </header>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">กำลังดึงข้อมูลสมาชิก...</p>
    </div>

    <div v-else-if="users.length === 0" class="card book-card p-5 text-center">
      <p class="text-muted mb-0">📁 ไม่พบข้อมูลสมาชิกในระบบฐานข้อมูล</p>
    </div>

    <div v-else>
      <div class="action-bar mb-4 d-flex justify-content-between align-items-center">
        <div class="fw-semibold text-secondary">สมาชิกทั้งหมดในระบบ ({{ users.length }} รายการ)</div>
      </div>

      <div class="card book-card p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="py-3">ID</th>
                <th class="py-3">ชื่อ-นามสกุล</th>
                <th class="py-3">อีเมล</th>
                <th class="py-3">บทบาทระบบ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="fw-bold text-secondary">#{{ user.id }}</td>
                <td class="fw-semibold text-dark">{{ user.name }}</td>
                <td class="text-muted">{{ user.email }}</td>
                <td>
                  <span class="badge-role" :class="user.role ? user.role.toLowerCase() : 'member'">
                    {{ user.role || 'Member' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 1. กำหนดโครงสร้าง Type ของ User ให้ตรงกับตารางใน Database ของเรา
interface User {
  id: number
  name: string
  email: string
  role: string
}

const users = ref<User[]>([])
const loading = ref(true)

// 2. ฟังก์ชันยิงไปดึงข้อมูลจากหลังบ้านจริง (พอร์ต 3000)
const fetchUsers = async () => {
  loading.value = true
  try {
    // เรียกไปที่เส้นของ backend ของคุณ (สมมติว่าเป็น /api/users)
    const response = await axios.get('http://localhost:3000/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

// 3. สั่งให้ฟังก์ชันทำงานทันทีเมื่อหน้าจอนี้เปิดขึ้นมา
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* คัดลอกดีไซน์ให้คุมโทนพรีเมียมเหมือนหน้าหลัก */
.header-section { background: rgba(255,255,255,.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 3rem 2rem; border: 1px solid rgba(255,255,255,.4); box-shadow: 0 8px 32px rgba(15,23,42,.06); }
.text-gradient { background: linear-gradient(135deg, #1e3c72, #2a5298); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-line { width: 70px; height: 4px; background: #2563eb; margin: 1rem auto 0; border-radius: 999px; }
.action-bar { background: white; padding: 1rem 1.5rem; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.03); }
.book-card { border: none; border-radius: 20px; overflow: hidden; background: white; box-shadow: 0 4px 20px rgba(0,0,0,.04); }

/* สไตล์เฉพาะตารางสมาชิก */
.table th {
  border: none;
  font-weight: 600;
  color: #475569;
}
.badge-role {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}
.admin { background: #fee2e2; color: #991b1b; }
.librarian { background: #fef3c7; color: #92400e; }
.member { background: #e0f2fe; color: #0369a1; }
</style>