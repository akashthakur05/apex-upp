import QuestionViewer from '@/components/question-viewer'
import { coachingInstitutes } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ coachingId: string; testId: string }>
}

export async function generateStaticParams() {
  const params: Array<{ coachingId: string; testId: string }> = []

  coachingInstitutes.forEach((coaching) => {
    coaching.tests.forEach((test) => {
      params.push({
        coachingId: coaching.id,
        testId: test.id,
      })
    })
  })

  return params
}

export async function generateMetadata({ params }: Props) {
  const { coachingId, testId } = await params
  const coaching = coachingInstitutes.find(c => c.id === coachingId)
  const test = coaching?.tests.find(t => t.id === testId)

  return {
    title: `${test?.title || 'Test'} - Questions`,
    description: 'Browse MCQ questions from this test',
  }
}


async function loadQuestions(folder_name: string, testId: string) {
  if (!folder_name) return null
  try {
    // Import JSON statically so Next can bundle it during export
    const data = await import(`@/data/${folder_name}/${testId}.json`)
    return data.default ?? data
  } catch (e) {
    return null
  }
}
export default async function TestPage({ params }: Props) {
  const { coachingId, testId } = await params
  const coaching = coachingInstitutes.find(c => c.id === coachingId)
  const test = coaching?.tests.find(t => t.id === testId)
  const questions = await loadQuestions(coaching?.folder_name || '', testId)

  if (!coaching || !test) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <QuestionViewer test={test} coaching={coaching} preloadedQuestions={questions} />
    </main>
  )
}
