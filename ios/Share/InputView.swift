//
//  InputView.swift
//  Share
//
//  Created by Vadim Vereketa on 25.08.2021.
//

import Foundation
import UIKit

class InputView: WrapperView, IValueForm {
  var value: String? {
    get {
      return textView?.text;
    }
    set {
      textView?.text = newValue;
    }
  }
  
  var handlerChangeCharactersIn: [SignatureValidation] = [];
  
  let textView: UITextField!;
  
  init(titleContent: String,  validationRule: ValidationRule?, isRequired: Bool = false, placeholder: String?, defaultValue: String? = "", keyboardType: UIKeyboardType = .default) {
    
    textView = UITextField();
    textView.borderStyle = .none;
    textView.translatesAutoresizingMaskIntoConstraints = false;
    textView.font = UIFont.systemFont(ofSize: 16);
    textView.keyboardType = keyboardType;
    textView.keyboardAppearance = .light;
    textView.textColor = UIColor(named: "text")
    
    let attributeString = NSAttributedString(string: placeholder ?? "", attributes:
                                              [
                                                NSAttributedString.Key.foregroundColor: UIColor(named: "lightText")!
                                              ])
    textView.attributedPlaceholder = attributeString;
    
    
    super.init(titleContent: titleContent, view: textView, validationRule: validationRule, isRequired: isRequired);
    
    value = defaultValue;
    
    if isRequired {
      if self.validationRule == nil {
        self.validationRule = ValidationRule();
      }
      self.validationRule?.addRule({ value in
        if value == nil {
          return true;
        }
        return value as? String == "";
      }, textError: "errorRequired".t())
    }
    
    textView.addTarget(self, action: #selector(textFieldDidChange), for: UIControl.Event.editingChanged)
    textView.delegate = self;
  }
  
  @objc
  func textFieldDidChange() {
    validateRules();
  }
  
  override func validateRules() -> Bool {
    let strError = self.validationRule?.validValue(textView.text);
    self.errorText = strError;
    print(strError)
    return strError == nil ? true : false;
  }
  
  required init(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}

extension InputView: UITextFieldDelegate {
  func textFieldDidBeginEditing(_ textField: UITextField) {
    self.isFocus = true;
  }
  
  func textFieldDidEndEditing(_ textField: UITextField) {
    self.isFocus = false;
  }
  
  override func canPerformAction(_ action: Selector, withSender sender: Any?) -> Bool {
    false
  }
  
  
  func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    if self.handlerChangeCharactersIn.count != 0 {
      for handle in self.handlerChangeCharactersIn {
        if !handle(textField, range, string) {
          return false;
        }
      }
    }
    return true;
  }
}
