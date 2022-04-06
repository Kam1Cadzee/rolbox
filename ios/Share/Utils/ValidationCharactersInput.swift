//
//  ValidationCharactersInput.swift
//  Share
//
//  Created by Vadim Vereketa on 10.09.2021.
//

import Foundation
import UIKit

typealias SignatureValidation = (_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool;

class ValidationCharactersInput {
  static func onlyNumbers(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
    let allowedCharacters = CharacterSet.decimalDigits;
  
    let characterSet = CharacterSet(charactersIn: string)
    return allowedCharacters.isSuperset(of: characterSet)
  }
  
  static func withoutFirstZero(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
    return !(range.lowerBound == 0 && string == "0");
  }
  
  static func maxLengthOfString(_ max: Int) -> SignatureValidation {
    func anonim(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
      
      if string == "" {
        return true;
      }
      return (textField.text?.count ?? 0) < max;
    }
    
    return anonim;
  }
  
  static func maxValueOfString(_ max: Double) -> SignatureValidation {
    func anonim(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
      if range.lowerBound != range.upperBound {
        return true;
      }
      if string == "" {
        return true;
      }
      let n = Double((textField.text ?? "") + string);
      if n == nil {
        return true;
      }
      
      return n! < max;
    }
    
    return anonim;
  }
  
  static func onlyOnePoint(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
    if string == "," {
      return false;
    }
    if string == "." {
      return !(textField.text ?? "").contains(".")
    }
    return true;
  }
  
  static func twoDigitsAfterPoint(_ textField: UITextField, _ range: NSRange, _ string: String) -> Bool {
    if range.lowerBound != range.upperBound {
      return true;
    }
    if textField.text == nil {
      return true;
    }
    
    let firstIndex = textField.text!.firstIndex(of: ".");
  
    if firstIndex != nil {
      let strAfterPoint = textField.text![firstIndex!...];
      if strAfterPoint.count == 3 {
        if range.lowerBound >= textField.text!.count - 2 {
          return false;
        }
      }
    }
   
    
    return true;
  }
}
