<template>
  <div class="px-6 md:px-12 py-16">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-16 border-b border-neutral-100 pb-10">
        <p class="section-label mb-3">The Journal</p>
        <h1 class="font-display text-5xl md:text-7xl font-light">All Stories</h1>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <div v-else class="text-center py-24">
        <p class="font-display text-3xl text-neutral-300 font-light">The journal is empty.</p>
        <p class="text-neutral-400 text-sm mt-3 font-mono">New stories coming soon.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import PostCard from '@/components/PostCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { getPosts, loading } = useApi()
const posts = ref([])

onMounted(async () => {
  try {
    const data = await getPosts('?status=published')
    posts.value = data.posts || []
  } catch {}
})
</script>
