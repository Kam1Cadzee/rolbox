//
//  CircleProgressView.swift
//
//
//  Created by Eric Rolf on 8/11/14.
//  Copyright (c) 2014 Eric Rolf, Cardinal Solutions Group. All rights reserved.
//

import UIKit

public class CircularProgressView: UIView {
  
  public dynamic var progress: CGFloat = 0 {
    didSet {
      progressLayer.progress = progress
    }
  }
  
  fileprivate var progressLayer: CircularProgressLayer {
    return layer as! CircularProgressLayer
  }
  
  override public class var layerClass: AnyClass {
    return CircularProgressLayer.self
  }
  
  
  override public func action(for layer: CALayer, forKey event: String) -> CAAction? {
    if event == #keyPath(CircularProgressLayer.progress),
       let action = action(for: layer, forKey: #keyPath(backgroundColor)) as? CAAnimation,
       let animation: CABasicAnimation = (action.copy() as? CABasicAnimation) {
      animation.keyPath = #keyPath(CircularProgressLayer.progress)
      animation.fromValue = progressLayer.progress
      animation.toValue = progress
      animation.fillMode = .forwards;
      animation.isRemovedOnCompletion = true;
      self.layer.add(animation, forKey: #keyPath(CircularProgressLayer.progress))
      return animation
    }
    return super.action(for: layer, forKey: event)
  }
  
}



/*
 * Concepts taken from:
 * https://stackoverflow.com/a/37470079
 */
fileprivate class CircularProgressLayer: CALayer {
  @NSManaged var progress: CGFloat
  let offset: CGFloat = -45 * .pi / 180;
  let startAngle: CGFloat = 0;
  let twoPi: CGFloat = .pi
  let halfPi: CGFloat = 0
  
  
  override class func needsDisplay(forKey key: String) -> Bool {
    if key == #keyPath(progress) {
      return true
    }
    return super.needsDisplay(forKey: key)
  }
  
  override func draw(in ctx: CGContext) {
    super.draw(in: ctx)
    
    UIGraphicsPushContext(ctx)
    
    //Light Grey
    //UIColor.white.setStroke()
    
    let center = CGPoint(x: bounds.midX, y: bounds.midY)
    let strokeWidth: CGFloat = 2
    let radius = (bounds.size.width / 2) - strokeWidth
    
    
    
    //Red
    UIColor(named: "secondary")?.setStroke()
    
    let degree = progress * 360;
    let endAngle = degree * .pi / 180 + offset;
    
    let pathProgress = UIBezierPath(arcCenter: center, radius: radius, startAngle: startAngle + offset, endAngle: endAngle , clockwise: true)
    pathProgress.lineWidth = strokeWidth
    pathProgress.lineCapStyle = .round
    pathProgress.stroke()
    
    UIGraphicsPopContext()
  }
}

