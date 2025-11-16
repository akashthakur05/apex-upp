import { coachingInstitutes } from '@/lib/mock-data'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

export default function CoachingList() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Mock Test Series
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse MCQ questions from various coaching institutes
          </p>
        </div>
      </div>

      {/* Coaching Institutes Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachingInstitutes.map((institute) => (
            <Link
              key={institute.id}
              href={`/coaching/${institute.id}`}
            >
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-105 overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <Image
                      src={institute.logo || "/placeholder.svg"}
                      alt={institute.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {institute.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      {institute.tests.length} Test Series Available
                    </p>
                  </div>
                  <button className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    View Tests
                  </button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
