<template>
  <article class="group">
    <RouterLink :to="`/blog/${post.slug}`">
      <!-- Cover image -->
      <div class="overflow-hidden bg-neutral-100 aspect-[4/3] mb-5">
        <img
          v-if="post.cover_image"
          :src="post.cover_image"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <span class="font-display text-6xl text-neutral-200 font-light">M</span>
        </div>
      </div>

      <!-- Meta -->
      <div class="space-y-2">
        <p class="section-label">{{ formatDate(post.created_at) }}</p>
        <h2 class="post-card-title">{{ post.title }}</h2>
        <p class="text-neutral-500 text-sm font-light leading-relaxed line-clamp-2">{{ post.excerpt }}</p>
        <div class="flex items-center gap-2 pt-1">
          <span class="text-xs text-neutral-400 font-mono">by {{ post.author }}</span>
          <span class="text-neutral-200">—</span>
          <span class="text-xs text-[#FF6A00] font-mono group-hover:underline">Read more</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  post: { type: Object, required: true }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
