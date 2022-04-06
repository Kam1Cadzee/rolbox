//
//  VisibilityType.swift
//  Share
//
//  Created by Vadim Vereketa on 20.09.2021.
//

import Foundation

enum VisibilityType: String, CaseIterable {
  case Private = "private"
  case Protected = "protected"
  case Public = "public"
  
  func getTexts() ->  (title: String, subtitle: String) {
    switch self {
    case .Private:
      return (title: "privacyPrivate".t(), subtitle: "privacyPrivateType".t())
    case .Protected:
      return (title: "privacyFriends".t(), subtitle: "privacyFriendsType".t())
    case .Public:
      return (title: "privacyPublic".t(), subtitle: "privacyPublicType".t())
    }
  }
}
