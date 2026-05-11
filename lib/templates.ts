export type TemplateId = 'navy' | 'midnight' | 'forest' | 'sunset' | 'minimal'

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
  /** preview swatches shown in the picker */
  swatches: string[]
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'navy',
    name: 'Navy Classic',
    description: 'Professional navy blue with white cards — the default look.',
    swatches: ['#1a2d5a', '#3b82f6', '#ffffff'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark mode with glowing purple accents and glass cards.',
    swatches: ['#07071a', '#a855f7', '#12122a'],
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep green hero with emerald highlights and clean white cards.',
    swatches: ['#14432a', '#10b981', '#f0fdf4'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm amber-to-orange gradient with cosy cream product cards.',
    swatches: ['#b45309', '#f59e0b', '#fff7ed'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean all-white layout with indigo accents — less is more.',
    swatches: ['#6366f1', '#e2e8f0', '#ffffff'],
  },
]

export function getTemplate(id?: string | null): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
