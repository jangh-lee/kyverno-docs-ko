import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { z } from 'astro/zod'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // 원본 문서가 쓰는 excerpt 필드를 그대로 허용합니다.
    schema: docsSchema({ extend: z.object({ excerpt: z.string().optional() }) }),
  }),
}
