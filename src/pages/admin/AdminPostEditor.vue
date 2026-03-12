<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Admin Header -->
    <header class="bg-white border-b border-neutral-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <RouterLink to="/admin/dashboard" class="font-mono text-xs text-neutral-500 hover:text-[#FF6A00] transition-colors">
          ← Dashboard
        </RouterLink>
        <span class="text-neutral-200">|</span>
        <span class="font-mono text-xs text-neutral-500">{{ isEditing ? 'Edit Post' : 'New Post' }}</span>
      </div>
      <div class="flex items-center gap-3">
        <button @click="save('draft')" :disabled="saving" class="btn-outline text-xs py-2 px-4">
          Save Draft
        </button>
        <button @click="save('published')" :disabled="saving" class="btn-primary text-xs py-2 px-4 flex items-center gap-2">
          <span v-if="saving" class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
          {{ saving ? 'Saving...' : 'Publish' }}
        </button>
      </div>
    </header>

    <div class="px-8 py-10 max-w-4xl mx-auto">
      <p v-if="saveError" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6 font-mono">{{ saveError }}</p>
      <p v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 font-mono">Post saved successfully!</p>

      <LoadingSpinner v-if="loading" />

      <div v-else class="space-y-8">
        <!-- Title -->
        <div>
          <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Title *</label>
          <input
            v-model="form.title"
            @input="autoSlug"
            type="text"
            placeholder="Article title..."
            class="w-full border border-neutral-200 bg-white px-4 py-4 font-display text-3xl font-light focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Slug *</label>
          <div class="flex items-center border border-neutral-200 bg-white">
            <span class="px-4 py-3 font-mono text-xs text-neutral-400 border-r border-neutral-200 bg-neutral-50">/blog/</span>
            <input
              v-model="form.slug"
              type="text"
              placeholder="article-slug"
              class="flex-1 px-4 py-3 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Author -->
          <div>
            <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Author *</label>
            <input
              v-model="form.author"
              type="text"
              placeholder="Author name"
              class="w-full border border-neutral-200 bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>

          <!-- Cover image URL -->
          <div>
            <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Cover Image URL</label>
            <input
              v-model="form.cover_image"
              type="url"
              placeholder="https://..."
              class="w-full border border-neutral-200 bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF6A00] transition-colors"
            />
          </div>
        </div>

        <!-- Cover preview -->
        <div v-if="form.cover_image" class="bg-neutral-100 aspect-video overflow-hidden max-h-64">
          <img :src="form.cover_image" alt="Cover preview" class="w-full h-full object-cover" @error="form.cover_image = ''" />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block font-mono text-xs tracking-widest uppercase text-neutral-500 mb-2">Excerpt *</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="A brief summary of the article..."
            class="w-full border border-neutral-200 bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#FF6A00] transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Content editor -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="font-mono text-xs tracking-widest uppercase text-neutral-500">Content (Markdown) *</label>
            <button @click="previewMode = !previewMode" class="font-mono text-xs text-neutral-400 hover:text-[#FF6A00] transition-colors">
              {{ previewMode ? '← Edit' : 'Preview →' }}
            </button>
          </div>

          <div v-if="!previewMode">
            <div class="border border-neutral-200 bg-neutral-50 px-3 py-2 flex gap-3 flex-wrap">
              <button
                v-for="tool in editorTools"
                :key="tool.label"
                @click="insertMarkdown(tool.before, tool.after)"
                class="font-mono text-xs text-neutral-500 hover:text-[#FF6A00] transition-colors px-1"
              >{{ tool.label }}</button>
            </div>
            <textarea
              ref="editorRef"
              v-model="form.content"
              rows="20"
              placeholder="Write your article in Markdown..."
              class="w-full border border-neutral-200 border-t-0 bg-white px-4 py-4 font-mono text-sm focus:outline-none focus:border-[#FF6A00] transition-colors resize-none leading-relaxed"
            ></textarea>
          </div>

          <div
            v-else
            class="prose prose-neutral max-w-none border border-neutral-200 bg-white px-8 py-8 min-h-64"
            v-html="renderedPreview"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { marked } from 'marked'
import { useApi } from '@/composables/useApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { getPost, createPost, updatePost, loading } = useApi()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)
const previewMode = ref(false)
const editorRef = ref(null)

const form = reactive({
  title: '',
  slug: '',
  author: '',
  cover_image: '',
  excerpt: '',
  content: ''
})

const renderedPreview = computed(() => marked.parse(form.content || ''))

const editorTools = [
  { label: 'B', before: '**', after: '**' },
  { label: 'I', before: '_', after: '_' },
  { label: 'H2', before: '## ', after: '' },
  { label: 'H3', before: '### ', after: '' },
  { label: 'Link', before: '[', after: '](url)' },
  { label: 'Quote', before: '> ', after: '' },
  { label: 'Code', before: '`', after: '`' },
]

function autoSlug() {
  if (!isEditing.value) {
    form.slug = form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  }
}

function insertMarkdown(before, after) {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = form.content.substring(start, end)
  form.content = form.content.substring(0, start) + before + selected + after + form.content.substring(end)
  const newPos = start + before.length + selected.length + after.length
  el.focus()
  setTimeout(() => el.setSelectionRange(newPos, newPos), 0)
}

async function save(status) {
  saveError.value = ''
  saveSuccess.value = false
  saving.value = true
  try {
    const payload = { ...form, status }
    if (isEditing.value) {
      await updatePost(route.params.id, payload)
    } else {
      await createPost(payload)
    }
    saveSuccess.value = true
    setTimeout(() => {
      router.push({ name: 'admin-dashboard' })
    }, 800)
  } catch (e) {
    saveError.value = e.message
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      // Fetch by ID from admin endpoint
      const data = await getPost(route.params.id)
      const p = data.post
      if (p) {
        form.title = p.title
        form.slug = p.slug
        form.author = p.author
        form.cover_image = p.cover_image || ''
        form.excerpt = p.excerpt
        form.content = p.content
      }
    } catch {}
  }
})
</script>
