<template>
  <div>
    <LoadingSpinner v-if="loading" />

    <div v-else-if="post">
      <!-- Hero image -->
      <div v-if="post.cover_image" class="w-full bg-neutral-100 max-h-[70vh] overflow-hidden">
        <img :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover max-h-[70vh]" />
      </div>

      <!-- Content -->
      <article class="px-6 md:px-12 py-16 max-w-3xl mx-auto">
        <!-- Breadcrumb -->
        <div class="mb-10">
          <RouterLink to="/blog"
            class="font-mono text-xs text-neutral-400 hover:text-[#FF6A00] transition-colors tracking-widest uppercase">
            ← Back to Journal
          </RouterLink>
        </div>

        <!-- Meta -->
        <header class="mb-12 border-b border-neutral-100 pb-10">
          <p class="section-label mb-4">{{ formatDate(post.created_at) }}</p>
          <h1 class="font-display text-4xl md:text-6xl font-light leading-tight mb-6">
            {{ post.title }}
          </h1>
          <p class="text-neutral-600 text-xl font-display font-light italic mb-6">{{ post.excerpt }}</p>
          <div class="flex items-center gap-3">
            <div class="w-6 h-px bg-[#FF6A00]"></div>
            <span class="font-mono text-xs text-neutral-500">by {{ post.author }}</span>
          </div>
        </header>

        <!-- Body -->
        <div
          class="prose prose-neutral lg:prose-lg max-w-none prose-headings:font-display prose-headings:font-light prose-p:text-neutral-700 prose-p:leading-relaxed"
          v-html="renderedContent"></div>

        <!-- Footer -->
        <div class="mt-16 pt-10 border-t border-neutral-100 flex items-center justify-between">
          <RouterLink to="/blog" class="btn-ghost">← More Stories</RouterLink>
          <span class="font-display text-2xl font-light text-neutral-200">Maison</span>
        </div>
      </article>
    </div>

    <div v-else class="text-center py-32 px-6">
      <p class="font-display text-3xl text-neutral-300 font-light">Article not found.</p>
      <RouterLink to="/blog" class="btn-primary inline-block mt-8">Back to Journal</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { marked } from 'marked'
import { useApi } from '@/composables/useApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const { getPost, loading } = useApi()
const post = ref(null)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return marked.parse(post.value.content)
})

useHead(computed(() => ({
  title: post.value ? `${post.value.title} — Maison` : 'Maison',
  meta: [{ name: 'description', content: post.value?.excerpt || '' }]
})))

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const data = await getPost(route.params.slug)
    post.value = data.post || null
  } catch { }
})
</script>