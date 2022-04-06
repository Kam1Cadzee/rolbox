//
//  Dropdown.swift
//  Share
//
//  Created by Vadim Vereketa on 25.08.2021.
//

import Foundation
import UIKit

fileprivate let sizeIcon: CGFloat = 10;

class Dropdown<T>: WrapperView, IDropdownViewController, IDropdownValue, UIPopoverPresentationControllerDelegate {
  typealias ItemType = T;
  var value: T? {
    didSet {
      contentLabel.text = formatValue(value);
      changeStyleLabel();
    }
  };
  
  func formatValue(_ value: T?) -> String {
    if value == nil {
      return "";
    }
    return "";
  }
  
  func instantiateViewController() -> UIViewController? {
    return nil;
  }
  
  var heightDropdown: CGFloat {
    get {
      return 100;
    }
  }
  
  var control: UIControl!;
  var contentLabel: UILabel!;
  var viewIcon: UIView!;
  
  var isOpenDropdown: Bool = false {
    didSet {
      handleDropdown();
    }
  };
  
  func changeStyleLabel() {
    if value != nil {
      contentLabel.textColor = UIColor(named: "text");
      contentLabel.font = UIFont.systemFont(ofSize: 16, weight: UIFont.Weight.bold);
    }
    else {
      contentLabel.textColor = UIColor(named: "lightText");
      contentLabel.font = UIFont.systemFont(ofSize: 14, weight: UIFont.Weight.light);
    }
  }
  
  override func validateRules() -> Bool {
    let strError = self.validationRule?.validValue(value);
    self.errorText = strError;
    return strError == nil ? true : false;
  }
  
  init(titleContent: String, validationRule: ValidationRule?, isRequired: Bool, placeholder: String, defaultValue: T? = nil) {
    control = UIControl();
    control.translatesAutoresizingMaskIntoConstraints = false;
    
    contentLabel = UILabel();
    contentLabel.translatesAutoresizingMaskIntoConstraints = false;
    contentLabel.text = placeholder;
   
    viewIcon = UIView(SVGNamed: "arrow_down") {
      icon in
      icon.resizeToFit(CGRect(x: 0, y: 0, width: sizeIcon, height: sizeIcon));
      icon.fillColor = UIColor(named: "text")?.cgColor;
    };
    viewIcon.translatesAutoresizingMaskIntoConstraints = false;
    
    control.addSubview(contentLabel);
    control.addSubview(viewIcon);
    
    
    super.init(titleContent: titleContent, view: control, validationRule: validationRule,  isRequired: isRequired);
    
    if isRequired {
      if self.validationRule == nil {
        self.validationRule = ValidationRule();
      }
      self.validationRule?.addRule({ value in
        if value == nil {
          return true;
        }
        return false;
      }, textError: "errorRequired".t())
    }
    
    contstaintsLabel();
    contstaintsViewIcon();
    setupGesure();
    changeStyleLabel();
  }
  
  private func setupGesure() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(tapped));
    tapGesture.numberOfTapsRequired = 1;
    control.addTarget(self, action: #selector(tapped), for: UIControl.Event.touchUpInside)
  }
  
  @objc
  private func tapped() {
    
    guard let popVC = instantiateViewController() else {
      return;
    }
    
    isOpenDropdown = true;
   
    popVC.modalPresentationStyle = .popover;
    popVC.popoverPresentationController?.delegate = self;
    popVC.popoverPresentationController?.sourceView = self;
    popVC.popoverPresentationController?.permittedArrowDirections = .init(rawValue: 0);
    popVC.popoverPresentationController?.popoverLayoutMargins = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    
    popVC.popoverPresentationController?.sourceRect = CGRect(x: self.wrapperView.bounds.midX, y:  self.bounds.height + self.heightDropdown / 2, width: 0, height: 0);
    
    popVC.preferredContentSize = CGSize(width: self.bounds.width, height:  self.heightDropdown);
    
    self.parentViewController?.present(popVC, animated: true, completion: nil);
    
  }
  
  func contstaintsLabel() {
    contentLabel.leadingAnchor.constraint(equalTo: control.leadingAnchor, constant: 0).isActive = true;
    contentLabel.topAnchor.constraint(equalTo: control.topAnchor, constant: 0).isActive = true;
    contentLabel.bottomAnchor.constraint(equalTo: control.bottomAnchor, constant: 0).isActive = true;
    
    
    contentLabel.trailingAnchor.constraint(equalTo: viewIcon.leadingAnchor, constant: 0).isActive = true;
  }
  
  func contstaintsViewIcon() {
    viewIcon.trailingAnchor.constraint(equalTo: control.trailingAnchor, constant: 0).isActive = true;
    control.centerYAnchor.constraint(equalTo: viewIcon.centerYAnchor).isActive = true;
    viewIcon.widthAnchor.constraint(equalToConstant: sizeIcon).isActive = true;
    viewIcon.heightAnchor.constraint(equalToConstant: sizeIcon).isActive = true;
  }
  
  func handleDropdown() {
    if isOpenDropdown {
       viewIcon.rotate(-180);
    }
    else {
      viewIcon.rotate(0);
    }
  }
  
  required init(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func adaptivePresentationStyle(for controller: UIPresentationController) -> UIModalPresentationStyle {
    return .none;
  }
  
  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    isOpenDropdown = false;
  }
}

