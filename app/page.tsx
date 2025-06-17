'use client'

import { useState, useEffect } from 'react'


type TimelineEvent = {
  year: number
  age: number
  event: string
  isHighlighted?: boolean
}

export default function Home() {
  const [birthDate, setBirthDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setTimeline(data.timeline || [])
    } catch (error) {
      console.error('Error generating timeline:', error)
      alert('生成中にエラーが発生しました。しばらく待ってから再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            私年表
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            あなたの生年月日を入力して、人生の歴史年表を見つけましょう
          </p>
        </div>

        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  📅 生年月日を入力してください
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </span>
                ) : (
                  '✨ 年表を生成'
                )}
              </button>
            </form>
          </div>
        </div>


        {timeline.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                📚 あなたの年表
              </h2>
              <p className="text-gray-600">あなたが生きた時代の歴史的出来事</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          📅 西暦
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          🎂 年齢
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                          🌍 歴史的出来事
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {timeline.map((event, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            event.isHighlighted ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {event.year}年
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              {event.age}歳
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-gray-900 leading-relaxed ${
                              event.isHighlighted ? 'font-bold text-yellow-800' : ''
                            }`}>
                              {event.event}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}