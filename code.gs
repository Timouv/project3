function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Kobe Foodie Friend')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// スプレッドシートから店舗データを取得してフロントエンドに渡す
function getShopsData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const shops = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const shop = {};
    for (let j = 0; j < headers.length; j++) {
      shop[headers[j]] = row[j];
    }
    
    // フロントエンドが期待するフォーマットに整形
    shops.push({
      Name: shop["Name"] || "",
      Style: shop["Style"] || "",
      MapLink: shop["Map Link"] || "", // スプレッドシートの「Map Link」列
      Type: shop["Type"] || "",
      Feelings_EN: shop["Feelings_EN"] || "",
      Feelings_JA: shop["Feelings_JA"] || ""
    });
  }
  return shops;
}

// サーバー側でGemini APIを呼び出す（APIキーの隠蔽）
function callGemini(userInput, shopsContext) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error("スクリプトプロパティに GEMINI_API_KEY が設定されていません。");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const systemPrompt = `
  You are "Kobe Foodie Friend", a warm, comforting, and empathetic AI food guide specializing in Kobe gastronomy.
  Your task is to match the user's emotion/vibe/request with the best 1 to 3 restaurants from the provided database.
  
  Kobe Restaurants Database (You MUST select ONLY from these restaurants):
  ${shopsContext}

  Rule 1: NEVER recommend any shop that is not in the list. Do NOT hallucinate names, descriptions, or URLs.
  Rule 2: Respond in the user's language (Japanese if they write in Japanese, English if they write in English).
  Rule 3: Keep your commentary highly friendly, welcoming, brief, and directly matched to their vibe/craving.
  Rule 4: Your reply MUST be in the following raw JSON format, containing an empathetic friendly commentary and the exact list of matched shop names:
  {
    "commentary": "Explain why you picked these shops based on their feelings in a warm tone (1-3 sentences).",
    "matchedShopNames": ["Exact Name 1", "Exact Name 2"]
  }
  `;

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userInput }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
      responseMimeType: "application/json"
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  
  if (json.error) {
    throw new Error(json.error.message);
  }
  
  // JSON文字列をそのままフロントに返す
  return json.candidates[0].content.parts[0].text;
}
