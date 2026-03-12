import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/pages/HomePage.vue') },
      { path: 'blog', name: 'blog', component: () => import('@/pages/BlogPage.vue') },
      { path: 'blog/:slug', name: 'post', component: () => import('@/pages/PostPage.vue') },
      { path: 'about', name: 'about', component: () => import('@/pages/AboutPage.vue') }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: '', name: 'admin-login', component: () => import('@/pages/admin/AdminLogin.vue') },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'posts/new',
        name: 'admin-new-post',
        component: () => import('@/pages/admin/AdminPostEditor.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'posts/:id/edit',
        name: 'admin-edit-post',
        component: () => import('@/pages/admin/AdminPostEditor.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// Auth guard
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = sessionStorage.getItem('admin_token')
    if (!token) {
      return { name: 'admin-login' }
    }
  }
})

export default router
