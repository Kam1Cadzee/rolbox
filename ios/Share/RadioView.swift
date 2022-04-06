//
//  RadioView.swift
//  Share
//
//  Created by Vadim Vereketa on 20.09.2021.
//

import UIKit

class RadioView: UIView {
  private static let SIZE: CGFloat = 24;
  private static let SMALL_SIZE: CGFloat = RadioView.SIZE / 2.2;
  
  var isActive: Bool = false {
    didSet {
      animate();
    }
  }
  let passiveColor = UIColor(named: "border");
  let activeColor = UIColor(named: "secondary");
  var smallView: UIView!;

  private func animate() {
    if isActive {
      UIView.animate(withDuration: 0.5) {
        self.layer.borderColor = self.activeColor?.cgColor;
        self.smallView.layer.opacity = 1;
      }
    }
    else {
      UIView.animate(withDuration: 0.5) {
        self.layer.borderColor = self.passiveColor?.cgColor;
        self.smallView.layer.opacity = 0;
      }
    }
  }
  
  init(isActive: Bool = false) {
    super.init(frame: CGRect.zero)
    
    self.backgroundColor = UIColor(named: "background")
    self.translatesAutoresizingMaskIntoConstraints = false;
    self.layer.borderWidth = 2;
    self.layer.borderColor = passiveColor?.cgColor;
    self.layer.cornerRadius = RadioView.SIZE / 2;
    
    self.heightAnchor.constraint(equalToConstant: RadioView.SIZE).isActive = true;
    self.widthAnchor.constraint(equalToConstant: RadioView.SIZE).isActive = true;
    
    smallView = UIView();
    smallView.translatesAutoresizingMaskIntoConstraints = false;
    smallView.backgroundColor = activeColor;
    smallView.layer.opacity = 0;
    smallView.layer.cornerRadius = RadioView.SMALL_SIZE / 2;
    
    self.addSubview(smallView);
    
    smallView.heightAnchor.constraint(equalToConstant: RadioView.SMALL_SIZE).isActive = true;
    smallView.widthAnchor.constraint(equalToConstant: RadioView.SMALL_SIZE).isActive = true;
    smallView.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true;
    smallView.centerYAnchor.constraint(equalTo: self.centerYAnchor).isActive = true;
    
    self.isActive = isActive;
    animate();
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
