import CoachingList from '@/components/coaching-list'

export const metadata = {
  title: 'MCQ Test Series - Browse Questions',
  description: 'Browse MCQ questions from mock tests of various coaching institutes',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <CoachingList />
    </main>
  )
}
