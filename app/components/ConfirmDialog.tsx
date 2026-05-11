'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Continue',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-scale-in">
        {/* Top accent */}
        <div className={`h-1.5 w-full ${danger ? 'bg-amber-400' : 'bg-[#1a2d5a]'}`} />

        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-amber-50' : 'bg-red-50'}`}>
              {danger ? (
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              ) : (
                <Trash2 className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
                danger
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
