import { create } from 'zustand'

const _savedUser = () => {
  try { return JSON.parse(localStorage.getItem('authUser')) } catch { return null }
}

export const useAuthStore = create((set) => ({
  user: _savedUser(),
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setUser: (user) => {
    localStorage.setItem('authUser', JSON.stringify(user))
    set({ user })
  },
  setToken: (token) => {
    localStorage.setItem('accessToken', token)
    set({ token, isAuthenticated: !!token })
  },
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

export const useUMKMStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))

export const useProcurementStore = create((set) => ({
  requests: [],
  groups: [],
  currentRequest: null,
  currentGroup: null,
  loading: false,

  setRequests: (requests) => set({ requests }),
  setGroups: (groups) => set({ groups }),
  setCurrentRequest: (request) => set({ currentRequest: request }),
  setCurrentGroup: (group) => set({ currentGroup: group }),
  setLoading: (loading) => set({ loading }),
}))

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({ 
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length 
  }),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
}))

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',
  language: localStorage.getItem('language') || 'id',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    set({ theme })
  },
  setLanguage: (language) => {
    localStorage.setItem('language', language)
    set({ language })
  },
}))
