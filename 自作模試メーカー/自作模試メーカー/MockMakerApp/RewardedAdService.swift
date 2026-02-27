import Foundation

struct RewardedAdResult: Codable {
  let completed: Bool
}

@MainActor
final class RewardedAdService {
  static let shared = RewardedAdService()

  private init() {}

  // TODO: Replace this fallback with real rewarded ad SDK callback.
  func showRewardedAd() async -> RewardedAdResult {
    try? await Task.sleep(nanoseconds: 1_000_000_000)
    return RewardedAdResult(completed: true)
  }
}
