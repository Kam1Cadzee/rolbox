//
//  CoverIconCollectionViewCell.swift
//  Share
//
//  Created by Vadim Vereketa on 14.09.2021.
//

import UIKit

class CoverIconCollectionViewCell: UICollectionViewCell {
  var nameIcon: String = "" {
    didSet {
      setupIcon();
    }
  };
  var viewIcon: UIView! = nil;
  var circle: CircularProgressView! = nil;
  var checkIcon: UIView!;
  
  override var isSelected: Bool {
    willSet {
      anim(newValue: newValue);
    }
  }
  
  func anim(newValue: Bool, _ withoutAnimation: Bool = false) {
    let duration = withoutAnimation ? 0 : 0.5;
    if newValue {
      UIView.animate(withDuration: duration, delay: 0, options: .curveEaseInOut, animations: {
        self.circle?.progress = 0.99999
      })
      UIView.animate(withDuration: duration, delay: duration / 2, options: .curveEaseInOut, animations: {
        self.checkIcon?.layer.opacity = 1;
      });
    }
    else {
      UIView.animate(withDuration: duration, delay: 0, options: .curveEaseInOut, animations: {
        self.circle?.progress = 0;
      })
      UIView.animate(withDuration: duration, delay: 0, options: .curveEaseInOut, animations: {
        self.checkIcon?.layer.opacity = 0;
      });
    }
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame);
  }
  
  func setupIcon() {
    let sizeCheckIcon: CGFloat = 22;
    circle = CircularProgressView();
    circle.translatesAutoresizingMaskIntoConstraints = false;
    circle.progress = 0;
    circle.backgroundColor = UIColor(named: "background");
    
    checkIcon = UIView(SVGNamed: "check-icon") {
      icon in
      icon.fillColor = UIColor(named: "background")?.cgColor;
      let sizeIcon = sizeCheckIcon / 2.4;
      icon.resizeToFit(CGRect(x: 0, y: 0, width: sizeIcon, height: sizeIcon))
      let offset = (sizeCheckIcon - sizeIcon) / 2;
      icon.position = CGPoint(x: offset, y: offset)
    };
    checkIcon.backgroundColor = UIColor(named: "secondary");
    checkIcon.translatesAutoresizingMaskIntoConstraints = false;
    checkIcon.clipsToBounds = true;
    checkIcon.layer.cornerRadius = sizeCheckIcon / 2;
    checkIcon.layer.borderWidth = 3;
   
    checkIcon.layer.borderColor =  UIColor(named: "background")?.cgColor;
    checkIcon.layer.opacity = 0;
    circle.addSubview(checkIcon);
    
    checkIcon.heightAnchor.constraint(equalToConstant: sizeCheckIcon).isActive = true;
    checkIcon.widthAnchor.constraint(equalToConstant: sizeCheckIcon).isActive = true;
    checkIcon.trailingAnchor.constraint(equalTo: circle.trailingAnchor).isActive = true;
    checkIcon.topAnchor.constraint(equalTo: circle.topAnchor).isActive = true;
    
    contentView.addSubview(circle);
    
    
    circle.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 1).isActive = true;
    circle.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 1).isActive = true;
    contentView.centerXAnchor.constraint(equalTo: circle.centerXAnchor).isActive = true;
    contentView.centerYAnchor.constraint(equalTo: circle.centerYAnchor).isActive = true;
    
    
    viewIcon = UIView(SVGNamed: nameIcon) {
      icon in
      let size = self.contentView.frame.height / 2;
      let h = icon.boundingBox.height;
      let w = size / h * icon.boundingBox.width;
      let offset = (size - w) / 2;
     
      icon.resizeToFit(CGRect(x: 0, y: 0, width: w, height: size));
      icon.position = CGPoint(x: offset, y: 0)
    };
    viewIcon.translatesAutoresizingMaskIntoConstraints = false;
   
    circle.addSubview(viewIcon);
    
    viewIcon.heightAnchor.constraint(equalTo: circle.heightAnchor, multiplier: 0.5).isActive = true;
    viewIcon.widthAnchor.constraint(equalTo: circle.widthAnchor, multiplier: 0.5).isActive = true;
    circle.centerXAnchor.constraint(equalTo: viewIcon.centerXAnchor).isActive = true;
    circle.centerYAnchor.constraint(equalTo: viewIcon.centerYAnchor).isActive = true;
    
    anim(newValue: isSelected, true);
  }
  
  @objc
  func press() {
    
  }
  
  override func prepareForReuse() {
    super.prepareForReuse();
    viewIcon?.removeFromSuperview();
    circle?.removeFromSuperview();
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
