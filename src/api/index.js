import axios from 'axios'

const BASE = 'https://webcasting.ir'

const api = axios.create({ baseURL: BASE })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const auth = {
  login: (email, password) => api.post('/api/v1/auth/login', { email, password }),
  me: () => api.get('/api/v1/auth/me'),
}

export const sites = {
  getAll: () => api.get('/api/v1/settings/sites'),
  update: (id, data) => api.put(`/api/v1/settings/sites/${id}`, data),
}

export const blog = {
  getPosts: (siteId, params) => api.get(`/api/v1/sites/${siteId}/blog/admin/posts`, { params }),
  createPost: (siteId, data) => api.post(`/api/v1/sites/${siteId}/blog/admin/posts`, data),
  updatePost: (siteId, id, data) => api.put(`/api/v1/sites/${siteId}/blog/admin/posts/${id}`, data),
  deletePost: (siteId, id) => api.delete(`/api/v1/sites/${siteId}/blog/admin/posts/${id}`),
  getCategories: (siteId) => api.get(`/api/v1/sites/${siteId}/blog/categories`),
  createCategory: (siteId, data) => api.post(`/api/v1/sites/${siteId}/blog/admin/categories`, data),
  getComments: (params) => api.get(`/api/v1/sites/blog/admin/comments`, { params }),
}

export const pages = {
  getAll: (siteId) => api.get(`/api/v1/sites/${siteId}/pages/admin/all`),
  create: (siteId, data) => api.post(`/api/v1/sites/${siteId}/pages/admin`, data),
  update: (siteId, id, data) => api.put(`/api/v1/sites/${siteId}/pages/admin/${id}`, data),
  delete: (siteId, id) => api.delete(`/api/v1/sites/${siteId}/pages/admin/${id}`),
}

export const media = {
  getAll: (siteId) => api.get(`/api/v1/media/${siteId}`),
  upload: (siteId, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/api/v1/media/upload/${siteId}`, fd)
  },
  delete: (siteId, id) => api.delete(`/api/v1/media/${siteId}/${id}`),
}

export const contacts = {
  getAll: (siteId) => api.get(`/api/v1/webcasting/admin/messages`, { params: { siteId } }),
  reply: (id, reply) => api.put(`/api/v1/webcasting/admin/messages/${id}/reply`, { reply }),
}

export const users = {
  getAll: (siteId) => api.get('/api/v1/users', { params: { siteId } }),
  create: (data) => api.post('/api/v1/users', data),
  update: (id, data) => api.put(`/api/v1/users/${id}`, data),
  remove: (id) => api.delete(`/api/v1/users/${id}`),
}

export default api
