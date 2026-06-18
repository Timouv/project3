# 要件定義書：Kobe Foodie Friend (MVP)

* **作成日:** 2026年6月18日
* **プロジェクト名:** KobeFoodApp
* **対象ファイル:** `index.html` (フロントエンド完結), `sophisticated_kobe_feelings.csv` (データソース)

---

## 1. プロジェクト概要
本ドキュメントは、神戸の厳選された飲食店50店舗を紹介する対話型Webアプリケーション「Kobe Foodie Friend」の最小限の実行可能製品（MVP）における要件定義をまとめたものである。

本アプリは、ユーザーの抽象的な「感情」や「気分（Vibe）」を英語および日本語の双方で高度に解釈し、最適な店舗を提案するフロントエンド完結型のシステムとして構築する。

---

## 2. システム構成・開発環境
運用の手軽さと開発の迅速性を最優先とし、サーバーレスかつ単一ファイルで完結するフロントエンド構成を採用する。

* **開発エディタ:** Zed
* **プロジェクトフォルダ名:** `KobeFoodApp`
* **構成ファイル:** `index.html` （HTML5、CSS3、JavaScriptを内包）
* **実行環境:** モバイルWebブラウザ（Safari、Google Chromeなど）のローカル環境、サーバーレス構成

---

## 3. データ要件（データ構造）
店舗データは、高度な感情分析に対応できるように設計されたCSVファイル（`sophisticated_kobe_feelings.csv`）を基盤とする。JavaScript内部ではオブジェクト配列として定義し、メモリ上に保持する。

### 主要カラムおよび構造
| カラム名 | 説明 | データ例 |
| :--- | :--- | :--- |
| **Name** | 店舗名称 | `"Metro Ramen"`, `"Patisserie Mont Plus"` |
| **Style** | 料理のジャンルおよび特徴的な詳細説明 | `"Ramen (Light Duck Broth)"` |
| **Map Link** | Google Mapsへの直接リンク | `http://maps.google.com/?q=Metro+Ramen+Kobe` |
| **Type** | 大カテゴリ（4種類に分類） | `Noodles` / `Meat` / `Global` / `Sweet` |
| **Feelings_EN** | 英語圏向けの洗練された感情・状況キーワード | `mindless eating, low energy, worn out...` |
| **Feelings_JA** | 日本語圏向けの洗練された感情・状況キーワード | `サクッと, 一人飯, 疲れ気味, しょんぼり...` |

---

## 4. 機能要件

### 4.1 カテゴリ・感情マッピング機能
AIチャットボットまたはフィルタロジックが、ユーザーの入力したニュアンスを検知し、以下の4大カテゴリのいずれかに紐付けて店舗を抽出する。

| 大カテゴリ | 洗練された感情キーワード（英語：`Feelings_EN`） | 洗練された感情キーワード（日本語：`Feelings_JA`） |
| :--- | :--- | :--- |
| **Noodles**<br>(18店舗) | mindless eating, low energy, worn out, fast comfort, solo dining, low-key, rewinding | サクッと, 一人飯, 疲れ気味, 気軽に, 深夜の贅沢, 手軽に済ませたい, ほっこり |
| **Meat**<br>(12店舗) | indulgent, feast mode, treat myself, high spirit, cheat day, sensory overload, upscale, celebration | がっつり, ご褒美, テンション高い, 特別な日, 贅沢したい, お祝い, 精力をつけたい |
| **Global**<br>(10店舗) | adventurous, breaking the routine, bold cravings, vibrant night, lively atmosphere, escape, stimulating | 刺激が欲しい, いつもと違う味, 異国情緒, 冒険心, ワクワクしたい, 賑やかな夜 |
| **Sweet**<br>(10店舗) | emotional rescue, mental fatigue, sweet escape, cozy afternoon, slow pace, aesthetically pleasing, unearned reward | しょんぼり, ストレス解消, 別腹, 自分を甘やかす, 映えスイーツ, 優雅な午後, 癒やされたい |

### 4.2 言語対応要件
* クライアントが英語で話しかけた場合、`Feelings_EN` のプロファイルを参照してマッチングを行う。
* クライアントが日本語（「しょんぼり」「サクッと」など）で話しかけた場合、`Feelings_JA` のプロファイルを参照して正確にマッチングを行う。

### 4.3 ユーザーインターフェース（UI）機能
* **スマートフォン最適化:** 縦長（幅375px想定）のスマートフォンスクリーン風コンテナによる表示。
* **対話型表示:** ユーザーの発言（あるいは選択）と、それに対するアプリ側からのおすすめ店舗（店名、スタイル、マップリンク）がチャットのタイムライン形式で動的に追加される。

---

## 5. 非機能要件
* **即時レスポンス:** 外部サーバー通信を挟まず、ローカルのJavaScript配列から直接フィルタリングを行うため、検索・表示の遅延を1秒未満とする。
* **ポータビリティ:** `index.html` ファイルをブラウザにドラッグ＆ドロップするだけで、どの端末でも即座に動作検証が可能であること。
