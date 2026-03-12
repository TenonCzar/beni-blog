<template>
  <div>
    <!-- Hero -->
    <section class="px-6 md:px-12 pt-16 pb-20 border-b border-neutral-100">
      <div class="max-w-5xl mx-auto">
        <p class="section-label mb-4">Latest Issue</p>
        <div v-if="loading"><LoadingSpinner /></div>
        <div v-else-if="featured" class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Featured image -->
          <RouterLink :to="`/blog/${featured.slug}`" class="block overflow-hidden bg-neutral-100 aspect-square group">
            <img
              v-if="featured.cover_image"
              :src="featured.cover_image"
              :alt="featured.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="font-display text-9xl text-neutral-200 font-light">M</span>
            </div>
          </RouterLink>

          <!-- Featured content -->
          <div class="space-y-6">
            <div>
              <p class="section-label mb-2">Featured</p>
              <div class="w-8 h-px bg-[#FF6A00] mb-6"></div>
            </div>
            <RouterLink :to="`/blog/${featured.slug}`">
              <h2 class="font-display text-4xl md:text-5xl font-light leading-tight hover:text-[#FF6A00] transition-colors">
                {{ featured.title }}
              </h2>
            </RouterLink>
            <p class="text-neutral-600 font-light leading-relaxed">{{ featured.excerpt }}</p>
            <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div>
                <p class="font-mono text-xs text-neutral-400">by {{ featured.author }}</p>
                <p class="font-mono text-xs text-neutral-400">{{ formatDate(featured.created_at) }}</p>
              </div>
              <RouterLink :to="`/blog/${featured.slug}`" class="btn-primary">
                Read Article
              </RouterLink>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-16">
          <p class="font-display text-2xl text-neutral-300 font-light">No posts yet. Check back soon.</p>
        </div>
      </div>
    </section>

    <!-- Recent Posts Grid -->
    <section class="px-6 md:px-12 py-20">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-12">
          <div>
            <p class="section-label mb-2">Recent Posts</p>
            <div class="w-8 h-px bg-neutral-200"></div>
          </div>
          <RouterLink to="/blog" class="btn-ghost flex items-center gap-2">
            View All <span>→</span>
          </RouterLink>
        </div>

        <div v-if="loading"><LoadingSpinner /></div>
        <div v-else-if="recent.length" class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <PostCard v-for="post in recent" :key="post.id" :post="post" />
        </div>
        <p v-else class="text-neutral-400 text-sm font-mono">No articles published yet.</p>
      </div>
    </section>

    <!-- Masthead Banner -->
    <section class="border-t border-b border-neutral-100 py-16 px-6 md:px-12 bg-neutral-50">
      <div class="max-w-2xl mx-auto text-center space-y-4">
        <p class="section-label">The Maison Edit</p>
        <h3 class="font-display text-3xl font-light">
          Fashion is not something that exists in dresses only.<br/>
          <em>Fashion is in the sky, in the street.</em>
        </h3>
        <p class="font-mono text-xs text-neutral-400">— Coco Chanel</p>
        <div class="pt-6">
          <RouterLink to="/blog" class="btn-primary inline-block">Explore the Journal</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useApi } from '@/composables/useApi'
import PostCard from '@/components/PostCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { getPosts, loading } = useApi()
const posts = ref([])

const featured = computed(() => posts.value[0] || null)
const recent = computed(() => posts.value.slice(1, 4))

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  try {
    const data = await getPosts('?status=published')
    posts.value = data.posts || []
  } catch {}
})
</script>
