//
//  Gift.swift
//  Share
//
//  Created by Vadim Vereketa on 10.09.2021.
//

import Foundation

struct Gift: Decodable {
  var _id: String;
}

struct GiftPost {
  var name: String;
  var wishlist: String;
  var websiteLink: String?;
  var quantity: Int;
  var size: String?;
  var color: String?;
  var note: String?;
  var price: Price?;
}

struct Price {
  var value: String;
  var currency: String;
}
