//
//  Option.swift
//  Share
//
//  Created by Vadim Vereketa on 08.09.2021.
//

import Foundation

struct Option<T, V> {
  var id: T;
  var value: V;
}

enum Currency: String, CaseIterable {
  case uah
  case usd
  case eur
  
  func getFormatValue() -> String {
    return self.rawValue.uppercased();
  }
}
