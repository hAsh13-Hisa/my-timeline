// OpenAI API単体テスト
const testOpenAIAPI = async () => {
  console.log('OpenAI APIテストを開始します...\n');

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

    // OpenAI APIが使用されたかチェック
    console.log('\n3. API使用状況の確認...');
    const hasUniqueData = data.famousPeople.some(person => 
      !person.name.includes('アインシュタイン') && 
      !person.name.includes('スティーブ・ジョブズ')
    );
    
    if (hasUniqueData || data.timeline.length > 6) {
      console.log('   ✅ OpenAI APIが正常に使用されました');
    } else {
      console.log('   ⚠️  モックデータが返されました（APIエラーまたは未設定）');
    }

    console.log('\n✅ テスト完了');

  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
  }
};

// テストを実行
testOpenAIAPI();