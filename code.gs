<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Tabemon</title>
    <style>
        /* ==================================================
           基本デザイン・CSS
           ================================================== */
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f5f3e9; color: #333; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .phone-container { width: 100%; max-width: 412px; height: 100vh; max-height: 850px; background-color: #ffffff; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; position: relative; border: 6px solid #2c3e50; box-sizing: border-box; }
        @media (max-width: 500px) { .phone-container { height: 100vh; max-height: 100vh; border-radius: 0; border: none; } }
        
        /* タイトルページ：スクロールさせず画面内に収めるための設定 */
        #title-page { flex: 1; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; padding: 20px 20px; box-sizing: border-box; background: linear-gradient(135deg, #fdfbf7 0%, #f5f3e9 100%); overflow: hidden; height: 100%; }
        
        .header-group { margin-top: 5px; flex-shrink: 0; }
        .main-title { font-size: 2.3rem; color: #2c3e50; margin: 0 0 2px 0; font-weight: 900; letter-spacing: -0.5px; line-height: 1.1; }
        .subtitle { font-size: 1.0rem; color: #e74c3c; margin: 0; font-weight: 700; letter-spacing: 1px; }
        
        /* 画像ギャラリー：高さを最大180pxに制限し、縦長画面でも圧迫しないよう調整 */
        #image-gallery { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin: 15px 0; width: 100%; max-height: 180px; flex-shrink: 1; min-height: 100px; }
        .gallery-image { width: 100%; height: 100%; border-radius: 10px; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1); object-fit: cover; border: 1.5px solid #fff; transition: transform 0.2s; min-height: 0; }
        .gallery-image:hover { transform: scale(1.03); }
        .img-1 { grid-column: span 3; grid-row: span 2; }
        .img-2 { grid-column: span 3; }
        .img-3 { grid-column: span 3; }
        .img-4 { grid-column: span 2; }
        .img-5 { grid-column: span 4; }

        /* 説明文：コンパクトにして余白を縮小 */
        .welcome-text { font-size: 0.82rem; color: #555; line-height: 1.5; margin: 0 0 15px 0; background: rgba(255, 255, 255, 0.85); padding: 10px 12px; border-radius: 10px; border-left: 4px solid #e74c3c; box-shadow: 0 2px 6px rgba(0,0,0,0.02); flex-shrink: 0; text-align: left; box-sizing: border-box; width: 100%; }
        .welcome-text small { display: block; margin-top: 4px; color: #7f8c8d; font-size: 0.75rem; line-height: 1.3; }
        
        /* ボタンエリア：最下部に固定され、押しやすいサイズを維持 */
        .selection-buttons { width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 5px; flex-shrink: 0; }
        .selection-buttons button { width: 100%; padding: 14px; font-size: 0.95rem; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: background-color 0.2s, transform 0.1s, box-shadow 0.2s; box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; gap: 6px; box-sizing: border-box; }
        #btn-japanese { background-color: #e74c3c; color: white; }
        #btn-japanese:hover { background-color: #c0392b; box-shadow: 0 4px 10px rgba(231, 76, 60, 0.2); }
        #btn-english { background-color: #2980b9; color: white; }
        #btn-english:hover { background-color: #216f9e; box-shadow: 0 4px 10px rgba(41, 128, 185, 0.2); }
        .selection-buttons button:active { transform: translateY(1px); }
        
        /* チャットページ以降のスタイル */
        #chat-page { display: none; flex-direction: column; width: 100%; height: 100%; background-color: #f8f9fa; }
        .chat-header { background-color: #2c3e50; color: white; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0; }
        .chat-header-title { display: flex; align-items: center; gap: 10px; }
        .chat-avatar-mini { width: 32px; height: 32px; border-radius: 50%; background-color: #e74c3c; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 0.8rem; color: white; }
        .chat-header-info h2 { margin: 0; font-size: 1.05rem; font-weight: 700; letter-spacing: 0.5px; }
        .chat-header-info p { margin: 0; font-size: 0.75rem; color: #bdc3c7; }
        .back-button, .settings-button { background: none; border: none; color: white; font-size: 1.1rem; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; }
        .back-button:hover, .settings-button:hover { background-color: rgba(255,255,255,0.1); }
        .chat-messages { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background-color: #f4f6f7; }
        .message { display: flex; align-items: flex-start; gap: 8px; max-width: 85%; }
        .message.bot { align-self: flex-start; }
        .message.user { align-self: flex-end; flex-direction: row-reverse; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .bot .avatar { background-color: #e74c3c; color: white; }
        .user .avatar { background-color: #2980b9; color: white; }
        .bubble { padding: 12px 16px; border-radius: 18px; font-size: 0.9rem; line-height: 1.45; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .bot .bubble { background-color: white; color: #2c3e50; border-top-left-radius: 4px; border: 1px solid #eef2f3; }
        .user .bubble { background-color: #2980b9; color: white; border-top-right-radius: 4px; }
        .chips-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .chip { background-color: #ebeef1; color: #4f5f6f; border: 1px solid #dcdfe3; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .chip:hover { background-color: #2980b9; color: white; border-color: #2980b9; }
        
        /* レストラン提示カードの装飾 */
        .shop-card { background-color: white; border-radius: 12px; border: 1px solid #e1e8ed; padding: 12px; margin-top: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); width: 100%; box-sizing: border-box; }
        .shop-type-badge { display: inline-block; font-size: 0.65rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px; text-transform: uppercase; }
        .badge-noodles { background-color: #ffeaa7; color: #d63031; }
        .badge-meat { background-color: #ffcbca; color: #c0392b; }
        .badge-global { background-color: #dfe6e9; color: #2d3436; }
        .badge-sweet { background-color: #fab1a0; color: #e17055; }
        .shop-name { font-size: 0.95rem; font-weight: bold; margin: 0 0 4px 0; color: #2c3e50; }
        .shop-style { font-size: 0.75rem; color: #7f8c8d; margin: 0 0 10px 0; }
        .shop-link { display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #2980b9; text-decoration: none; font-weight: 600; margin-top: 6px; }
        .shop-link:hover { text-decoration: underline; }
        
        /* 写真とインラインマップのスタイル */
        .shop-image { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; background-color: #f0f0f0; border: 1px solid #e1e8ed; }
        .shop-map { width: 100%; height: 160px; border: none; border-radius: 8px; margin-top: 10px; margin-bottom: 4px; background-color: #f8f9fa; }

        .chat-input-area { padding: 12px 16px; background-color: white; border-top: 1px solid #eaeaea; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .chat-input { flex: 1; border: 1px solid #dcdfe3; border-radius: 20px; padding: 10px 16px; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
        .chat-input:focus { border-color: #2980b9; }
        .send-button { background-color: #2980b9; color: white; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: background-color 0.2s; flex-shrink: 0; }
        .send-button:hover { background-color: #216f9e; }
        .send-button svg { width: 16px; height: 16px; fill: currentColor; transform: translateX(1px); }
        .setup-modal { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(44, 62, 80, 0.95); z-index: 1000; flex-direction: column; justify-content: center; align-items: center; padding: 30px; box-sizing: border-box; color: white; text-align: center; }
        .setup-card { background-color: #ffffff; color: #333333; border-radius: 20px; padding: 24px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: left; }
        .setup-title { font-size: 1.2rem; font-weight: bold; color: #2c3e50; margin-top: 0; margin-bottom: 10px; }
        .setup-desc { font-size: 0.8rem; color: #7f8c8d; line-height: 1.5; margin-bottom: 20px; }
        .setup-btn { width: 100%; padding: 14px; background-color: #2980b9; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s; text-align: center; }
        .setup-btn:hover { background-color: #216f9e; }
        .ai-loading-bubble { display: flex; align-items: center; gap: 6px; font-style: italic; color: #7f8c8d; }
        .loader-dots span { animation: blink 1.4s infinite both; display: inline-block; font-weight: bold; }
        .loader-dots span:nth-child(2) { animation-delay: .2s; }
        .loader-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
    </style>
</head>
<body>
    <div class="phone-container">
        <div id="title-page">
            <div class="header-group">
                <h1 class="main-title">たべもん</h1>
                <p class="subtitle">Tabemon</p>
            </div>
            
            <div id="image-gallery">
                <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/8e/3a/9e/caption.jpg?w=900&h=500&s=1" alt="神戸グルメ 1" class="gallery-image img-1">
                <img src="https://grill-ippei.co.jp/wp-content/uploads/2022/08/ogp.jpg" alt="神戸グルメ 2" class="gallery-image img-2">
                <img src="https://tb-static.uber.com/prod/image-proc/processed_images/8df13ab9660e6bbf370897596e777483/885ba8620d45ab36746a0e8c7b85ee66.jpeg" alt="神戸グルメ 3" class="gallery-image img-3">
                <img src="https://eatbook.sg/wp-content/uploads/2019/11/Enishi-spread-of-food.jpg" alt="神戸グルメ 4" class="gallery-image img-4">
                <img src="https://static.gltjp.com/glt/data/directory/17000/16835/20250414_105425_791c66a7_w1920.webp" alt="神戸グルメ 5" class="gallery-image img-5">
            </div>
            
            <div class="welcome-text">
                神戸の厳選店舗から、今のあなたの「気分」や「感情」にピッタリな美味しい出会いを提案します。言葉にならない「なんとなく」を教えてください。<br>
                <small>We help you find the perfect restaurant in Kobe based on your current vibe, feeling or mood.</small>
            </div>
            
            <div class="selection-buttons">
                <button id="btn-japanese"><span>🇯🇵</span> 日本語で始める</button>
                <button id="btn-english"><span>🇬🇧 / 🇯🇵</span> English / 日本語で始める</button>
            </div>
        </div>

        <div id="chat-page">
            <div class="chat-header">
                <button class="back-button" id="btn-back" title="戻る">←</button>
                <div class="chat-header-title">
                    <div class="chat-avatar-mini" id="header-avatar">TM</div>
                    <div class="chat-header-info">
                        <h2 id="header-title">Tabemon</h2>
                        <p id="header-status">Online • Agent</p>
                    </div>
                </div>
                <button class="settings-button" id="btn-settings" title="API接続設定">⚙️</button>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chat-input" placeholder="メッセージを入力..." autocomplete="off">
                <button class="send-button" id="btn-send" title="送信">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>

        <div class="setup-modal" id="setup-modal">
            <div class="setup-card">
                <h3 class="setup-title">🔒 APIキー接続セットアップ</h3>
                <p class="setup-desc">GASバックエンド（スクリプトプロパティ）で管理されているため、ここではキーの入力は不要です。</p>
                <button class="setup-btn" id="btn-save-key">閉じる</button>
            </div>
        </div>
    </div>

    <script>
        let kobeShops = [];
        
        const categoryMapping = {
            Noodles: { en: ["mindless eating", "low energy", "worn out", "fast comfort", "solo dining", "low-key", "rewinding", "noodles", "ramen", "gyoza"], ja: ["サクッと", "一人飯", "疲れ気味", "気軽に", "深夜の贅沢", "手軽に済ませたい", "ほっこり", "ラーメン", "らーめん", "餃子", "ぎょうざ", "麺"] },
            Meat: { en: ["indulgent", "feast mode", "treat myself", "high spirit", "cheat day", "sensory overload", "upscale", "celebration", "meat", "beef", "steak", "yakiniku"], ja: ["がっつり", "ご褒美", "テンション高い", "特別な日", "贅沢したい", "お祝い", "精力をつけたい", "肉", "ビーフ", "ステーキ", "焼肉", "牛かつ"] },
            Global: { en: ["adventurous", "breaking the routine", "bold cravings", "vibrant night", "lively atmosphere", "escape", "stimulating", "global", "curry", "french", "chinese", "halal", "spicy"], ja: ["刺激が欲しい", "いつもと違う味", "異国情緒", "冒険心", "ワクワクしたい", "賑やかな夜", "カレー", "洋食", "中華", "ハラール", "フランス", "スパーシー", "辛い"] },
            Sweet: { en: ["emotional rescue", "mental fatigue", "sweet escape", "cozy afternoon", "slow pace", "aically pleasing", "unearned reward", "sweet", "dessert", "cake", "coffee", "cafe", "chocolate"], ja: ["しょんぼり", "ストレス解消", "別腹", "自分を甘やかす", "映えスイーツ", "優雅な午後", "癒やされたい", "甘い", "スイーツ", "ケーキ", "カフェ", "珈琲", "コーヒー", "チョコレート", "おやつ"] }
        };

        let currentLang = 'ja'; 

        document.addEventListener('DOMContentLoaded', () => {
            // スプレッドシートからデータを非同期でロード
            google.script.run.withSuccessHandler(function(data) {
                kobeShops = data || [];
            }).getShopsData();

            const titlePage = document.getElementById('title-page');
            const chatPage = document.getElementById('chat-page');
            const btnJapanese = document.getElementById('btn-japanese');
            const btnEnglish = document.getElementById('btn-english');
            const btnBack = document.getElementById('btn-back');
            const btnSend = document.getElementById('btn-send');
            const chatInput = document.getElementById('chat-input');
            const chatMessages = document.getElementById('chat-messages');

            // 画面切り替えと初期化
            btnJapanese.addEventListener('click', () => { currentLang = 'ja'; startChat(); });
            btnEnglish.addEventListener('click', () => { currentLang = 'en'; startChat(); });
            btnBack.addEventListener('click', () => { chatPage.style.display = 'none'; titlePage.style.display = 'flex'; chatMessages.innerHTML = ''; });
            document.getElementById('btn-settings').addEventListener('click', () => { document.getElementById('setup-modal').style.display = 'flex'; });
            document.getElementById('btn-save-key').addEventListener('click', () => { document.getElementById('setup-modal').style.display = 'none'; });

            function startChat() {
                titlePage.style.display = 'none';
                chatPage.style.display = 'flex';

                if (currentLang === 'ja') {
                    document.getElementById('header-title').textContent = 'Tabemon';
                    document.getElementById('header-status').textContent = 'オンライン • 気分で探す神戸グルメ';
                    chatInput.placeholder = '今の気分や感情を入力... (例: 疲れ気味, ご褒美)';
                } else {
                    document.getElementById('header-title').textContent = 'Tabemon';
                    document.getElementById('header-status').textContent = 'Online • Match by your current vibe';
                    chatInput.placeholder = 'How do you feel? (e.g., worn out, treat myself)';
                }
                chatMessages.innerHTML = '';
                sendBotGreeting();
            }

            // メッセージ送信イベント
            btnSend.addEventListener('click', handleUserSendMessage);
            chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserSendMessage(); });

            function handleUserSendMessage() {
                const text = chatInput.value.trim();
                if (!text) return;
                addMessage(text, 'user');
                chatInput.value = '';
                setTimeout(() => respondToUser(text), 400);
            }

            function addMessage(text, sender, extraElement = null) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}`;

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';
                avatarDiv.textContent = sender === 'bot' ? '🍽️' : '👤';

                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'bubble';
                bubbleDiv.innerHTML = text.replace(/\n/g, '<br>');

                if (extraElement) bubbleDiv.appendChild(extraElement);
                messageDiv.appendChild(avatarDiv);
                messageDiv.appendChild(bubbleDiv);
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                return messageDiv;
            }

            function sendBotGreeting() {
                let greetingText = "";
                let chips = [];
                if (currentLang === 'ja') {
                    greetingText = "こんにちは！Tabemon へようこそ。\n今のあなたの気分や、お腹のすき具合はどんな感じですか？\n例えば、以下の感情キーワードから選ぶか、自由に入力してください！";
                    chips = ["サクッと", "一人飯", "ご褒美", "刺激が欲しい", "しょんぼり", "疲れ気味"];
                } else {
                    greetingText = "Hello! Welcome to Tabemon.\nHow are you feeling right now? What is your vibe today?\nFeel free to type your emotion, or select one from below:";
                    chips = ["worn out", "treat myself", "solo dining", "adventurous", "low energy", "sweet escape"];
                }

                greetingText += (currentLang === 'ja') 
                    ? "\n\n✨ **Gemini RAG (GAS連携) 接続中** ✨\nスプレッドシートの最新データからリアルタイム提案を行います。" 
                    : "\n\n✨ **Gemini RAG (GAS DB) Connected** ✨\nReal-time semantic analysis is active.";

                const chipsContainer = document.createElement('div');
                chipsContainer.className = 'chips-container';
                chips.forEach(keyword => {
                    const chip = document.createElement('span');
                    chip.className = 'chip';
                    chip.textContent = keyword;
                    chip.addEventListener('click', () => {
                        addMessage(keyword, 'user');
                        setTimeout(() => respondToUser(keyword), 400);
                    });
                    chipsContainer.appendChild(chip);
                });

                addMessage(greetingText, 'bot', chipsContainer);
            }

            // AI応答処理
            async function respondToUser(userInput) {
                const loadingText = currentLang === 'ja' ? "AIが神戸の店舗を分析中" : "AI is analyzing Kobe restaurants";
                const loadingDiv = addMessage(`<div class="ai-loading-bubble">${loadingText}<span class="loader-dots"><span>.</span><span>.</span><span>.</span></span></div>`, 'bot');

                // シートから読み込んだデータをコンテキスト化
                const shopsContext = kobeShops.map((shop, i) => {
                    return `【ID: ${i+1}】\n店名: ${shop.Name}\nスタイル: ${shop.Style}\nカテゴリ: ${shop.Type}\n関連感情(日): ${shop.Feelings_JA}\n関連感情(英): ${shop.Feelings_EN}`;
                }).join("\n---\n");

                // google.script.run を用いたGAS経由のセキュアなAPIコール
                google.script.run
                    .withSuccessHandler(function(responseText) {
                        loadingDiv.remove();
                        try {
                            const parsedResponse = JSON.parse(responseText);
                            addMessage(parsedResponse.commentary, 'bot');

                            const matchedNames = parsedResponse.matchedShopNames || [];
                            let cardsDisplayed = 0;

                            // 店名判定を優しくした処理（AI応答時）
                            matchedNames.forEach(shopName => {
                                const foundShop = kobeShops.find(s => {
                                    const sName = (s.Name || '').trim().toLowerCase();
                                    const rName = shopName.trim().toLowerCase();
                                    return sName === rName || sName.includes(rName) || rName.includes(sName);
                                });
                                
                                if (foundShop) {
                                    cardsDisplayed++;
                                    const cardDiv = document.createElement('div');
                                    cardDiv.className = 'shop-card';
                                    const badgeClass = `badge-${foundShop.Type.toLowerCase()}`;
                                    
                                    // 写真とマップの生成
                                    const imageHtml = foundShop.ImageUrl ? `<img src="${foundShop.ImageUrl}" alt="Menu Photo" class="shop-image" onerror="this.style.display='none'">` : '';
                                    const mapQuery = encodeURIComponent(foundShop.Name + " 神戸");
                                    const mapHtml = `<iframe class="shop-map" src="https://maps.google.co.jp/maps?q=${mapQuery}&z=15&output=embed" allowfullscreen loading="lazy"></iframe>`;

                                    cardDiv.innerHTML = `
                                        ${imageHtml}
                                        <span class="shop-type-badge ${badgeClass}">${foundShop.Type}</span>
                                        <h3 class="shop-name">${foundShop.Name}</h3>
                                        <p class="shop-style">${foundShop.Style}</p>
                                        ${mapHtml}
                                        <a href="${foundShop.MapLink}" target="_blank" class="shop-link">
                                            📍 マップアプリで全画面で開く →
                                        </a>
                                    `;
                                    addMessage("", 'bot', cardDiv);
                                }
                            });

                            if (cardsDisplayed === 0) handleLocalFallback(userInput, true);
                        } catch (e) {
                            console.error("Parse error", e);
                            handleLocalFallback(userInput);
                        }
                    })
                    .withFailureHandler(function(error) {
                        loadingDiv.remove();
                        const errMsg = currentLang === 'ja' 
                            ? `⚠️ サーバーエラーが発生しました (${error.message})。ローカル検索に切り替えます。`
                            : "⚠️ Server issue. Falling back to local search.";
                        addMessage(errMsg, 'bot');
                        handleLocalFallback(userInput);
                    })
                    .callGemini(userInput, shopsContext);
            }

            // フォールバック（API通信失敗時や該当なしの場合のローカル検索）
            function handleLocalFallback(userInput, isSilent = false) {
                const query = userInput.toLowerCase().trim();
                let matchedCategory = null;
                let isFallback = false;

                for (const [category, languages] of Object.entries(categoryMapping)) {
                    const enMatches = languages.en.filter(kw => query.includes(kw));
                    const jaMatches = languages.ja.filter(kw => query.includes(kw));
                    if (enMatches.length > 0 || jaMatches.length > 0) { matchedCategory = category; break; }
                }

                let results = [];
                if (matchedCategory) {
                    results = kobeShops.filter(shop => shop.Type === matchedCategory);
                } else {
                    results = kobeShops.filter(shop => {
                        return (shop.Name || '').toLowerCase().includes(query) || 
                               (shop.Style || '').toLowerCase().includes(query) || 
                               (shop.Feelings_JA || '').toLowerCase().includes(query) || 
                               (shop.Feelings_EN || '').toLowerCase().includes(query);
                    });
                }

                if (results.length === 0) {
                    isFallback = true;
                    const fallbackCategories = ["Meat", "Sweet", "Noodles", "Global"];
                    const selectedCategory = fallbackCategories[userInput.length % fallbackCategories.length];
                    matchedCategory = selectedCategory;
                    results = kobeShops.filter(shop => shop.Type === selectedCategory);
                }

                const shuffled = results.sort(() => 0.5 - Math.random());
                const topResults = shuffled.slice(0, 3);

                if (!isSilent) {
                    let responseText = "";
                    if (currentLang === 'ja') {
                        responseText = isFallback ? `「${userInput}」に完全に一致する条件は見つかりませんでしたが、近い雰囲気のお店（**${matchedCategory}**）を提案します！` : `あなたの「${matchedCategory || userInput}」な気分にぴったりの神戸のお店を厳選しました！`;
                    } else {
                        responseText = isFallback ? `I couldn't find an exact match for "${userInput}", but here are some alternatives under "**${matchedCategory}**"!` : `I found some perfect restaurants matching your "${matchedCategory || userInput}" vibe!`;
                    }
                    addMessage(responseText, 'bot');
                }

                topResults.forEach(shop => {
                    // 店名判定を優しくした処理（ローカル検索時）
                    const foundShop = kobeShops.find(s => {
                        const sName = (s.Name || '').trim().toLowerCase();
                        const rName = shop.Name.trim().toLowerCase();
                        return sName === rName || sName.includes(rName) || rName.includes(sName);
                    });

                    if (foundShop) {
                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'shop-card';
                        const badgeClass = `badge-${foundShop.Type.toLowerCase()}`;
                        
                        // 写真とマップの生成
                        const imageHtml = foundShop.ImageUrl ? `<img src="${foundShop.ImageUrl}" alt="Menu Photo" class="shop-image" onerror="this.style.display='none'">` : '';
                        const mapQuery = encodeURIComponent(foundShop.Name + " 神戸");
                        const mapHtml = `<iframe class="shop-map" src="https://maps.google.co.jp/maps?q=${mapQuery}&z=15&output=embed" allowfullscreen loading="lazy"></iframe>`;

                        cardDiv.innerHTML = `
                            ${imageHtml}
                            <span class="shop-type-badge ${badgeClass}">${foundShop.Type}</span>
                            <h3 class="shop-name">${foundShop.Name}</h3>
                            <p class="shop-style">${foundShop.Style}</p>
                            ${mapHtml}
                            <a href="${foundShop.MapLink}" target="_blank" class="shop-link">
                                📍 マップアプリで全画面で開く →
                            </a>
                        `;
                        addMessage("", 'bot', cardDiv);
                    }
                });
            }
        });
    </script>
</body>
</html>
