import Foundation
import WebKit

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
    })();
    """
  }
}
