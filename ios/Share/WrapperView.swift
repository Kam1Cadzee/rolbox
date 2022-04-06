//
//  WrapperView.swift
//  Share
//
//  Created by Vadim Vereketa on 16.08.2021.
//

import UIKit

class WrapperView: UIView {  
  var titleLabel: UILabel = {
    let label = UILabel();
    label.translatesAutoresizingMaskIntoConstraints = false;
    label.textColor = UIColor(named: "text");
    return label;
  }();
  var errorLabel: UILabel? = nil;
  var errorText: String? = nil {
    willSet {
      errorLabel?.text = newValue;
      animError(newValue != nil);
    }
  };
  var validationRule: ValidationRule? = nil;
 
  var isFocus: Bool = false {
    didSet {
      animBorder();
    }
  }
  
  var isRequired: Bool! = false;
  var wrapperView: UIView = {
    let view = UIView();
    view.layer.borderWidth = 1;
    view.layer.borderColor = UIColor(named: "border")?.cgColor;
    view.layer.cornerRadius = 4;
    view.translatesAutoresizingMaskIntoConstraints = false;
    return view;
  }();
  
  
  init(titleContent: String, view: UIView, validationRule: ValidationRule?, isRequired: Bool?) {
    super.init(frame: CGRect.zero);
    self.validationRule = validationRule;
   
    self.translatesAutoresizingMaskIntoConstraints = false;
    self.isRequired = isRequired ?? false;
    
    self.wrapperView.addSubview(view);
    self.addSubview(titleLabel);
    self.addSubview(wrapperView);
    
    setupLabelText(titleContent);
    labelConstaraints();
    wrapperViewConstraints();
    innerViewConstraints(view);
    setupErrorLabel();
    errorConstaraints();
  }
  
  required init(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func animBorder() {
    
    if isFocus {
      UIView.transition(with: self.wrapperView, duration: 0.3, options: .transitionCrossDissolve) {
        self.wrapperView.layer.borderColor = UIColor(named: "text")?.cgColor;
      }
    }
    else {
      UIView.transition(with: self.wrapperView, duration: 0.3, options: .transitionCrossDissolve) {
        self.wrapperView.layer.borderColor = UIColor(named: "border")?.cgColor;
      }
    }
  }
  
  func animError(_ isShow: Bool) {
    guard let errorLabel = errorLabel else {
      return;
    }
    
    if isShow {
      UIView.transition(with: errorLabel, duration: 0.3, options: .transitionCrossDissolve) {
        errorLabel.textColor = UIColor(named: "errorColor");
      }
    }
    else {
      UIView.transition(with: errorLabel, duration: 0.3, options: .transitionCrossDissolve) {
       errorLabel.textColor = UIColor(named: "background");
      }
    }
  }
  
  func setupErrorLabel() {
    if isRequired || validationRule != nil {
      errorLabel = UILabel();
      errorLabel?.textColor = UIColor(named: "background");
      errorLabel?.translatesAutoresizingMaskIntoConstraints = false;
      errorLabel?.font = UIFont.systemFont(ofSize: 12);
      self.addSubview(errorLabel!);
    }
  }

  func setupLabelText(_ text: String) {
    if !self.isRequired {
      self.titleLabel.text = text;
      return;
    }
    
    let firstString = NSMutableAttributedString(string: text);
    
    let secondAttributes = [NSAttributedString.Key.foregroundColor: UIColor(named: "errorColor")]
    let secondString = NSAttributedString(string: " *", attributes: secondAttributes as [NSAttributedString.Key : Any])
    
    firstString.append(secondString)
  
    self.titleLabel.attributedText = firstString;
  }
  
  func errorConstaraints() {
    guard let errorLabel = errorLabel else {
      return;
    }
    errorLabel.topAnchor.constraint(equalTo: self.wrapperView.bottomAnchor, constant: 2).isActive = true;
    errorLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 0).isActive = true;
    errorLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: 0).isActive = true;
  }
  
  func labelConstaraints() {
    titleLabel.topAnchor.constraint(equalTo: self.topAnchor, constant: 0).isActive = true;
    titleLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 0).isActive = true;
    titleLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: 0).isActive = true;
  }
  
  func wrapperViewConstraints() {
    self.leadingAnchor.constraint(equalTo: wrapperView.leadingAnchor, constant: 0).isActive = true;
    self.trailingAnchor.constraint(equalTo: wrapperView.trailingAnchor, constant: 0).isActive = true;
    self.bottomAnchor.constraint(equalTo: wrapperView.bottomAnchor, constant: 10).isActive = true;
    wrapperView.topAnchor.constraint(equalTo: self.titleLabel.bottomAnchor, constant: 8).isActive = true;
  }
  
  func innerViewConstraints(_ innerView: UIView) {
    let padding: CGFloat = 16;
    innerView
      .translatesAutoresizingMaskIntoConstraints = false;
    
    innerView.trailingAnchor.constraint(equalTo:  self.wrapperView.trailingAnchor, constant: -padding).isActive = true;
    innerView.leadingAnchor.constraint(equalTo:  self.wrapperView.leadingAnchor, constant: padding).isActive = true;
    innerView.topAnchor.constraint(equalTo:  self.wrapperView.topAnchor, constant: padding).isActive = true;
    innerView.bottomAnchor.constraint(equalTo:  self.wrapperView.bottomAnchor, constant: -padding).isActive = true;
   
  }
  
  func validateRules() -> Bool {
    return true;
  }
}


