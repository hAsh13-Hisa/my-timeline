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
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 via-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 via-yellow-500 via-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
            私年表
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            あなたの生年月日を入力して、人生の歴史年表を見つけましょう
          </p>
        </div>

        <div className="max-w-md mx-auto mb-16">
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-2xl shadow-xl p-8 border-2 border-gradient-to-r from-purple-200 to-pink-200">
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
                className="w-full bg-gradient-to-r from-pink-500 via-red-500 via-orange-500 to-yellow-500 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:via-red-600 hover:via-orange-600 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
{loading ? '生成中...' : '✨ 年表を生成'}
              </button>
            </form>
          </div>
        </div>


        {timeline.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                📚 あなたの年表
              </h2>
              <p className="text-purple-700 font-medium">あなたが生きた時代の歴史的出来事</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-red-500 text-white">
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
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              index % 4 === 0 ? 'bg-red-100 text-red-800' :
                              index % 4 === 1 ? 'bg-green-100 text-green-800' :
                              index % 4 === 2 ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {event.year}年
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              index % 4 === 0 ? 'bg-orange-100 text-orange-800' :
                              index % 4 === 1 ? 'bg-teal-100 text-teal-800' :
                              index % 4 === 2 ? 'bg-indigo-100 text-indigo-800' :
                              'bg-pink-100 text-pink-800'
                            }`}>
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