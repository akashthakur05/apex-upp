'use client'

import { useState, useEffect } from 'react'
import { TestTitle, CoachingInstitute, Question } from '@/lib/types'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import SolutionModal from './solution-modal'
import HTMLRenderer from './html-renderer'
import { getSectionName } from '@/lib/mock-data'

interface Props {
  test: TestTitle
  coaching: CoachingInstitute
  preloadedQuestions?: Question[]
}

export default function QuestionViewer({ test, coaching, preloadedQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(preloadedQuestions || [])
  const [loading, setLoading] = useState(!preloadedQuestions)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSolution, setSelectedSolution] = useState<Question | null>(null)
  const [sections, setSections] = useState<Map<string, Question[]>>(new Map())
  const [currentSection, setCurrentSection] = useState<string>('')

  useEffect(() => {
    const processQuestions = (questionData: Question[]) => {
      setQuestions(questionData)

      const groupedBySection = new Map<string, Question[]>()
      questionData.forEach((q: Question) => {
        const sectionId = q.section_id || 'general'
        if (!groupedBySection.has(sectionId)) {
          groupedBySection.set(sectionId, [])
        }
        groupedBySection.get(sectionId)!.push(q)
      })

      setSections(groupedBySection)
      const firstSection = Array.from(groupedBySection.keys())[0]
      setCurrentSection(firstSection)
    }

    if (preloadedQuestions) {
      processQuestions(preloadedQuestions)
      setLoading(false)
    } else if (test.test_questions_url) {
      const fetchQuestions = async () => {
        try {
          setLoading(true)
          const response = await fetch(test.test_questions_url)
          const data = await response.json()
          const parsedQuestions = Array.isArray(data) ? data : data.questions || []
          processQuestions(parsedQuestions)
        } catch (err) {
          setError('Failed to load questions')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchQuestions()
    } else {
      setLoading(false)
      setError('No test data available')
    }
  }, [test.test_questions_url, preloadedQuestions])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 border-b bg-card/95">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href={`/coaching/${coaching.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Tests
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md">
            <p className="text-lg font-semibold text-foreground mb-2">
              {error || 'No questions available'}
            </p>
            <p className="text-muted-foreground">
              This test may not have questions loaded yet
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const currentSectionQuestions = sections.get(currentSection) || []
  const currentQuestion = currentSectionQuestions[currentIndex]
  const sectionArray = Array.from(sections.keys())

  const handleNextQuestion = () => {
    if (currentIndex < currentSectionQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (sectionArray.length > sectionArray.indexOf(currentSection) + 1) {
      setCurrentSection(sectionArray[sectionArray.indexOf(currentSection) + 1])
      setCurrentIndex(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (sectionArray.indexOf(currentSection) > 0) {
      const prevSection = sectionArray[sectionArray.indexOf(currentSection) - 1]
      setCurrentSection(prevSection)
      setCurrentIndex((sections.get(prevSection) || []).length - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href={`/coaching/${coaching.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Tests
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {test.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {coaching.name} • {questions.length} Total Questions
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="sticky top-16 z-9 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4 flex gap-2">
          {sectionArray.map((section) => {
            const sectionQCount = sections.get(section)?.length || 0
            const sectionName = getSectionName(section)
            return (
              <button
                key={section}
                onClick={() => {
                  setCurrentSection(section)
                  setCurrentIndex(0)
                }}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 text-sm ${
                  currentSection === section
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                title={sectionName}
              >
                {sectionName} ({sectionQCount})
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentQuestion && (
          <div className="space-y-6">
            {/* Question Counter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
              <span>
                Question {currentIndex + 1} of {currentSectionQuestions.length}
              </span>
              <span className="font-medium text-foreground">
                {getSectionName(currentSection)}
              </span>
            </div>

            {/* Question Card */}
            <Card className="p-6 md:p-8">
              {/* Question Text */}
              <div className="mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {currentIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <HTMLRenderer html={currentQuestion.question} />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {[1, 2, 3, 4].map((optionNum) => {
                  const optionKey = `option_${optionNum}` as keyof Question
                  const optionText = currentQuestion[optionKey] as string
                  const isCorrect = currentQuestion.answer === String(optionNum)

                  return (
                    <div
                      key={optionNum}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center font-semibold ${
                          isCorrect
                            ? 'border-green-500 text-green-600'
                            : 'border-border'
                        }`}>
                          {String.fromCharCode(64 + optionNum)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <HTMLRenderer html={optionText} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Solution Button */}
              <button
                onClick={() => setSelectedSolution(currentQuestion)}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                View Solution
              </button>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3 justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0 && sectionArray.indexOf(currentSection) === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  currentIndex === currentSectionQuestions.length - 1 &&
                  sectionArray.indexOf(currentSection) === sectionArray.length - 1
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Solution Modal */}
      {selectedSolution && (
        <SolutionModal
          question={selectedSolution}
          isOpen={!!selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}
    </div>
  )
}
