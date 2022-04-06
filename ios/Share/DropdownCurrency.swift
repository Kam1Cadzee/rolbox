//
//  DropdownWIshlist.swift
//  Share
//
//  Created by Vadim Vereketa on 03.09.2021.
//

import Foundation
import UIKit

class DropdownCurrency: Dropdown<Currency>, IDropdownSelectItem {
  func selectItem(_ item: Any) {
    guard let item = item as? Option<String, Currency> else {
      return;
    }
    self.value = item.value;
  }
  
  
  typealias ItemType = Option<String, Currency>;
  
  override var heightDropdown: CGFloat {
    get {
      return 150;
    }
  }
  override func instantiateViewController() -> UIViewController? {
    
    guard let popVC = UIStoryboard(name: "MainInterface", bundle: nil).instantiateViewController(withIdentifier: "currencyPopover") as? CurrencyDropdownViewController else {
      return nil;
    }
    
    popVC.options = Currency.allCases.map { currency in
      let option = Option<String, Currency>(id: currency.rawValue, value: currency);
      return option;
    };
    popVC.delegateSelect = self;
    
    return popVC;
  }
  
  override func formatValue(_ value: Currency?) -> String {
    guard let value = value else {
      return "";
    }
   
    return value.getFormatValue();
  }
  
}
