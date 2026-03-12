import { ref, readonly } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(!!sessionStorage.getItem('admin_token'))

export function useAuth() {
  const router = useRouter()

  function setToken(token) {
    sessionStorage.setItem('admin_token', token)
    isAuthenticated.value = true
  }

  function logout() {
    sessionStorage.removeItem('admin_token')
    isAuthenticated.value = false
    router.push({ name: 'admin-login' })
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    setToken,
    logout
  }
}
