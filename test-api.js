// Claude API単体テスト
const testClaudeAPI = async () => {
  console.log('Claude APIテストを開始します...\n');

  // テスト用のダミーデータ
  const testData = {
    birthDate: '1990-01-15'
  };

  try {
    // APIエンドポイントをテスト
    console.log('1. APIエンドポイントのテスト...');
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`   ステータスコード: ${response.status}`);
    
    const data = await response.json();
    console.log('   レスポンス:', JSON.stringify(data, null, 2));

    // レスポンスの検証
    console.log('\n2. レスポンスの検証...');
    
    if (data.error) {
      console.error('   ❌ エラーが発生しました:', data.error);
      return;
    }

    if (data.famousPeople && Array.isArray(data.famousPeople)) {
      console.log(`   ✅ 有名人データ: ${data.famousPeople.length}名`);
      data.famousPeople.forEach((person, index) => {
        console.log(`      ${index + 1}. ${person.name} - ${person.description}`);
      });
    } else {
      console.log('   ❌ 有名人データが不正です');
    }

    if (data.timeline && Array.isArray(data.timeline)) {
      console.log(`   ✅ タイムラインデータ: ${data.timeline.length}件`);
      console.log('   最初の3件:');
      data.timeline.slice(0, 3).forEach(event => {
        console.log(`      ${event.year}年 (${event.age}歳): ${event.event}`);
      });
    } else {
      console.log('   ❌ タイムラインデータが不正です');
    }

    // データの妥当性をチェック
    console.log('\n3. データ品質の確認...');
    
    const hasBirthEvent = data.timeline.some(event => 
      event.event.includes('生まれる') || event.event.includes('誕生')
    );
    
    const hasCurrentAge = data.timeline.some(event => 
      event.event.includes('現在') || event.year === new Date().getFullYear()
    );
    
    if (hasBirthEvent && hasCurrentAge) {
      console.log('   ✅ データの整合性が確認されました');
    } else {
      console.log('   ⚠️  データに不整合があります');
    }

    console.log('\n✅ テスト完了');

  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
  }
};

// テストを実行
testClaudeAPI();