//
//  AddPhotoView.swift
//  Share
//
//  Created by Vadim Vereketa on 05.09.2021.
//

import UIKit
import SwiftSVG

enum TypeUploadImage {
  case url(String)
  case image(UIImage)
  case base64
}

//file:///private/var/mobile/Containers/Data/PluginKitPlugin/D6AF972E-6B2A-438C-A960-54A61D6A7C11/tmp/143BA168-FE35-47E8-A363-DE99CAC5F111.png

//assets-library://asset/asset.PNG?id=C67D95B0-3ACD-48AA-89E2-90779CAFD3B5&ext=PNG
//60b62793be5cc10151ed5c10
// eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi0JLQsNC00LjQvCDQktC10YDQtdC60LXRgtCwIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnprSW9VRDhkQi1XVElyTlY2LXFnVEsxQnR2U0tkdFlHVDlFYWR4PXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2h1c3BpLXJvbC1ib3giLCJhdWQiOiJodXNwaS1yb2wtYm94IiwiYXV0aF90aW1lIjoxNjIyOTAwMjM3LCJ1c2VyX2lkIjoiUGpGcHpaOGFCOVZHWlI4SmliMXB0aGE4ZEd5MSIsInN1YiI6IlBqRnB6WjhhQjlWR1pSOEppYjFwdGhhOGRHeTEiLCJpYXQiOjE2MzExOTg0MTEsImV4cCI6MTYzMTIwMjAxMSwiZW1haWwiOiJ2YWRpbS52ZXJla2V0YUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNTkzNzI3ODkzNzI5MzMzNTgzOCJdLCJlbWFpbCI6WyJ2YWRpbS52ZXJla2V0YUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.sVDawii-1nhLjsZtjP66M7z6ZGLigcoMSWjCTYQoPU5JufH98Fno61Oi7kCcaJg3K2LLqyqOsxXNJxCCRg3sWuxTnvmzsqkkbAWMoBwBOhCp_0cTclXOZ_LXiTkv2SgDrcdUWouHjK8CddozPi9Gypp4aUNIY3UqgAQ3MMrcAq4j6nc7Bzd-mw1CqydLmlUIaf0ruAjaIUsnMkMWCw9-HUtY4A7DZaGxoFWmbFs08jYhhYek7qL4hTR16BeqnzW9SIIbevVxvx4gNn5y_pmriuNb5yZpfiZVfu8FxO16dCLxu4cuupx4CHl0HBsmd3OcuOpiuhXPiNTHZgxIND6IhQ

class AddPhotoView: UIView, IValueForm {
  typealias ItemType = TypeUploadImage;
  var value: TypeUploadImage? = .none;
  
  var image: UIImage? {
    didSet {
      updateImage();
    }
  };
  var imageView: UIImageView!;
  var iconView: UIView!;
  var button: UIButton!;
  var imagePicker: ImagePicker!;
  var constraintsImage: [NSLayoutConstraint] = [];
  
  private let SIZE_ICON: CGFloat = 50;
  
  func updateImage() {
    if image != nil {
      self.imageView.image = image;
      self.addSubview(self.imageView);
      self.button.isEnabled = false;
      self.button.isUserInteractionEnabled = false;
      
      for c in constraintsImage {
        c.isActive = true;
      }
      
    }
    else {
      for c in constraintsImage {
        c.isActive = false;
      }
      self.imageView.removeFromSuperview();
     
      self.button.isEnabled = true;
      self.button.isUserInteractionEnabled = true;
    }
  }
  
  init(presentationController: UIViewController, url: URL? = nil) {
    super.init(frame: CGRect.zero);
    self.imagePicker = ImagePicker(presentationController: presentationController, delegate: self);
    
    self.imageView = UIImageView();
    self.imageView.contentMode = .scaleAspectFit;
    self.imageView.translatesAutoresizingMaskIntoConstraints = false;
    
    let tapGesture = UITapGestureRecognizer();
    tapGesture.numberOfTapsRequired = 1;
    tapGesture.numberOfTouchesRequired = 1;
  
    tapGesture.addTarget(self, action: #selector(tappedAddPhoto));
    self.imageView.addGestureRecognizer(tapGesture);
    
    self.imageView.isUserInteractionEnabled = true;
    
    if url != nil {
      self.imageView.downloaded(from: url!) {
        image in
        if image != nil {
          DispatchQueue.main.async {
            self.image = image;
            self.value = .url(url!.absoluteString);
          }
        }
      }
    }
    constraintsImage = [
      self.imageView.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 0),
      self.imageView.topAnchor.constraint(equalTo: self.topAnchor, constant: 0),
      self.imageView.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: 0),
      self.imageView.widthAnchor.constraint(equalTo: self.widthAnchor),
      self.imageView.heightAnchor.constraint(equalTo: self.widthAnchor, multiplier: 3 / 4)
    ];
    
    
    self.translatesAutoresizingMaskIntoConstraints = false;
    self.backgroundColor = UIColor(named: "backgroundLight");
    self.layer.cornerRadius = 4;
    
    iconView = UIView(SVGNamed: "add_picture_icon") {
      icon in
      icon.resizeToFit(CGRect(x: 0, y: 0, width: self.SIZE_ICON, height: self.SIZE_ICON));
    };
    iconView.translatesAutoresizingMaskIntoConstraints = false;
    
    button = UIButton();
    button.translatesAutoresizingMaskIntoConstraints = false;
    let attrs = [
      NSAttributedString.Key.font : UIFont.systemFont(ofSize: 12),
      NSAttributedString.Key.underlineStyle: NSUnderlineStyle.single.rawValue,
      NSAttributedString.Key.foregroundColor : UIColor(named: "accent")!
    ] as [NSAttributedString.Key : Any]
    let attrString = NSMutableAttributedString(string: "Add photo", attributes:attrs)
    button.setAttributedTitle(attrString, for: UIControl.State.normal)
    button.addTarget(self, action: #selector(tappedAddPhoto), for: UIControl.Event.touchUpInside)
    
    self.addSubview(iconView);
    self.addSubview(button);
    
    setupConstraints();
  }
  
  @objc
  private func tappedAddPhoto() {
    self.imagePicker.present();
  }
  
  func setupConstraints() {
    iconView.heightAnchor.constraint(equalToConstant: self.SIZE_ICON).isActive = true;
    iconView.widthAnchor.constraint(equalToConstant: self.SIZE_ICON).isActive = true;
    iconView.topAnchor.constraint(equalTo: self.topAnchor, constant: 40).isActive = true;
    iconView.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true;
    
    button.topAnchor.constraint(equalTo: iconView.bottomAnchor, constant: 10).isActive = true;
    self.bottomAnchor.constraint(equalTo: button.bottomAnchor, constant: 40).isActive = true;
    button.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true;
    
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
}

extension AddPhotoView: ImagePickerDelegate {
  func didSelect(image: UIImage?) {
    if image != nil {
     
      self.image = image;
      self.value = .image(image!);
    }
   
  }
  
  
}
