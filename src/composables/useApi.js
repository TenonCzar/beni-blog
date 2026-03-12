import { ref } from 'vue'

const BASE = '/.netlify/functions'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  function authHeaders() {
    const token = sessionStorage.getItem('admin_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function request(path, options = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
        ...options
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    getPosts: (params = '') => request(`/getPosts${params}`),
    getPost: (slug) => request(`/getPost?slug=${slug}`),
    login: (body) => request('/login', { method: 'POST', body: JSON.stringify(body) }),
    createPost: (body) => request('/createPost', { method: 'POST', body: JSON.stringify(body) }),
    updatePost: (id, body) => request(`/updatePost?id=${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deletePost: (id) => request(`/deletePost?id=${id}`, { method: 'DELETE' })
  }
}
