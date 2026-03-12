<template>
  <div>
    <!-- Hero -->
    <section class="px-6 md:px-12 pt-16 pb-20 border-b border-neutral-100">
      <div class="max-w-5xl mx-auto">
        <p class="section-label mb-3">About</p>
        <h1 class="font-display text-6xl md:text-8xl font-light leading-none">
          The<br/><em>Story</em>
        </h1>
      </div>
    </section>

    <!-- Main content -->
    <section class="px-6 md:px-12 py-20">
      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <!-- Image placeholder -->
        <div class="bg-neutral-100 aspect-[3/4] flex items-center justify-center sticky top-24">
          <span class="font-display text-9xl text-neutral-200 font-light">M</span>
        </div>

        <!-- Text -->
        <div class="space-y-8">
          <div>
            <div class="w-8 h-px bg-[#FF6A00] mb-6"></div>
            <p class="font-display text-3xl font-light leading-relaxed">
              Maison is where fashion meets editorial. A carefully curated space for those who see clothing as more than fabric — as language.
            </p>
          </div>

          <p class="text-neutral-600 leading-relaxed font-light">
            Born from a desire to explore fashion beyond trend reports and seasonal forecasts, Maison is an independent editorial platform dedicated to the intersection of style, culture, and identity. We believe fashion is a form of self-expression, a living art that speaks before words do.
          </p>

          <p class="text-neutral-600 leading-relaxed font-light">
            Each story we publish is chosen with intention — profiles of emerging designers, reflections on cultural movements, explorations of the wardrobes that define generations. We're not chasing trends; we're documenting a conversation that has been happening for centuries.
          </p>

          <p class="text-neutral-600 leading-relaxed font-light">
            Our aesthetic is deliberately restrained. We let the work speak. Clean typography, generous whitespace, and photography that doesn't shout — because the most enduring fashion rarely does.
          </p>

          <div class="border-t border-neutral-100 pt-8">
            <p class="section-label mb-2">Founded</p>
            <p class="font-display text-2xl font-light">Paris, 2024</p>
          </div>

          <div>
            <p class="section-label mb-2">Contributors</p>
            <p class="text-neutral-600 font-light">Writers, photographers, and stylists from across the globe contributing stories that matter.</p>
          </div>

          <RouterLink to="/blog" class="btn-primary inline-block mt-4">
            Read the Journal
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Values section -->
    <section class="border-t border-neutral-100 px-6 md:px-12 py-20 bg-neutral-50">
      <div class="max-w-5xl mx-auto">
        <p class="section-label mb-12">What We Believe</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div v-for="value in values" :key="value.title">
            <div class="w-6 h-px bg-[#FF6A00] mb-4"></div>
            <h3 class="font-display text-2xl font-light mb-3">{{ value.title }}</h3>
            <p class="text-neutral-600 text-sm leading-relaxed font-light">{{ value.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const values = [
  {
    title: 'Intention',
    text: 'Every garment has a story. We seek to uncover the thought behind the design, the culture behind the fabric, the person behind the stitch.'
  },
  {
    title: 'Restraint',
    text: 'Less is not a compromise — it is a statement. We value the quiet confidence of clothing that does not need to scream to be heard.'
  },
  {
    title: 'Longevity',
    text: 'We write about fashion that will matter next decade, not next season. Timeless over trend. Character over novelty.'
  }
]
</script>
