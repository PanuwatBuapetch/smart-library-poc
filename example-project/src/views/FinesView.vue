<template>
  <div class="container-fluid py-4 px-4">
    <header class="text-center mb-5 header-section">
      <h1 class="display-5 fw-bold text-gradient mb-3">💰 Fine Management</h1>
      <p class="text-muted fs-5">ระบบบริหารจัดการค่าปรับสมาชิกที่คืนหนังสือเกินกำหนด</p>
      <div class="header-line"></div>
    </header>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-2 text-muted">กำลังประมวลผลข้อมูลค่าปรับ...</p>
    </div>

    <div v-else>
      <div class="action-bar mb-4 d-flex justify-content-between align-items-center">
        <div class="fw-semibold text-secondary">
          รายการค่าปรับทั้งหมด ({{ fines.length }} รายการ)
        </div>
        <button class="btn btn-warning text-dark rounded-3 px-3 fw-semibold shadow-sm" @click="openCreateModal">
          <i class="bi bi-plus-circle-fill"></i> ออกบิลค่าปรับใหม่
        </button>
      </div>

      <div v-if="fines.length === 0" class="card book-card p-5 text-center">
        <p class="text-muted mb-0">📁 ไม่พบข้อมูลประวัติค่าปรับในระบบ</p>
      </div>

      <div v-else class="card book-card p-4">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="py-3">ID บิล</th>
                <th class="py-3">รายการยืมที่เกี่ยวโยง</th>
                <th class="py-3">ชื่อสมาชิกผู้โดนปรับ</th>
                <th class="py-3">ยอดเงินค่าปรับ</th>
                <th class="py-3">สถานะบิล</th>
                <th class="py-3">วันที่ออกบิล</th>
                <th class="py-3 text-end">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fine in fines" :key="fine.fine_id">
                <td class="fw-bold text-secondary">#{{ fine.fine_id }}</td>
                <td>
                  <div class="fw-bold text-dark">📘 {{ fine.book_title || 'ไม่พบข้อมูลหนังสือ' }}</div>
                  <small class="text-muted">รหัสการยืม: #{{ fine.borrow_id }}</small>
                </td>
                <td>
                  <div class="fw-semibold text-secondary">👤 {{ fine.user_name || 'ไม่พบข้อมูลสมาชิก' }}</div>
                </td>
                <td>
                  <span class="fw-bold text-danger fs-5">฿{{ Number(fine.amount).toLocaleString() }}</span>
                </td>
                <td>
                  <span :class="['badge', fine.fine_status === 'Paid' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger']">
                    {{ fine.fine_status === 'Paid' ? '🟢 ชำระเงินแล้ว' : '🔴 ค้างชำระ (Unpaid)' }}
                  </span>
                </td>
                <td>
                  <small class="text-muted">{{ formatDate(fine.created_at) }}</small>
                </td>
                <td class="text-end">
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary" @click="editFine(fine.fine_id)">
                      <i class="bi bi-pencil-square"></i> แก้ไข
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteFine(fine.fine_id)">
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
                {{ isEditMode ? `📝 แก้ไขข้อมูลค่าปรับ (#${editForm.id})` : '➕ ออกบิลแจ้งค่าปรับใหม่' }}
              </h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body p-4">
              
              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">เลือกรายการยืมหนังสือที่ทำผิดกฎ</label>
                <select v-model.number="editForm.borrow_id" class="form-select" :disabled="isEditMode">
                  <option :value="0" disabled>--- กรุณาเลือกรายการยืม ---</option>
                  <option v-for="borrow in borrowOptions" :key="borrow.id" :value="borrow.id">
                    #{{ borrow.id }} - 👤 {{ borrow.user_name }} | 📘 {{ borrow.book_title }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">จำนวนเงินค่าปรับ (บาท)</label>
                <div class="input-group">
                  <span class="input-group-text">฿</span>
                  <input v-model.number="editForm.amount" type="number" class="form-control" placeholder="0.00" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold text-secondary">สถานะการชำระเงิน</label>
                <select v-model="editForm.fine_status" class="form-select">
                  <option value="Unpaid">🔴 ค้างชำระ (Unpaid)</option>
                  <option value="Paid">🟢 ชำระเงินแล้ว (Paid)</option>
                </select>
              </div>
            </div>
            <div class="modal-footer bg-light border-0">
              <button type="button" class="btn btn-light rounded-3" @click="showModal = false">ยกเลิก</button>
              <button type="button" class="btn btn-warning rounded-3 px-4 text-dark fw-bold" @click="saveFine">
                💾 {{ isEditMode ? 'บันทึกการแก้ไข' : 'ยืนยันการออกบิล' }}
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

interface Fine {
  fine_id: number;
  borrow_id: number;
  amount: number;
  fine_status: string; // 📝 แมปฟิลด์ตรงดีบี
  created_at: string;  // 📝 แมปฟิลด์ตรงดีบี
  user_name?: string;
  book_title?: string;
}

interface BorrowOption {
  id: number;
  user_name: string;
  book_title: string;
}

const fines = ref<Fine[]>([]);
const borrowOptions = ref<BorrowOption[]>([]); 

const loading = ref(true);
const showModal = ref(false);
const isEditMode = ref(false);
const editForm = ref({ id: 0, borrow_id: 0, amount: 0, fine_status: 'Unpaid' });

// 1. ดึงข้อมูลรายการค่าปรับทั้งหมด
const fetchFines = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/fines");
    fines.value = response.data;
  } catch (error) {
    console.error("Error fetching fines:", error);
  }
};

// 2. ดึงข้อมูลประวัติการยืมเพื่อมาทำตัวเลือกผูกคีย์นอกใน Dropdown
const fetchBorrowOptions = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/borrows");
    borrowOptions.value = response.data;
  } catch (error) {
    console.error("Error fetching borrow options:", error);
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  editForm.value = { id: 0, borrow_id: 0, amount: null as any, fine_status: 'Unpaid' };
  showModal.value = true;
};

const editFine = async (id: number) => {
  loading.value = true;
  isEditMode.value = true;
  try {
    const response = await axios.get(`http://localhost:3000/api/fines/${id}`);
    const data = response.data;

    editForm.value = {
      id: data.id,
      borrow_id: data.borrow_id || 0,
      amount: data.amount || 0,
      fine_status: data.fine_status || 'Unpaid'
    };
    showModal.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveFine = async () => {
  if (!editForm.value.borrow_id || !editForm.value.amount || !editForm.value.fine_status) {
    alert("กรุณากรอกข้อมูลและเลือกรายการยืมให้ครบถ้วน");
    return;
  }

  loading.value = true;
  try {
    if (isEditMode.value) {
      await axios.put(`http://localhost:3000/api/fines/${editForm.value.id}`, editForm.value);
      alert("อัปเดตสถานะบิลค่าปรับสำเร็จ!");
    } else {
      await axios.post("http://localhost:3000/api/fines", editForm.value);
      alert("บันทึกออกบิลค่าปรับใหม่เรียบร้อย!");
    }
    showModal.value = false;
    await fetchFines();
  } catch (error) {
    console.error(error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  } finally {
    loading.value = false;
  }
};

const deleteFine = async (id: number) => {
  if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายการค่าปรับรหัส #${id}?`)) {
    loading.value = true;
    try {
      await axios.delete(`http://localhost:3000/api/fines/${id}`);
      await fetchFines();
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "-";
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('th-TH', options);
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchFines(), fetchBorrowOptions()]);
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
  background: linear-gradient(135deg, #d97706, #b45309);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-line {
  width: 70px;
  height: 4px;
  background: #f59e0b;
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