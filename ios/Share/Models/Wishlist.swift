//
//  WishlistCreate.swift
//  Share
//
//  Created by Vadim Vereketa on 10.09.2021.
//

import Foundation

struct Wishlist: Decodable {
  var _id: String;
  var name: String;
  var coverCode: String;
}

struct WishlistPost {
  var name: String;
   var visibility: String;
   var coverCode: String;
   var forWhom: String;
   var note: String?;
}
