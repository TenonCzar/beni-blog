<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Admin Header -->
    <header class="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="font-display text-2xl font-light">Maison</span>
        <span class="font-mono text-xs text-neutral-400 bg-neutral-100 px-2 py-1">Admin</span>
      </div>
      <div class="flex items-center gap-6">
        <RouterLink to="/" target="_blank" class="font-mono text-xs text-neutral-500 hover:text-[#FF6A00] transition-colors">
          View Site ↗
        </RouterLink>
        <button @click="logout" class="font-mono text-xs text-neutral-500 hover:text-red-500 transition-colors">
          Sign Out
        </button>
      </div>
    </header>

    <div class="px-8 py-10 max-w-5xl mx-auto">
      <!-- Title + New post -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <p class="section-label mb-1">Dashboard</p>
          <h1 class="font-display text-4xl font-light">All Posts</h1>
        </div>
        <RouterLink to="/admin/posts/new" class="btn-primary">
          + New Post
        </RouterLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-white border border-neutral-200 p-6">
          <p class="font-mono text-xs text-neutral-400 mb-1">Total Posts</p>
          <p class="font-display text-4xl font-light">{{ posts.length }}</p>
        </div>
        <div class="bg-white border border-neutral-200 p-6">
          <p class="font-mono text-xs text-neutral-400 mb-1">Published</p>
          <p class="font-display text-4xl font-light text-[#FF6A00]">{{ published }}</p>
        </div>
        <div class="bg-white border border-neutral-200 p-6">
          <p class="font-mono text-xs text-neutral-400 mb-1">Drafts</p>
          <p class="font-display text-4xl font-light text-neutral-400">{{ drafts }}</p>
        </div>
      </div>

      <!-- Posts table -->
      <div class="bg-white border border-neutral-200">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="!posts.length" class="py-16 text-center">
          <p class="font-display text-2xl text-neutral-300 font-light">No posts yet.</p>
          <RouterLink to="/admin/posts/new" class="btn-primary inline-block mt-6">Create your first post</RouterLink>
        </div>
        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-neutral-100">
              <th class="text-left font-mono text-xs text-neutral-400 uppercase tracking-widest px-6 py-4">Title</th>
              <th class="text-left font-mono text-xs text-neutral-400 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Author</th>
              <th class="text-left font-mono text-xs text-neutral-400 uppercase tracking-widest px-6 py-4 hidden md:table-cell">Date</th>
              <th class="text-left font-mono text-xs text-neutral-400 uppercase tracking-widest px-6 py-4">Status</th>
              <th class="text-right font-mono text-xs text-neutral-400 uppercase tracking-widest px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id" class="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-body font-medium text-sm">{{ post.title }}</p>
                <p class="font-mono text-xs text-neutral-400 mt-0.5">/blog/{{ post.slug }}</p>
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-sm text-neutral-600">{{ post.author }}</td>
              <td class="px-6 py-4 hidden md:table-cell font-mono text-xs text-neutral-400">{{ formatDate(post.created_at) }}</td>
              <td class="px-6 py-4">
                <span :class="['font-mono text-xs px-2 py-1', post.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500']">
                  {{ post.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-4">
                  <RouterLink :to="`/admin/posts/${post.id}/edit`" class="font-mono text-xs text-neutral-500 hover:text-[#FF6A00] transition-colors">Edit</RouterLink>
                  <button @click="confirmDelete(post)" class="font-mono text-xs text-neutral-500 hover:text-red-500 transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete confirm dialog -->
    <Transition name="fade">
      <div v-if="deleteTarget" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
        <div class="bg-white p-8 max-w-sm w-full border border-neutral-200">
          <h3 class="font-display text-2xl font-light mb-2">Delete Post?</h3>
          <p class="text-sm text-neutral-600 mb-6">Are you sure you want to delete <strong>"{{ deleteTarget.title }}"</strong>? This cannot be undone.</p>
          <div class="flex gap-4">
            <button @click="doDelete" class="flex-1 bg-red-500 text-white font-mono text-xs tracking-widest uppercase py-3 hover:bg-red-600 transition-colors">Delete</button>
            <button @click="deleteTarget = null" class="flex-1 btn-outline">Cancel</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { getPosts, deletePost, loading } = useApi()
const { logout } = useAuth()

const posts = ref([])
const deleteTarget = ref(null)

const published = computed(() => posts.value.filter(p => p.status === 'published').length)
const drafts = computed(() => posts.value.filter(p => p.status === 'draft').length)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function load() {
  try {
    const data = await getPosts()
    posts.value = data.posts || []
  } catch {}
}

function confirmDelete(post) { deleteTarget.value = post }

async function doDelete() {
  if (!deleteTarget.value) return
  try {
    await deletePost(deleteTarget.value.id)
    posts.value = posts.value.filter(p => p.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch {}
}

onMounted(load)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
