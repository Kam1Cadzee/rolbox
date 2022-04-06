//
//  IDropdownValue.swift
//  Share
//
//  Created by Vadim Vereketa on 08.09.2021.
//

import Foundation

protocol IValueForm {
  associatedtype ItemType
  var value: ItemType? {get set};
}

protocol IDropdownValue: IValueForm {
  func formatValue(_ value: ItemType?) -> String;
}
