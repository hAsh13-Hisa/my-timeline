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

    // Claude APIを使用して生成
    const result = await generateWithClaude(birthMonth, birthDay, birthYear, currentYear)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate API:', error)
    
    // より詳細なエラーメッセージを返す
    let errorMessage = 'AI年表の生成中にエラーが発生しました'
    if (error instanceof Error) {
      if (error.message.includes('Anthropic API key not configured')) {
        errorMessage = 'Anthropic APIキーが設定されていません'
      } else if (error.message.includes('insufficient_quota')) {
        errorMessage = 'Anthropic APIの使用量制限に達しています。課金設定を確認してください'
      } else if (error.message.includes('rate_limit_exceeded')) {
        errorMessage = 'Anthropic APIのレート制限に達しました。しばらく時間をおいて再度お試しください'
      } else if (error.message.includes('Anthropic API error')) {
        errorMessage = 'Anthropic APIでエラーが発生しました。しばらく時間をおいて再度お試しください'
      } else if (error.message.includes('解析に失敗')) {
        errorMessage = 'AI応答の解析に失敗しました。再度お試しください'
      } else if (error.message.includes('Max retries exceeded')) {
        errorMessage = '複数回の試行でAPI接続に失敗しました。APIの設定を確認してください'
      }
      
      // 開発環境では詳細なエラーメッセージを表示
      if (process.env.NODE_ENV === 'development') {
        console.error('Detailed error:', error.message)
        errorMessage += ` (詳細: ${error.message})`
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


async function generateWithClaude(
  birthMonth: number,
  birthDay: number,
  birthYear: number,
  currentYear: number
) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }

  // レート制限エラー時のリトライ設定
  const maxRetries = 3
  let retries = 0

  const systemPrompt = `あなたは正確な歴史年表を生成するアシスタントです。

【重要な注意事項】：
1. **歴史的事実の年代を必ず正確に記載してください**
2. **不確実な情報は一切含めないでください**
3. **実際に起きた事件のみを記載してください**

【歴史的事実の基準】：
- 年代を必ず正確に（例：大阪万博は1970年、東京五輪は2021年）
- 未来の予定は「予定」と明記
- 誕生の記述は不要

【生成する情報】：
生まれ年から現在までの正確な歴史的出来事のみ

JSON形式で返答してください。`

  const userPrompt = `生年月日: ${birthYear}年${birthMonth}月${birthDay}日

【要求内容】：
${birthYear}年から現在（${currentYear}年）までの多様な歴史的出来事を年代順に提供してください

【出来事のカテゴリ例】：
- 政治・国際情勢（戦争、条約、独立など）
- 社会・文化（法律制定、社会運動、文化的変化など）
- 科学・技術（発明、発見、技術革新など）
- 経済（経済危機、株価変動、通貨変更など）
- 災害・事故（地震、津波、事故など）
- スポーツ・エンターテイメント（オリンピック、万博なども含むが偏重しない）

【注意事項】：
- 実際に起きた事件のみ
- 年代は正確に
- 特定の分野（オリンピックなど）に偏らず、バランス良く選択
- 各年代でその人が何歳だったかも含める
- 約10-15件程度の重要な出来事を選択

【再確認】：
生成前に以下を必ず確認してください：
- 歴史的事件の年代は正確か？
- 不確実な情報を含んでいないか？
- 年齢計算は正確か？

以下のJSON形式で返答してください：
{
  "timeline": [
    {
      "year": 年（数値）,
      "age": 年齢（数値）,
      "event": "正確な歴史的出来事の説明",
      "isHighlighted": false
    }
  ]
}`

  while (retries < maxRetries) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\n${userPrompt}`
            }
          ]
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
        console.error('Anthropic API Error:', errorData)
        throw new Error(`Anthropic API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const content = data.content[0].text
      
      try {
        const result = JSON.parse(content)
        return result
      } catch (parseError) {
        console.error('Failed to parse JSON response from Claude:', content)
        throw new Error('Claude APIからの応答の解析に失敗しました')
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