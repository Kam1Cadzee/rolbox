//
//  UIViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 23.09.2021.
//

import Foundation
import UIKit

public class HelperKeyboardDisplaying {
  var view: UIView!;
  var scrollView: UIScrollView!;
  
  init(view: UIView, scrollView: UIScrollView) {
    self.view = view;
    self.scrollView = scrollView;
  }
  
  func subscribeNotificationKeyboard() {
    NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillShowOrHide), name: UIResponder.keyboardWillShowNotification, object: nil);
    NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWillShowOrHide), name: UIResponder.keyboardWillHideNotification, object: nil)
  };
  
  func unsubscribeFromAllNotifications() {
    NotificationCenter.default.removeObserver(self)
  }
  
  @objc private func keyboardWillShowOrHide(notification: NSNotification) {
    // Get required info out of the notification
    if let scrollView = scrollView, let userInfo = notification.userInfo, let endValue = userInfo[UIResponder.keyboardFrameEndUserInfoKey], let durationValue = userInfo[UIResponder.keyboardAnimationDurationUserInfoKey], let curveValue = userInfo[UIResponder.keyboardAnimationCurveUserInfoKey] {
      
      // Transform the keyboard's frame into our view's coordinate system
      let cgRectValue = (endValue as AnyObject).cgRectValue!;
      let viewWindow = view.window;
      
      let endRect = view.convert(cgRectValue, from: viewWindow)
      // Find out how much the keyboard overlaps our scroll view
      
      let window = viewWindow;
      let bottomPadding = window?.safeAreaInsets.bottom ?? 0;
      
      var keyboardOverlap = scrollView.frame.maxY - endRect.origin.y;
      keyboardOverlap = keyboardOverlap < 0 ? 0 : keyboardOverlap + bottomPadding;
      
      scrollView.contentInset.bottom = keyboardOverlap
      scrollView.scrollIndicatorInsets.bottom = keyboardOverlap
      
      let duration = (durationValue as AnyObject).doubleValue
      let options = UIView.AnimationOptions(rawValue: UInt((curveValue as AnyObject).integerValue << 16))
      UIView.animate(withDuration: duration!, delay: 0, options: options, animations: {
        self.view.layoutIfNeeded()
      }, completion: nil)
    }
  }
}
