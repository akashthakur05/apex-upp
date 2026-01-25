import fs from "fs"
import path from "path"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
// const readFile = f => fs.promises.readFile(f, "utf8");

type Institute = {
  id: string
  name: string
  logo?: string
  tests: any[]
}

export default async function CoachingList() {
  const filePath = path.join(
    process.cwd(),
    "lib/data.json"
  )

  const data = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  ) as Institute[]

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Mock Test Series</h1>
          <p className="text-muted-foreground mt-2">
            Browse MCQ questions from various coaching institutes
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((institute) => (
            <Link key={institute.id} href={`/coaching/${institute.id}`}>
              <Card className="h-full hover:scale-105 transition">
                <div className="p-6 flex flex-col items-center gap-4 text-center">
                  <div className="relative w-24 h-24 bg-muted rounded-lg">
                    <Image
                      src={institute.logo || "/placeholder.svg"}
                      alt={institute.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {institute.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {institute.tests.length} Test Series Available
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
