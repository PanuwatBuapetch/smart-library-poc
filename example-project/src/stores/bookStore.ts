import { defineStore } from 'pinia';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author?: string;
  status: string;
}

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [] as Book[],
    loading: false,
  }),
  actions: {
    async fetchBooks() {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:3000/api/books');
        this.books = res.data;
      } finally {
        this.loading = false;
      }
    },
    async deleteBook(id: number) {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      this.fetchBooks();
    }
  }
});