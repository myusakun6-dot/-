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
    title = "自作模試メーカー"
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
    guard let root = Bundle.main.resourceURL?.appendingPathComponent("web", isDirectory: true) else {
      return
    }
    let indexURL = root.appendingPathComponent("index.html")
    webView.loadFileURL(indexURL, allowingReadAccessTo: root)
  }
}
