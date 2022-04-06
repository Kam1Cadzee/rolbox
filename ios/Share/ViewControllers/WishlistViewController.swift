//
//  WishlistViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 02.09.2021.
//

import UIKit
import SwiftSVG

class WishlistViewController: UIViewController {
  @IBOutlet weak var viewAddWishlist: UIView!
  @IBOutlet weak var stackVIew: UIStackView!
    @IBOutlet weak var addWishlistButton: UIButton!
    var delegateSelect: IDropdownSelectItem? = nil;
  
  var options: [Wishlist] = [];
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Do any additional setup after loading the view.
    
    setTitleAddWishlistButton();
    addTopAndBottomBorders();
    setupWishlists();
  }

  func setTitleAddWishlistButton() {
    let attr = [
      NSAttributedString.Key.underlineStyle: NSUnderlineStyle.single.rawValue,
      NSAttributedString.Key.foregroundColor: UIColor(named: "accent")!
    ] as [NSAttributedString.Key : Any];
    
    let plusString = NSMutableAttributedString(string: "+  ");
    let attrString = NSMutableAttributedString(string: "addWishlist".t(), attributes: attr);
    
    plusString.append(attrString);
    
    addWishlistButton.setAttributedTitle(plusString, for: UIControl.State.normal);
  }
  
  func addTopAndBottomBorders() {
    let thickness: CGFloat = 1;
    let topBorder = CALayer()
    topBorder.frame = CGRect(x: 0.0, y: 0.0, width: self.viewAddWishlist.frame.size.width, height: thickness)
    topBorder.backgroundColor = UIColor(named: "border")?.cgColor;
    
    
    viewAddWishlist.layer.addSublayer(topBorder)
  }
  
  func setOptions(_ options:  [Wishlist] = []) {
    self.options = options;
    stackVIew.arrangedSubviews.forEach { view in
      view.removeFromSuperview();
    };
    setupWishlists();
  }
  
  func setupWishlists() {
    for item in options.enumerated() {
      print(item.element.coverCode)
      let control = createItem(iconNamed: item.element.coverCode, title: item.element.name);
      control.tag = item.offset;
      control.addTarget(self, action: #selector(touchUpInside(_:)), for: UIControl.Event.touchUpInside);
      stackVIew.addArrangedSubview(control);
    }
  }
  
  @objc
  func touchUpInside(_  sender: UIControl) {
    delegateSelect?.selectItem(options[sender.tag]);
    dismiss(animated: true, completion: nil);
  }
  
  func createItem(iconNamed: String, title: String) -> UIControl {
    let SIZE_ICON: CGFloat = 30;
    
    let control = UIControl(TypePressAnim.opacity);
    control.translatesAutoresizingMaskIntoConstraints = false;
    let iconView = UIView(SVGNamed: iconNamed) {
      icon in
      icon.resizeToFit(CGRect(x: 0, y: 0, width: SIZE_ICON, height: SIZE_ICON))
    };
    
    iconView.translatesAutoresizingMaskIntoConstraints = false;
    let titleLabel = UILabel();
    titleLabel.text = title;
    titleLabel.textColor = UIColor(named: "text");
    titleLabel.translatesAutoresizingMaskIntoConstraints = false;
    
    control.addSubview(iconView);
    control.addSubview(titleLabel)
    iconView.heightAnchor.constraint(equalToConstant: SIZE_ICON).isActive = true;
    iconView.widthAnchor.constraint(equalToConstant: SIZE_ICON).isActive = true;
    
    control.leadingAnchor.constraint(equalTo: iconView.leadingAnchor, constant: -20).isActive = true;
    control.topAnchor.constraint(equalTo: iconView.topAnchor, constant: -10).isActive = true;
    control.bottomAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 10).isActive = true;
    
    titleLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 20).isActive = true;
    titleLabel.trailingAnchor.constraint(equalTo: control.trailingAnchor, constant: 0).isActive = true;
    titleLabel.topAnchor.constraint(equalTo: control.topAnchor, constant: 0).isActive = true;
    titleLabel.bottomAnchor.constraint(equalTo: control.bottomAnchor, constant: 0).isActive = true;
    
    return control;
  }
  
  func unwind(_ unwindSegue: UIStoryboardSegue) {
  
  }
  
}
