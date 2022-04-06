//
//  ValidationRule.swift
//  Share
//
//  Created by Vadim Vereketa on 07.09.2021.
//

import Foundation

protocol IValidationDelegate {
  func checkRules(_ sender: ValidationRule);
}

struct Rule {
  var handle: (_ t: Any?) -> Bool;
  var textError: String;
}

class ValidationRule {
  var rules: [Rule] = [];
  var isOnValidation: Bool = true;
  
  //'Share.Rule<Swift.Optional<Any.Type>>' (0x11126b880) to 'Share.Rule<Swift.Optional<Any>>' (0x11126b750).
  func addRule(_ rule: Rule) {
    rules.append(rule);
  }
  
  func addRule(_ handle: @escaping (_ t: Any?) -> Bool, textError: String) {
    let item = Rule(handle: handle, textError: textError)
    addRule(item);
  }
  
  
  
  func validValue(_ value: Any?) -> String? {
    if !isOnValidation {
      return nil;
    }
    
    
    for rule in rules.reversed() {
      let result = rule.handle(value);
      if result {
        return rule.textError;
      }
    }
    
    return nil;
  }
}

