# 複数アプリ運用テンプレート（日本語）

## 1. 共通運用名
- 運用名（公開表記）: [例: 自作模試メーカー制作チーム]
- 連絡先メール: [例: apps.support@example.com]

## 2. 新規アプリ開始時の最短手順
1. アプリ名を決める
2. 利用規約/プライバシーのテンプレを複製してアプリ名差し替え
3. App Storeメタデータテンプレを複製して入力
4. スクリーンショット6枚を作成
5. App Store Connectへ登録

## 3. 共通ルール
- 連絡先は全アプリで同じメールを使用
- 法務ページの最終更新日は必ず更新
- 課金の文言はAppleの条件に合わせる
- エラーメッセージは「原因 + 対処」で統一

## 4. リリース前チェック
- [ ] 利用規約URLが公開済み
- [ ] プライバシーポリシーURLが公開済み
- [ ] サポートURLが公開済み
- [ ] App Review連絡先入力済み
- [ ] スクショ/アイコン/説明文入力済み

## 5. 使い回しファイル
- 法務テンプレ: `templates/legal/terms-template-ja.html`, `templates/legal/privacy-template-ja.html`
- App Storeテンプレ: `templates/appstore/metadata-template-ja.md`
