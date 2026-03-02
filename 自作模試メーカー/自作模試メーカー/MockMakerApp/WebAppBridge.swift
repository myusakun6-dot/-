import Foundation
import UIKit
import WebKit

private struct NativePrintResult: Codable {
  let success: Bool
  let message: String
}

@MainActor
final class WebAppBridge: NSObject, WKScriptMessageHandler {
  static let channel = "mockMakerNative"

  weak var webView: WKWebView?

  func attach(to userContentController: WKUserContentController) {
    userContentController.add(self, name: Self.channel)
    userContentController.addUserScript(WKUserScript(source: bootstrapScript, injectionTime: .atDocumentStart, forMainFrameOnly: true))
  }

  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    guard message.name == Self.channel else { return }
    guard let dict = message.body as? [String: Any] else { return }
    guard let id = dict["id"] as? Int, let method = dict["method"] as? String else { return }

    Task {
      switch method {
      case "purchase":
        let productID = String(dict["productID"] as? String ?? "")
        let result = await StoreKitService.shared.purchase(productID: productID)
        respondResolve(id: id, payload: result)
      case "restore":
        let restored = await StoreKitService.shared.restore()
        respondResolve(id: id, payload: restored)
      case "rewardedAd":
        let adResult = await RewardedAdService.shared.showRewardedAd()
        respondResolve(id: id, payload: adResult)
      case "print":
        let printResult = await showNativePrintDialog()
        respondResolve(id: id, payload: printResult)
      default:
        respondReject(id: id, reason: "unknown_method")
      }
    }
  }

  private func respondResolve<T: Encodable>(id: Int, payload: T) {
    guard let json = toJSONString(payload) else {
      respondReject(id: id, reason: "encode_failed")
      return
    }
    webView?.evaluateJavaScript("window.__mockMakerNativeResolve(\(id), \(json));", completionHandler: nil)
  }

  private func respondReject(id: Int, reason: String) {
    let safeReason = reason.replacingOccurrences(of: "'", with: "\\'")
    webView?.evaluateJavaScript("window.__mockMakerNativeReject(\(id), '\(safeReason)');", completionHandler: nil)
  }

  private func toJSONString<T: Encodable>(_ value: T) -> String? {
    guard let data = try? JSONEncoder().encode(value) else { return nil }
    return String(data: data, encoding: .utf8)
  }

  private var bootstrapScript: String {
    """
    (function() {
      if (window.__mockMakerNativeInit) return;
      window.__mockMakerNativeInit = true;
      var seq = 0;
      var waiters = {};

      window.__mockMakerNativeResolve = function(id, payload) {
        if (!waiters[id]) return;
        waiters[id].resolve(payload);
        delete waiters[id];
      };
      window.__mockMakerNativeReject = function(id, reason) {
        if (!waiters[id]) return;
        waiters[id].reject(new Error(reason || 'native_error'));
        delete waiters[id];
      };

      function callNative(method, payload) {
        return new Promise(function(resolve, reject) {
          var id = ++seq;
          waiters[id] = { resolve: resolve, reject: reject };
          var msg = Object.assign({ id: id, method: method }, payload || {});
          window.webkit.messageHandlers.\(Self.channel).postMessage(msg);
        });
      }

      window.MockMakerBilling = {
        purchase: function(productID) { return callNative('purchase', { productID: productID }); },
        restore: function() { return callNative('restore', {}); }
      };
      window.MockMakerAds = {
        showRewardedAd: function() { return callNative('rewardedAd', {}); }
      };
      window.MockMakerDevice = {
        print: function() { return callNative('print', {}); }
      };
    })();
    """
  }

  @MainActor
  private func showNativePrintDialog() async -> NativePrintResult {
    guard let webView else {
      return NativePrintResult(success: false, message: "webview_missing")
    }
    guard UIPrintInteractionController.isPrintingAvailable else {
      return NativePrintResult(success: false, message: "printing_unavailable")
    }

    let controller = UIPrintInteractionController.shared
    let info = UIPrintInfo(dictionary: nil)
    info.outputType = .general
    info.jobName = "自作模試メーカー"
    controller.printInfo = info
    controller.showsPaperSelectionForLoadedPapers = true
    controller.printFormatter = webView.viewPrintFormatter()

    guard topViewController() != nil else {
      return NativePrintResult(success: false, message: "presenter_missing")
    }

    return await withCheckedContinuation { continuation in
      controller.present(animated: true) { _, completed, error in
        if completed {
          continuation.resume(returning: NativePrintResult(success: true, message: "completed"))
          return
        }
        if let error {
          continuation.resume(returning: NativePrintResult(success: false, message: "error_\(error.localizedDescription)"))
          return
        }
        continuation.resume(returning: NativePrintResult(success: false, message: "cancelled"))
      }
    }
  }

  @MainActor
  private func topViewController() -> UIViewController? {
    let scene = UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first { $0.activationState == .foregroundActive }
    let root = scene?.windows.first(where: { $0.isKeyWindow })?.rootViewController
    return topMost(from: root)
  }

  private func topMost(from controller: UIViewController?) -> UIViewController? {
    if let nav = controller as? UINavigationController {
      return topMost(from: nav.visibleViewController)
    }
    if let tab = controller as? UITabBarController {
      return topMost(from: tab.selectedViewController)
    }
    if let presented = controller?.presentedViewController {
      return topMost(from: presented)
    }
    return controller
  }
}
