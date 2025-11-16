'use client'

import { Question } from '@/lib/types'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import HTMLRenderer from './html-renderer'

interface Props {
  question: Question
  isOpen: boolean
  onClose: () => void
}

export default function SolutionModal({ question, isOpen, onClose }: Props) {
  if (!isOpen) return null

  const answerKey = `option_${question.answer}` as keyof Question
  const answerText = question[answerKey] as string

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-card">
          <h2 className="text-2xl font-bold text-foreground">Solution</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Answer Section */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Correct Answer
            </p>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border-2 border-green-500">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded border-2 border-green-500 text-green-600 flex items-center justify-center font-bold">
                  {String.fromCharCode(64 + parseInt(question.answer))}
                </div>
                <div className="flex-1">
                  <HTMLRenderer html={answerText} />
                </div>
              </div>
            </div>
          </div>

          {/* Marks Section */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Positive Marks
              </p>
              <p className="text-lg font-bold text-foreground">
                +{question.positive_marks}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Negative Marks
              </p>
              <p className="text-lg font-bold text-foreground">
                {question.negative_marks}
              </p>
            </div>
          </div>

          {/* Solution Text */}
          {question.solution_text && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Explanation
              </p>
              <div className="p-4 rounded-lg bg-muted border">
                <HTMLRenderer html={question.solution_text} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
