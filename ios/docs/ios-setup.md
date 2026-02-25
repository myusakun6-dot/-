# iOS セットアップ（WKWebView + StoreKit2）

更新日: 2026-02-24

## 1) Xcode プロジェクトを作成
1. Xcode > New Project > iOS > App
2. Product Name: `MockMakerApp`
3. Interface: Storyboard（後で削除）または SwiftUI どちらでも可
4. Language: Swift
5. 保存先: `/Users/matsuoyusaku/Desktop/試し/ios`

## 2) 既存コードを取り込み
- `/Users/matsuoyusaku/Desktop/試し/ios/MockMakerApp/*.swift` をターゲットに追加
- Storyboard利用なら初期ViewController参照を外し、`SceneDelegate` を有効化

## 3) Webアセットを同梱
1. Xcodeで `web` フォルダを作成
2. 以下を `web/` にコピーして target membership をON
   - `/Users/matsuoyusaku/Desktop/試し/index.html`
   - `/Users/matsuoyusaku/Desktop/試し/style.css`
   - `/Users/matsuoyusaku/Desktop/試し/app.js`
   - `/Users/matsuoyusaku/Desktop/試し/manifest.webmanifest`
   - `/Users/matsuoyusaku/Desktop/試し/sw.js`

## 4) StoreKit設定
- Product IDs を `StoreKitService.swift` の `productIDs` に合わせる
  - `com.mockmaker.adfree.monthly`
  - `com.mockmaker.adfree.yearly`
- App Store Connect側でも同IDを作成

## 5) 動作確認
- 起動してWeb UIが表示されること
- 設定 > プランの各ボタンでネイティブブリッジが呼ばれること
- まずはSandboxで購入/復元をテスト

## 6) 次の実装
- `RewardedAdService` を実広告SDKへ置換
- `StoreKitService` の期限判定をサーバ検証へ拡張
