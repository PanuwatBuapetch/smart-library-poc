<template>
  <div class="container-fluid py-4 px-4">
    <header class="text-center mb-5 header-section">
      <h1 class="display-5 fw-bold text-gradient mb-3">👥 Member Management</h1>
      <p class="text-muted fs-5">ระบบบริหารจัดการข้อมูลสมาชิกและสิทธิ์ผู้ใช้งานจากฐานข้อมูลจริง</p>
      <div class="header-line"></div>
    </header>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">กำลังประมวลผลข้อมูลสมาชิก...</p>
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
                <th class="py-3 text-end">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="fw-bold text-secondary">#{{ user.id }}</td>
                <td class="fw-semibold text-dark">{{ user.name }}</td>
                <td class="text-muted">{{ user.email }}</td>
                <td>
                  <span class="badge-role" :class="user.role ? user.role.toLowerCase() : 'member'">
                    {{ user.role || "Member" }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" title="แก้ไขข้อมูลสมาชิก" @click="editUser(user.id)">
                      <i class="bi bi-pencil-square"></i> แก้ไข
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="ลบข้อมูลสมาชิก" @click="deleteUser(user.id, user.name)">
                      <i class="bi bi-trash"></i> ลบ
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop-custom">
      <div class="modal d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 16px;">
            <div class="modal-header bg-light">
              <h5 class="modal-title fw-bold text-dark">📝 แก้ไขข้อมูลสมาชิก (#{{ editUserForm.id }})</h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">ชื่อ-นามสกุล</label>
                <input v-model="editUserForm.name" class="form-control" placeholder="กรอกชื่อ-นามสกุล" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">อีเมล</label>
                <input v-model="editUserForm.email" type="email" class="form-control" placeholder="กรอกอีเมล" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">บทบาทระบบ</label>
                <select v-model="editUserForm.role" class="form-select">
                  <option value="Admin">Admin</option>
                  <option value="Librarian">Librarian</option>
                  <option value="Member">Member</option>
                </select>
              </div>
            </div>
            <div class="modal-footer bg-light border-0">
              <button type="button" class="btn btn-light rounded-3" @click="showModal = false">ยกเลิก</button>
              <button type="button" class="btn btn-primary rounded-3 px-4" @click="updateUser">💾 บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editUserForm = ref({ id: 0, name: '', email: '', role: '' });

// 1. ดึงข้อมูลสมาชิกทั้งหมดจาก Backend
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/api/users");
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

// 2. เรียกดูข้อมูลสมาชิกรายคนมาใส่ในฟอร์ม Modal
const editUser = async (userId: number) => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
    const user = response.data;
    
    console.log("ข้อมูลที่ได้มาจริง:", user);
    
    editUserForm.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'Member' // 📝 ใส่ค่า String ตายตัวไว้ก่อนเพื่อไม่ให้หน้าบ้านพัง
    };
    showModal.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 3. ยิงคำสั่ง PUT ไปอัปเดตข้อมูลจริงที่ฐานข้อมูลหลังบ้าน
const updateUser = async () => {
  if (!editUserForm.value.name || !editUserForm.value.email) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  
  loading.value = true;
  try {
    await axios.put(`http://localhost:3000/api/users/${editUserForm.value.id}`, {
      name: editUserForm.value.name,
      email: editUserForm.value.email,
      role: editUserForm.value.role
    });
    
    showModal.value = false;
    await fetchUsers(); // ดึงข้อมูลใหม่มาอัปเดตบนหน้ากากหน้าจอสดๆ
  } catch (error) {
    console.error("Error updating user:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  } finally {
    loading.value = false;
  }
};

// 4. ยิงคำสั่ง DELETE ไปลบข้อมูลในฐานข้อมูลจริงหลังบ้าน
const deleteUser = async (userId: number, userName: string) => {
  if (confirm(`คุณแน่ใจหรือไม่ที่จะลบคุณ "${userName}" ออกจากระบบสมาชิก?`)) {
    loading.value = true;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      await fetchUsers(); // โหลดข้อมูลที่เหลือขึ้นตารางใหม่ทันที
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("เกิดข้อผิดพลาดในการลบสมาชิก");
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* ดีไซน์คุมโทนพรีเมียม */
.header-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
}
.text-gradient {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-line {
  width: 70px;
  height: 4px;
  background: #2563eb;
  margin: 1rem auto 0;
  border-radius: 999px;
}
.action-bar {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}
.book-card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

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
  text-transform: capitalize;
}
.admin { background: #fee2e2; color: #991b1b; }
.librarian { background: #fef3c7; color: #92400e; }
.member { background: #e0f2fe; color: #0369a1; }

/* Custom Backdrop สำหรับจัดหน้ากระจก Modal ให้ตรงล็อคสวยงาม */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1050;
}
</style>