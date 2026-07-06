import apiClient from './client'

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  updatePassword: (data) => apiClient.put('/auth/password', data),
}

// Procurement APIs
export const procurementAPI = {
  createRequest: (data) => apiClient.post('/procurement/request', data),
  getMyRequests: (page = 1, limit = 20) => apiClient.get('/procurement/requests/my', { params: { page, limit } }),
}

// Vendor APIs
export const vendorAPI = {
  list: (params = {}) => apiClient.get('/vendors/', { params }),
  getDetails: (vendorId) => apiClient.get(`/vendors/${vendorId}`),
}

// Matching APIs
export const matchingAPI = {
  match: (data) => apiClient.post('/matching/groups/match', data),
  joinGroup: (data) => apiClient.post('/matching/groups/join', data),
  batchOptimize: (data) => apiClient.post('/matching/batch-optimize', data),
}

// Transaction APIs
export const transactionAPI = {
  getMy: () => apiClient.get('/transactions/my'),
}

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getCreditTrail: () => apiClient.get('/analytics/credit-trail'),
  getForecast: (category, horizonWeeks = 4) =>
    apiClient.get('/analytics/forecast', { params: { product_category: category, horizon_weeks: horizonWeeks } }),
}

// Consultation APIs
export const consultationAPI = {
  ask: (question) => apiClient.post('/consultation/ask', { question }),
  topics: () => apiClient.get('/consultation/topics'),
}

// Notification APIs
export const notificationAPI = {
  list: (unread = false, limit = 20) => apiClient.get('/notification/list', { params: { unread, limit } }),
  markAsRead: (notificationId) => apiClient.put(`/notification/${notificationId}/read`),
  markAllRead: () => apiClient.put('/notification/read-all'),
}
