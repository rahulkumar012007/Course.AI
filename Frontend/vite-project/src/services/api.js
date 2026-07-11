import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Har request mein token lagao automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth APIs
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Document APIs
export const uploadDocument = (formData) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const getDocuments = () => API.get('/upload')
export const getDocument = (id) => API.get(`/upload/${id}`)

// Chat APIs
export const sendMessage = (data) => API.post('/chat/message', data)
export const getChatHistory = (docId) => API.get(`/chat/history/${docId}`)

// Quiz APIs
export const generateQuiz = (docId) => API.get(`/quiz/${docId}`)