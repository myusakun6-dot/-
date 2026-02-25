import Foundation
import StoreKit

struct BillingPurchaseResult: Codable {
  let success: Bool
  let productID: String
  let expiresAtMs: Int64?
  let message: String
}

@MainActor
final class StoreKitService {
  static let shared = StoreKitService()

  // Replace with your real App Store product IDs.
  private let productIDs: Set<String> = [
    "com.mockmaker.adfree.monthly",
    "com.mockmaker.adfree.yearly"
  ]

  private init() {}

  func purchase(productID: String) async -> BillingPurchaseResult {
    guard productIDs.contains(productID) else {
      return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "unknown_product")
    }

    do {
      let products = try await Product.products(for: [productID])
      guard let product = products.first else {
        return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "product_not_found")
      }

      let purchaseResult = try await product.purchase()
      switch purchaseResult {
      case .success(let verification):
        let transaction = try checkVerified(verification)
        await transaction.finish()
        let expires = transaction.expirationDate?.timeIntervalSince1970
        let expiresMs = expires.map { Int64($0 * 1000) }
        return BillingPurchaseResult(success: true, productID: productID, expiresAtMs: expiresMs, message: "purchased")
      case .userCancelled:
        return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "cancelled")
      case .pending:
        return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "pending")
      @unknown default:
        return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "unknown")
      }
    } catch {
      return BillingPurchaseResult(success: false, productID: productID, expiresAtMs: nil, message: "error_\(error.localizedDescription)")
    }
  }

  func restore() async -> [BillingPurchaseResult] {
    var restored: [BillingPurchaseResult] = []
    do {
      try await AppStore.sync()
      for await entitlement in Transaction.currentEntitlements {
        do {
          let transaction = try checkVerified(entitlement)
          guard productIDs.contains(transaction.productID) else { continue }
          let expires = transaction.expirationDate?.timeIntervalSince1970
          let expiresMs = expires.map { Int64($0 * 1000) }
          restored.append(
            BillingPurchaseResult(
              success: true,
              productID: transaction.productID,
              expiresAtMs: expiresMs,
              message: "restored"
            )
          )
        } catch {
          continue
        }
      }
    } catch {
      return [
        BillingPurchaseResult(success: false, productID: "", expiresAtMs: nil, message: "restore_error_\(error.localizedDescription)")
      ]
    }
    return restored
  }

  private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    switch result {
    case .unverified:
      throw StoreError.failedVerification
    case .verified(let safe):
      return safe
    }
  }
}

enum StoreError: Error {
  case failedVerification
}
