import apiClient from './client'

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refresh_token: refreshToken }),
}

// UMKM APIs
export const umkmAPI = {
  register: (data) => apiClient.post('/umkm', data),
  getProfile: () => apiClient.get('/umkm/me'),
  updateProfile: (data) => apiClient.put('/umkm/me', data),
  getDetails: (umkmId) => apiClient.get(`/umkm/${umkmId}`),
}

// Procurement APIs
export const procurementAPI = {
  createRequest: (data) => apiClient.post('/procurement/request', data),
  getRequest: (requestId) => apiClient.get(`/procurement/request/${requestId}`),
  updateRequest: (requestId, data) => apiClient.put(`/procurement/request/${requestId}`, data),
  cancelRequest: (requestId) => apiClient.delete(`/procurement/request/${requestId}`),
  getMyRequests: (page = 1, limit = 20) => apiClient.get('/procurement/requests/my', { params: { page, limit } }),
  getActiveRequests: (page = 1, limit = 20) => apiClient.get('/procurement/requests/active', { params: { page, limit } }),
}

// Procurement Group APIs
export const groupAPI = {
  createGroup: (data) => apiClient.post('/procurement/group', data),
  getGroup: (groupId) => apiClient.get(`/procurement/group/${groupId}`),
  updateGroup: (groupId, data) => apiClient.put(`/procurement/group/${groupId}`, data),
  addMember: (groupId, data) => apiClient.post(`/procurement/group/${groupId}/members`, data),
  removeMember: (groupId, umkmId) => apiClient.delete(`/procurement/group/${groupId}/members/${umkmId}`),
  getMembers: (groupId) => apiClient.get(`/procurement/group/${groupId}/members`),
  getMyGroups: () => apiClient.get('/procurement/groups/my'),
}

// Vendor APIs
export const vendorAPI = {
  list: (page = 1, limit = 20, filters = {}) => apiClient.get('/vendor/list', { params: { page, limit, ...filters } }),
  getDetails: (vendorId) => apiClient.get(`/vendor/${vendorId}`),
  search: (query) => apiClient.get('/vendor/search', { params: { q: query } }),
}

// Matching APIs
export const matchingAPI = {
  getVendorSuggestions: (requestId) => apiClient.get(`/matching/vendors/${requestId}`),
  getSimilarRequests: (requestId) => apiClient.get(`/matching/requests/${requestId}`),
  getGroupSuggestions: (requestId) => apiClient.get(`/matching/groups/${requestId}`),
}

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => apiClient.post('/payment/order', data),
  getTransaction: (transactionId) => apiClient.get(`/transaction/${transactionId}`),
  getHistory: (page = 1, limit = 20) => apiClient.get('/transaction/history', { params: { page, limit } }),
  getInvoice: (transactionId) => apiClient.get(`/transaction/${transactionId}/invoice`),
}

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getCreditTrail: () => apiClient.get('/analytics/credit-trail'),
  getCreditScore: () => apiClient.get('/analytics/credit-score/me'),
  getSavings: () => apiClient.get('/analytics/savings'),
  getTrends: () => apiClient.get('/analytics/trends'),
}

// Notification APIs
export const notificationAPI = {
  list: (unread = false, limit = 20) => apiClient.get('/notification/list', { params: { unread, limit } }),
  markAsRead: (notificationId) => apiClient.put(`/notification/${notificationId}/read`),
  updatePreferences: (data) => apiClient.put('/notification/preferences', data),
}
