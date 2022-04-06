//
//  DropdownWIshlist.swift
//  Share
//
//  Created by Vadim Vereketa on 03.09.2021.
//

import Foundation
import UIKit

class DropdownWishlist: Dropdown<Wishlist>, IDropdownSelectItem {
  var options: [Wishlist] = [];
  var vc: WishlistViewController? = nil;
  
  func selectItem(_ item: Any) {
    guard let item = item as? Wishlist else {
      return;
    }
    self.value = item;
  }
  
  typealias ItemType = Wishlist;
  
  func setOptions(_ options: [Wishlist] = []) {
    self.options = options;
    self.vc?.setOptions(options);
  }
  
  override var heightDropdown: CGFloat {
    get {
      return 250;
    }
  }
  override func instantiateViewController() -> UIViewController? {
    guard let popVC = UIStoryboard(name: "MainInterface", bundle: nil).instantiateViewController(withIdentifier: "wishlistPoper") as? WishlistViewController else {
      return nil;
    }
    vc = popVC;
    popVC.options = self.options;
    popVC.delegateSelect = self;
    return popVC;
  }
  
  override func formatValue(_ value: Wishlist?) -> String {
    return value?.name ?? "";
  }
  
  
}
