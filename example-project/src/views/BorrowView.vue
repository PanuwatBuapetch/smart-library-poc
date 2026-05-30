<template>
  <div class="container-fluid py-4 px-4">
    <header class="text-center mb-5 header-section">
      <h1 class="display-5 fw-bold text-gradient mb-3">📖 Borrow Management</h1>
      <p class="text-muted fs-5">ระบบบริหารจัดการข้อมูลการยืม-คืนหนังสือในห้องสมุด</p>
      <div class="header-line"></div>
    </header>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">กำลังประมวลผลข้อมูล...</p>
    </div>

    <div v-else>
      <div class="action-bar mb-4 d-flex justify-content-between align-items-center">
        <div class="fw-semibold text-secondary">
          รายการยืมหนังสือทั้งหมด ({{ borrows.length }} รายการ)
        </div>
        <button class="btn btn-success rounded-3 px-3 fw-semibold shadow-sm" @click="openCreateModal">
          <i class="bi bi-plus-circle-fill"></i> ➕ ยืมหนังสือใหม่
        </button>
      </div>

      <div v-if="borrows.length === 0" class="card book-card p-5 text-center">
        <p class="text-muted mb-0">📁 ไม่พบประวัติการยืมหนังสือในระบบ</p>
      </div>

      <div v-else class="card book-card p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="py-3">ID</th>
                <th class="py-3">หนังสือที่ยืม</th>
                <th class="py-3">ผู้ยืมหนังสือ</th>
                <th class="py-3">วันที่ยืม</th>
                <th class="py-3">กำหนดคืน</th>
                <th class="py-3 text-end">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in borrows" :key="item.id">
                <td class="fw-bold text-secondary">#{{ item.id }}</td>
                <td>
                  <div class="fw-bold text-dark">📘 {{ item.book_title || 'ไม่พบข้อมูลหนังสือ' }}</div>
                  <small class="text-muted">รหัสหนังสือ: #{{ item.book_id }}</small>
                </td>
                <td>
                  <div class="fw-semibold text-secondary">👤 {{ item.user_name || 'ไม่พบข้อมูลสมาชิก' }}</div>
                  <small class="text-muted">รหัสสมาชิก: #{{ item.user_id }}</small>
                </td>
                <td>
                  <span class="badge bg-light text-dark border">{{ formatDate(item.borrow_date) }}</span>
                </td>
                <td>
                  <span class="badge bg-light text-danger border border-danger-subtle">{{ formatDate(item.return_date) }}</span>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" @click="editBorrow(item.id)">
                      <i class="bi bi-pencil-square"></i> แก้ไข
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteBorrow(item.id)">
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
              <h5 class="modal-title fw-bold text-dark">
                {{ isEditMode ? `📝 แก้ไขรายการยืมหนังสือ (#${editForm.id})` : '➕ บันทึกรายการยืมหนังสือใหม่' }}
              </h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">เลือกหนังสือที่ต้องการยืม</label>
                <select v-model.number="editForm.book_id" class="form-select">
                  <option :value="0" disabled>--- กรุณาเลือกหนังสือ ---</option>
                  <option v-for="book in bookOptions" :key="book.id" :value="book.id">
                    📘 [ID: #{{ book.id }}] {{ book.title }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">เลือกสมาชิกผู้ยืม</label>
                <select v-model.number="editForm.user_id" class="form-select">
                  <option :value="0" disabled>--- กรุณาเลือกสมาชิก ---</option>
                  <option v-for="user in userOptions" :key="user.id" :value="user.id">
                    👤 [ID: #{{ user.id }}] {{ user.name }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">วันที่ยืม</label>
                <input v-model="editForm.borrow_date" type="date" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">กำหนดคืนหนังสือ</label>
                <input v-model="editForm.return_date" type="date" class="form-control" />
              </div>
            </div>
            <div class="modal-footer bg-light border-0">
              <button type="button" class="btn btn-light rounded-3" @click="showModal = false">ยกเลิก</button>
              <button type="button" class="btn btn-primary rounded-3 px-4" @click="saveBorrow">
                💾 {{ isEditMode ? 'บันทึกการแก้ไข' : 'ยืนยันการยืมหนังสือ' }}
              </button>
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

interface Borrow {
  id: number;
  book_id: number;
  user_id: number;
  borrow_date: string;
  return_date: string;
  book_title?: string;
  user_name?: string;
}

interface BookOption { id: number; title: string; }
interface UserOption { id: number; name: string; }

const borrows = ref<Borrow[]>([]);
const bookOptions = ref<BookOption[]>([]); 
const userOptions = ref<UserOption[]>([]); 

const loading = ref(true);
const showModal = ref(false);
const isEditMode = ref(false);
const editForm = ref({ id: 0, book_id: 0, user_id: 0, borrow_date: '', return_date: '' });

// 1. ดึงข้อมูลประวัติการยืมทั้งหมด
const fetchBorrows = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/borrows");
    borrows.value = response.data;
  } catch (error) {
    console.error("Error fetching borrows:", error);
  }
};

// 2. ฟังก์ชันดึงตัวเลือกรายชื่อหนังสือและสมาชิกจากคลัง API หลัก
const fetchOptionsData = async () => {
  try {
    const [booksRes, usersRes] = await Promise.all([
      axios.get("http://localhost:3000/api/books"),
      axios.get("http://localhost:3000/api/users")
    ]);
    bookOptions.value = booksRes.data;
    userOptions.value = usersRes.data;
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
  }
};

// 📝 3. ปรับฟังก์ชันเปิดสร้างรายการใหม่ให้เคลียร์เป็นเซ็ตเซฟ 0 ป้องกันออบเจกต์พัง
const openCreateModal = () => {
  isEditMode.value = false;
  const today = new Date().toISOString().split('T')[0];
  editForm.value = {
    id: 0,
    book_id: 0, 
    user_id: 0,
    borrow_date: today || '',
    return_date: ''
  };
  showModal.value = true;
};

const editBorrow = async (id: number) => {
  loading.value = true;
  isEditMode.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/borrows/${id}`);
    const data = response.data;
    
    const bDate = data.borrow_date ? new Date(data.borrow_date).toISOString().split('T')[0] : '';
    const rDate = data.return_date ? new Date(data.return_date).toISOString().split('T')[0] : '';

    editForm.value = {
      id: data.id,
      book_id: data.book_id,
      user_id: data.user_id,
      borrow_date: bDate || '',
      return_date: rDate || ''
    };
    showModal.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 📝 4. ปรับเงื่อนไขตรวจสอบก่อนส่งข้อมูลไปบันทึก
const saveBorrow = async () => {
  // ดักตรวจสอบว่ามีการคลิกเลือกหนังสือและสมาชิกจริงหรือไม่ (ห้ามค้างที่เลข 0)
  if (editForm.value.book_id === 0 || editForm.value.user_id === 0 || !editForm.value.borrow_date || !editForm.value.return_date) {
    alert("กรุณากรอกข้อมูลและเลือกตัวเลือกให้ครบถ้วน");
    return;
  }

  loading.value = true;
  try {
    if (isEditMode.value) {
      // โหมดแก้ไข: ส่งข้อมูลไปอัปเดต (เพื่อกระตุ้นลอจิกตรวจสอบค่าปรับที่ฝั่ง Backend หลังบ้าน)
      await axios.put(`http://localhost:3000/api/borrows/${editForm.value.id}`, editForm.value);
      alert("อัปเดตข้อมูลรายการยืมสำเร็จ! (ระบบได้ทำการตรวจสอบกำหนดเวลาคืนเรียบร้อย)");
    } else {
      await axios.post("http://localhost:3000/api/borrows", {
        book_id: editForm.value.book_id,
        user_id: editForm.value.user_id,
        borrow_date: editForm.value.borrow_date,
        return_date: editForm.value.return_date
      });
      alert("สร้างข้อมูลรายการยืมหนังสือใหม่เรียบร้อย!");
    }
    showModal.value = false;
    await fetchBorrows();
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  } finally {
    loading.value = false;
  }
};

const deleteBorrow = async (id: number) => {
  if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายการยืมรหัส #${id} นี้ออกจากระบบ?`)) {
    loading.value = true;
    try {
      await axios.delete(`http://localhost:3000/api/borrows/${id}`);
      await fetchBorrows();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('th-TH', options);
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchBorrows(), fetchOptionsData()]);
  loading.value = false;
});
</script>

<style scoped>
.header-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
}
.text-gradient {
  background: linear-gradient(135deg, #111827, #1f2937);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-line {
  width: 70px;
  height: 4px;
  background: #10b981;
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
.table th {
  border: none;
  font-weight: 600;
  color: #475569;
}
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