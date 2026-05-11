'use client'

import { TEMPLATES, TemplateId } from '@/lib/templates'
import { Check } from 'lucide-react'

interface TemplatePickerProps {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Page Template</h3>
        <p className="text-xs text-muted-foreground">
          Choose how your public product page will look. You can change this any time.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {TEMPLATES.map((t) => {
          const isSelected = value === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`group relative flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 hover:border-primary/60 hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-white hover:bg-secondary/30'
              }`}
            >
              {/* Color swatches */}
              <div className="flex gap-1.5">
                {t.swatches.map((color, i) => (
                  <div
                    key={i}
                    className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Name */}
              <span className={`text-xs font-semibold leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {t.name}
              </span>

              {/* Description */}
              <span className="text-[10px] leading-snug text-muted-foreground line-clamp-2">
                {t.description}
              </span>

              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
