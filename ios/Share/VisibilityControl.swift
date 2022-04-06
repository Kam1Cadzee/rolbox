//
//  VisibilityControl.swift
//  Share
//
//  Created by Vadim Vereketa on 20.09.2021.
//

import UIKit

class VisibilityControl: UIControl {
  var value: VisibilityType!;
  var checked: VisibilityType! {
    didSet {
      radioView.isActive = checked == value;
    }
  };
  var handler: ((_ value: VisibilityType) -> Void)!;
  let radioView = RadioView(isActive: false);
  
  init(value: VisibilityType, handler: @escaping (_ value: VisibilityType) -> Void, checked: VisibilityType? = nil) {
    super.init(frame: CGRect.zero)
    self.value = value;
    self.handler = handler;
    self.addAnimPress(TypePressAnim.opacity)
    self.translatesAutoresizingMaskIntoConstraints = false;
    
    let gesture = UITapGestureRecognizer(target: self, action: #selector(handleTouchIn));
    gesture.numberOfTapsRequired = 1;
    gesture.numberOfTouchesRequired = 1;
    self.addGestureRecognizer(gesture)
    
    let texts = value.getTexts();
    
    let labelTitle = UILabel();
    labelTitle.translatesAutoresizingMaskIntoConstraints = false;
    labelTitle.attributedText = setupAttributedTextForVisibilityType(title: texts.title, subTitle: texts.subtitle);
    
    radioView.translatesAutoresizingMaskIntoConstraints = false;
    radioView.isActive = checked == value;
    radioView.layer.zPosition = -1;
    
    self.addSubview(labelTitle);
    self.addSubview(radioView);
    
  
    self.topAnchor.constraint(equalTo: radioView.topAnchor).isActive = true;
    self.bottomAnchor.constraint(equalTo: radioView.bottomAnchor).isActive = true;
    self.trailingAnchor.constraint(equalTo: radioView.trailingAnchor).isActive = true;
    
    labelTitle.leadingAnchor.constraint(equalTo: self.leadingAnchor).isActive = true;
    labelTitle.trailingAnchor.constraint(equalTo: radioView.leadingAnchor).isActive = true;
    labelTitle.centerYAnchor.constraint(equalTo: self.centerYAnchor).isActive = true;
  }
  
  @objc
  func handleTouchIn() {
    self.handler(value);
  }
  
  func setupAttributedTextForVisibilityType(title: String, subTitle: String) -> NSMutableAttributedString {
    let titleString = NSMutableAttributedString(string: title);
    let titleAttributes = [
      NSAttributedString.Key.foregroundColor: UIColor(named: "text"),
      NSAttributedString.Key.font: UIFont.systemFont(ofSize: 16, weight: UIFont.Weight.bold)
    ]
    let titleRange = NSMakeRange(0, title.count);
    
    titleString.addAttributes(titleAttributes as [NSAttributedString.Key : Any], range: titleRange)
    
    let subtitleString = NSMutableAttributedString(string: " (\(subTitle))");
    let subtitleAttributes = [
      NSAttributedString.Key.foregroundColor: UIColor(named: "lightText"),
      NSAttributedString.Key.font: UIFont.systemFont(ofSize: 16, weight: UIFont.Weight.light)
    ]
    let subtitleRange = NSMakeRange(0, subTitle.count + 3);
    
    subtitleString.addAttributes(subtitleAttributes as [NSAttributedString.Key : Any], range: subtitleRange)
    
    titleString.append(subtitleString);
    return titleString;
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
}
