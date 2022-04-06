//
//  UIView.swift
//  Share
//
//  Created by Vadim Vereketa on 02.09.2021.
//

import Foundation
import UIKit;

extension UIView: CAAnimationDelegate {
  var parentViewController: UIViewController? {
    var parentResponder: UIResponder? = self
    while parentResponder != nil {
      parentResponder = parentResponder?.next
      if let viewController = parentResponder as? UIViewController {
        return viewController
      }
    }
    return nil
  }
  
  func rotate(_ value: Double) {
    /*
     let rotation : CABasicAnimation = CABasicAnimation(keyPath: "transform.rotation.z")
     rotation.toValue = NSNumber(value: value * Double.pi / 180)
     rotation.duration = 0.3
     rotation.fillMode = .both;
     rotation.repeatCount = 1;
     rotation.delegate = self;
     
     self.layer.add(rotation, forKey: "rotationAnimation")
     */
    
    UIView.animate(withDuration: 0.3) {[weak self] in
      self?.transform = CGAffineTransform(rotationAngle: CGFloat(value * Double.pi / 180))
    }
    
    
  }
}


extension UIImageView {
  func downloaded(from url: URL, contentMode mode: ContentMode = .scaleAspectFit) {
    contentMode = mode
    URLSession.shared.dataTask(with: url) { data, response, error in
      guard
        let httpURLResponse = response as? HTTPURLResponse, httpURLResponse.statusCode == 200,
        let mimeType = response?.mimeType, mimeType.hasPrefix("image"),
        let data = data, error == nil,
        let image = UIImage(data: data)
      else { return }
      DispatchQueue.main.async() { [weak self] in
        self?.image = image
      }
    }.resume()
  }
  
  func downloaded(from url: URL, contentMode mode: ContentMode = .scaleAspectFit, _ complation: @escaping (_ image: UIImage?) -> Void) {
    contentMode = mode
    URLSession.shared.dataTask(with: url) { data, response, error in
      guard
        let httpURLResponse = response as? HTTPURLResponse, httpURLResponse.statusCode == 200,
        let mimeType = response?.mimeType, mimeType.hasPrefix("image"),
        let data = data, error == nil,
        let image = UIImage(data: data)
      else {
        complation(nil);
        return;
      }
      complation(image);
    }.resume()
  }
}

extension String {
  func t() -> String {
    return NSLocalizedString(self, comment: "");
  }
}

enum TypePressAnim {
  case opacity
}

extension UIControl {
  convenience init(_ type: TypePressAnim) {
    self.init()
    
    addAnimPress(type);
  }
  
  func addAnimPress(_ type: TypePressAnim) {
    self.addTarget(self, action: #selector(touchDragInside(_:)), for: UIControl.Event.touchDown)
    self.addTarget(self, action: #selector(touchUpInside(_:)), for: UIControl.Event.touchCancel)
    self.addTarget(self, action: #selector(touchUpInside(_:)), for: UIControl.Event.touchUpInside)
  }
  
  @objc func touchDragInside(_ sender: UIButton) {
    UIView.animate(withDuration: 0.2) {
      sender.layer.opacity = 0.7;
    }
  }
  @objc func touchUpInside(_ sender: UIButton) {
    UIView.animate(withDuration: 0.2) {
      sender.layer.opacity = 1;
    }
  }
  
  
}

extension URL {
  static func localURLForXCAsset(name: String, ext: String) -> URL? {
        let fileManager = FileManager.default
        guard let cacheDirectory = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first else {return nil}
        let url = cacheDirectory.appendingPathComponent("\(name)\(ext)")
        let path = url.path
        if !fileManager.fileExists(atPath: path) {
            guard let image = UIImage(named: name), let data = image.pngData() else {return nil}
            fileManager.createFile(atPath: path, contents: data, attributes: nil)
        }
        return url
    }
}
