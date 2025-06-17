'use client'

import { useState } from 'react'

type FamousPerson = {
  name: string
  description: string
}

type TimelineEvent = {
  year: number
  age: number
  event: string
  isHighlighted?: boolean
}

export default function Home() {
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthDate }),
      })

      const data = await response.json()
      setFamousPeople(data.famousPeople)
      setTimeline(data.timeline)
    } catch (error) {
      console.error('Error generating timeline:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          私年表
        </h1>
        <p className="text-center text-gray-600 mb-12">
          あなたの生年月日を入力して、AIが生成する人生の年表を見てみましょう
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
          <div className="mb-6">
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              生年月日を入力してください
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? '生成中...' : '年表を生成'}
          </button>
        </form>

        {famousPeople.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              同じ誕生日の有名人
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousPeople.map((person, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {person.name}
                  </h3>
                  <p className="text-gray-600">{person.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {timeline.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              あなたの年表
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      西暦
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      年齢
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出来事
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeline.map((event, index) => (
                    <tr
                      key={index}
                      className={event.isHighlighted ? 'bg-yellow-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.year}年
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.age}歳
                      </td>
                      <td
                        className={`px-6 py-4 text-sm text-gray-900 ${
                          event.isHighlighted ? 'font-bold' : ''
                        }`}
                      >
                        {event.event}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}