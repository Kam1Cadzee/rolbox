//
//  User.swift
//  Share
//
//  Created by Vadim Vereketa on 09.09.2021.
//

import Foundation

struct User: Decodable {
  var _id: String;
  var ownedWishlists: [Wishlist];
  var firstName: String?;
  var lastName: String?;
  
  func getFullName() -> String {
    return "\(firstName ?? "") \(lastName ?? "")"
  }
}
