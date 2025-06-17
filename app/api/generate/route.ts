import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { birthDate } = await request.json()
    
    if (!birthDate) {
      return NextResponse.json(
        { error: '生年月日を入力してください' },
        { status: 400 }
      )
    }

    const birthDateObj = new Date(birthDate)
    const currentYear = new Date().getFullYear()
    const birthYear = birthDateObj.getFullYear()
    const birthMonth = birthDateObj.getMonth() + 1
    const birthDay = birthDateObj.getDate()

    // OpenAI APIを使用して生成
    const result = await generateWithOpenAI(birthMonth, birthDay, birthYear, currentYear)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate API:', error)
    
    // より詳細なエラーメッセージを返す
    let errorMessage = 'AI年表の生成中にエラーが発生しました'
    if (error instanceof Error) {
      if (error.message.includes('OpenAI API key not configured')) {
        errorMessage = 'OpenAI APIキーが設定されていません'
      } else if (error.message.includes('OpenAI API error')) {
        errorMessage = 'OpenAI APIでエラーが発生しました。しばらく時間をおいて再度お試しください'
      } else if (error.message.includes('解析に失敗')) {
        errorMessage = 'AI応答の解析に失敗しました。再度お試しください'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


async function generateWithOpenAI(
  birthMonth: number,
  birthDay: number,
  birthYear: number,
  currentYear: number
) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  // レート制限エラー時のリトライ設定
  const maxRetries = 3
  let retries = 0

  const systemPrompt = `あなたは年表と有名人の情報を生成するアシスタントです。
ユーザーの生年月日に基づいて、以下の情報を生成してください：
1. 同じ誕生日（月日）の有名人を3-5名
2. ユーザーの生まれ年から現在までの主要な出来事の年表

JSON形式で返答してください。`

  const userPrompt = `生年月日: ${birthYear}年${birthMonth}月${birthDay}日

以下のJSON形式で返答してください：
{
  "famousPeople": [
    {
      "name": "有名人の名前",
      "description": "職業や代表作など"
    }
  ],
  "timeline": [
    {
      "year": 年（数値）,
      "age": 年齢（数値）,
      "event": "出来事の説明",
      "isHighlighted": 誕生日と同じ日付の出来事の場合はtrue
    }
  ]
}`

  while (retries < maxRetries) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (response.status === 429) {
        retries++
        const waitTime = Math.pow(2, retries) * 1000
        console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${retries}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI API Error:', errorData)
        throw new Error(`OpenAI API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      try {
        const result = JSON.parse(content)
        return result
      } catch (parseError) {
        console.error('Failed to parse JSON response from OpenAI:', content)
        throw new Error('OpenAI APIからの応答の解析に失敗しました')
      }
    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error
      }
      retries++
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  throw new Error('Max retries exceeded')
}