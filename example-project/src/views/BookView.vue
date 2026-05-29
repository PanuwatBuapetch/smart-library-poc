<template>
  <div class="container-fluid py-4 px-4">
    <header class="text-center mb-5 header-section">
      <h1 class="display-5 fw-bold text-gradient mb-3">📚 Smart Library System</h1>
      <p class="text-muted fs-5">ระบบจัดการทรัพยากรห้องสมุดอัจฉริยะ</p>
      <div class="header-line"></div>
    </header>

    <div class="action-bar d-flex justify-content-between align-items-center mb-4">
      <div class="fw-semibold text-secondary">
        หนังสือทั้งหมด {{ books.length }} รายการ
      </div>
      <div class="d-flex gap-2">
        <RouterLink to="/users" class="btn btn-user-shortcut">
          👥 จัดการสมาชิก
        </RouterLink>
        <button class="btn btn-add d-flex align-items-center gap-2" @click="showModal = true">
          <span>➕</span> เพิ่มหนังสือใหม่
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-wrapper">
      <div class="spinner-custom"></div>
      <p class="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="books.length === 0" class="empty-wrapper">
      <div class="empty-card text-center">
        <div class="fs-1">📂</div>
        <p class="text-muted mt-3 mb-0">ไม่พบข้อมูลหนังสือในระบบ</p>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="book in books" :key="book.id" class="col-md-6 col-lg-4">
        <div class="card book-card h-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title fw-bold text-dark text-truncate-2">{{ book.title }}</h5>
                <span class="status-badge" :class="book.status === 'Available' ? 'status-available' : 'status-borrowed'">
                  {{ book.status }}
                </span>
              </div>
              <p class="text-secondary mb-0">
                <span class="text-muted">ผู้เขียน:</span> {{ book.author || 'ไม่ระบุ' }}
              </p>
            </div>
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-view flex-grow-1" @click="Detail(book)">📖 รายละเอียด</button>
              <button class="btn btn-delete" @click="deleteBook(book.id)">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal || showModalDetail" class="custom-backdrop fade-in"></div>

      <div v-if="showModal" class="custom-modal-wrapper fade-in">
        <div class="custom-modal-card">
          <div class="modal-header-custom">
            <h5 class="fw-bold mb-0">✨ เพิ่มหนังสือใหม่</h5>
            <button class="btn-close-custom" @click="showModal = false">×</button>
          </div>
          <div class="modal-body-custom">
            <div class="mb-3">
              <label class="form-label-custom">ชื่อหนังสือ</label>
              <input v-model="newBook.title" type="text" class="form-control-custom" placeholder="กรอกชื่อหนังสือ" />
            </div>
            <div class="mb-3">
              <label class="form-label-custom">ผู้เขียน</label>
              <input v-model="newBook.author" type="text" class="form-control-custom" placeholder="กรอกชื่อผู้เขียน" />
            </div>
            <div class="mb-4">
              <label class="form-label-custom">สถานะ</label>
              <select v-model="newBook.status" class="form-control-custom">
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-secondary-custom" @click="showModal = false">ยกเลิก</button>
              <button class="btn btn-primary-custom" @click="confirmAdd">💾 บันทึก</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModalDetail" class="custom-modal-wrapper fade-in">
        <div class="custom-modal-card">
          <div class="modal-header-custom warning">
            <h5 class="fw-bold mb-0">📖 รายละเอียดหนังสือ</h5>
            <button class="btn-close-custom" @click="showModalDetail = false">×</button>
          </div>
          <div class="modal-body-custom">
            <div class="mb-3">
              <label class="form-label-custom">ชื่อหนังสือ</label>
              <input v-model="showDetail.title" type="text" class="form-control-custom" />
            </div>
            <div class="mb-3">
              <label class="form-label-custom">ผู้เขียน</label>
              <input v-model="showDetail.author" type="text" class="form-control-custom" />
            </div>
            <div class="mb-4">
              <label class="form-label-custom">สถานะ</label>
              <select v-model="showDetail.status" class="form-control-custom">
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-secondary-custom" @click="showModalDetail = false">ปิด</button>
              <button class="btn btn-warning-custom" @click="confirmUpdate">✏️ อัปเดต</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Book {
  id: number
  title: string
  author?: string
  status: string
}

const books = ref<Book[]>([])
const loading = ref(true)
const showModal = ref(false)
const showModalDetail = ref(false)

const newBook = ref({ title: '', author: '', status: 'Available' })
const showDetail = ref({ id: 0, title: '', author: '', status: 'Available' })

const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:3000/api/books')
    books.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const Detail = (book: Book) => {
  showDetail.value = {
    id: book.id,
    title: book.title,
    author: book.author || '',
    status: book.status
  }
  showModalDetail.value = true
}

const confirmAdd = async () => {
  if (!newBook.value.title.trim()) return alert('กรุณากรอกชื่อหนังสือ')
  try {
    await axios.post('http://localhost:3000/api/books', newBook.value)
    showModal.value = false
    newBook.value = { title: '', author: '', status: 'Available' }
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const confirmUpdate = async () => {
  try {
    await axios.put(`http://localhost:3000/api/books/${showDetail.value.id}`, showDetail.value)
    showModalDetail.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const deleteBook = async (id: number) => {
  if (!confirm('คุณต้องการลบหนังสือใช่หรือไม่?')) return
  try {
    await axios.delete(`http://localhost:3000/api/books/${id}`)
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* คัดลอก CSS ทั้งหมดที่คุณเคยเขียนเกี่ยวกับหน้าหนังสือมาแปะไว้ตรงนี้ได้เลยครับ */
/* และเพิ่ม CSS สำหรับปุ่มลัดด้านล่างนี้เข้าไป */
.btn-user-shortcut {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: .8rem 1.3rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.25s;
}
.btn-user-shortcut:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}
/* ... สไตล์เดิมที่คุณเขียนไว้คงอยู่ทั้งหมด ... */
.header-section { background: rgba(255,255,255,.7); backdrop-filter: blur(12px); border-radius: 24px; padding: 3rem 2rem; border: 1px solid rgba(255,255,255,.4); box-shadow: 0 8px 32px rgba(15,23,42,.06); }
.text-gradient { background: linear-gradient(135deg, #1e3c72, #2a5298); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.header-line { width: 70px; height: 4px; background: #2563eb; margin: 1rem auto 0; border-radius: 999px; }
.action-bar { background: white; padding: 1rem 1.5rem; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.03); }
.book-card { border: none; border-radius: 20px; overflow: hidden; background: white; transition: all .3s ease; box-shadow: 0 4px 20px rgba(0,0,0,.04); }
.book-card:hover { transform: translateY(-6px); box-shadow: 0 16px 32px rgba(37,99,235,.12); }
.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.status-badge { padding: .4rem .8rem; border-radius: 999px; font-size: .75rem; font-weight: 700; }
.status-available { background: #dcfce7; color: #15803d; }
.status-borrowed { background: #fee2e2; color: #b91c1c; }
.btn-add { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 12px; padding: .8rem 1.3rem; font-weight: 600; transition: .25s; }
.btn-add:hover { transform: translateY(-2px); }
.btn-view { background: #eff6ff; color: #2563eb; border: none; border-radius: 10px; }
.btn-delete { background: #fef2f2; border: none; border-radius: 10px; }
.loading-wrapper, .empty-wrapper { display: flex; justify-content: center; align-items: center; min-height: 300px; flex-direction: column; }
.spinner-custom { width: 48px; height: 48px; border: 4px solid #dbeafe; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-card { background: white; padding: 3rem; border-radius: 20px; }
.custom-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 1000; }
.custom-modal-wrapper { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; max-width: 500px; padding: 1rem; z-index: 1001; }
.custom-modal-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,.15); }
.modal-header-custom { padding: 1.2rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
.modal-header-custom.warning { background: #fef3c7; }
.modal-body-custom { padding: 1.5rem; }
.btn-close-custom { background: transparent; border: none; font-size: 1.6rem; }
.form-label-custom { display: block; margin-bottom: .5rem; font-weight: 600; }
.form-control-custom { width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: .8rem 1rem; background: #f8fafc; }
.form-control-custom:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.12); }
.btn-primary-custom, .btn-warning-custom, .btn-secondary-custom { border: none; border-radius: 10px; padding: .7rem 1.2rem; font-weight: 600; }
.btn-primary-custom { background: #2563eb; color: white; }
.btn-warning-custom { background: #d97706; color: white; }
.btn-secondary-custom { background: #e2e8f0; }
.fade-in { animation: modalFade .2s ease; }
@keyframes modalFade { from { opacity: 0; transform: translate(-50%, -48%) scale(.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
</style>