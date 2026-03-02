import UIKit
import WebKit

final class RootViewController: UIViewController, WKNavigationDelegate {
  private let webView: WKWebView
  private let bridge = WebAppBridge()

  init() {
    let userContentController = WKUserContentController()
    let config = WKWebViewConfiguration()
    config.userContentController = userContentController
    config.defaultWebpagePreferences.allowsContentJavaScript = true
    webView = WKWebView(frame: .zero, configuration: config)
    super.init(nibName: nil, bundle: nil)
    bridge.attach(to: userContentController)
    bridge.webView = webView
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = .systemBackground
    webView.navigationDelegate = self
    webView.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(webView)
    NSLayoutConstraint.activate([
      webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
      webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
      webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
      webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
    ])
    loadLocalApp()
  }

  private func loadLocalApp() {
    // Prefer bundled web/index.html. Fallback to top-level index.html if needed.
    if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web"),
       let root = Bundle.main.resourceURL?.appendingPathComponent("web", isDirectory: true) {
      webView.loadFileURL(url, allowingReadAccessTo: root)
      return
    }
    if let url = Bundle.main.url(forResource: "index", withExtension: "html"),
       let root = Bundle.main.resourceURL {
      webView.loadFileURL(url, allowingReadAccessTo: root)
      return
    }

    let html = """
    <html><body style='font-family:-apple-system;padding:24px'>
      <h2>web/index.html が見つかりません</h2>
      <p>Xcodeで <code>web</code> フォルダの Target Membership を確認してください。</p>
    </body></html>
    """
    webView.loadHTMLString(html, baseURL: nil)
  }
}
