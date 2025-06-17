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

    // OpenAI APIを使用して有名人と年表を生成
    const openAIResponse = await generateWithOpenAI(birthMonth, birthDay, birthYear, currentYear)

    return NextResponse.json(openAIResponse)
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: '生成中にエラーが発生しました' },
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)

  return result
}