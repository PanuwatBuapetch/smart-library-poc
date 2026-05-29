import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', role: 'Librarian' },
      { id: 3, name: 'Somchai Jaidee', email: 'somchai.j@example.com', role: 'Member' }
    ] as User[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    // ฟังก์ชันดึงข้อมูลจริงจาก API (สำหรับใช้เวลาเชื่อมต่อ Backend หลังบ้าน)
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('http://localhost:3000/api/users')
        this.users = response.data
      } catch (err) {
        console.error('Fetch users failed, using mock data instead.')
        // หากต่อ API ไม่ติด จะยังคงมี Mock data แสดงอยู่ ไม่พัง
      } finally {
        this.loading = false
      }
    }
  }
})