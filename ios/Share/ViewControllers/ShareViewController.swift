//
//  ShareViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 16.08.2021.
//

import UIKit
import Social
import Firebase
import Alamofire
import MobileCoreServices

class ShareViewController: UIViewController {
  private let ACCESS_GROUP = "8HRQVU92F4.com.rolbox";//8HRQVU92F4.com.rolbox
  @IBOutlet weak var statusLabel: UILabel!
  @IBOutlet weak var cancelButton: UIButton!
  @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
  
  var statusUnwind = "";
  var service: Service? = nil;
  var parseUrl: String = "";
  var parseWebsiteData: ParseWebsiteData? = nil;
  
  func setLabel(_ text: String) {
   // statusLabel.text = text;
  }
  override func viewDidLoad() {
    super.viewDidLoad();
    
    
    statusLabel.text = "ext1".t();
    cancelButton.setTitle("cancel".t(), for: UIControl.State.normal);
    cancelButton.addAnimPress(TypePressAnim.opacity)
    
    
    configureFirebase();
  }
  
  
  func configureFirebase() {
    if FirebaseApp.app() == nil {
      FirebaseApp.configure();
      setLabel("Firebase");
    }
    do {
      try Auth.auth().useUserAccessGroup(self.ACCESS_GROUP)
      let user = Auth.auth().currentUser;
      if user != nil {
        setLabel("user");
        //navigateToAddGift(ParseWebsiteData(currency: "usd", image: "", price: "123", title: ""))
        user?.getIDToken(completion: self.completionToken);
        
      }
      else {
        print("NO USER")
        noAuth();
      }
    } catch let error as NSError {
      noAuth();
      print("Error changing user access group: %@", error)
    }
  }
  
  private func completionToken(str: String?, error: Any?) {
    if let token = str {
      setLabel("token");
      
      Service.TOKEN = token;
      self.service = Service();
      //navigateToAddGift();
      getExtensionData();
    }
    else {
      print("NO TOKEN")
      noAuth();
    }
  }
  
  private func getExtensionData() {
    let contentTypeText = kUTTypeText as String;
    let contentTypeRUL = kUTTypeURL as String;
    let contentTypePainText = kUTTypePlainText as String; //public.plain-text
    
    if let item = extensionContext?.inputItems.first as? NSExtensionItem {
      if let attachments = item.attachments {
        print("attachments: ", attachments.count)
        var isURLType = false;
        for attachment: NSItemProvider in attachments {
          if attachment.hasItemConformingToTypeIdentifier(contentTypeRUL) {
            isURLType = true;
            break;
          }
        }
        for attachment: NSItemProvider in attachments {
         
          if attachment.hasItemConformingToTypeIdentifier(contentTypeRUL) {
            attachment.loadItem(forTypeIdentifier: contentTypeRUL, options: nil, completionHandler: parseUrlContentType);
          }
          else if !isURLType {
            if attachment.hasItemConformingToTypeIdentifier(contentTypePainText) {
              attachment.loadItem(forTypeIdentifier: contentTypePainText, options: nil, completionHandler: parseTextContentType)
              
            }else if attachment.hasItemConformingToTypeIdentifier(contentTypeText) {
              attachment.loadItem(forTypeIdentifier: contentTypeText, options: nil, completionHandler: parseTextContentType)
            }
          }
          
          
        }
        
      }
    }
  }
  
  private func parseUrlContentType(secureCoding: NSSecureCoding?, error: Error?) {
    setLabel("parseUrlContentType");
    let url = secureCoding as? URL;
    completionURL(url: url)
  }
  
  private func parseTextContentType(secureCoding: NSSecureCoding?, error: Error?) {
    guard let str = secureCoding as? String else {
      statusLabel.text = "Error data";
      return;
    }
    let pattern = "((https|http)://)((\\w|-)+)(([.]|[/])((\\w|-)+))+";
    
    let range = NSRange(location: 0, length: str.utf16.count);
    let regex = try! NSRegularExpression(pattern: pattern, options: NSRegularExpression.Options.caseInsensitive);
    
    let findRange = regex.rangeOfFirstMatch(in: str, options: [], range: range);
    
    if findRange.lowerBound > str.count {
      statusLabel.text = "Error data";
      return;
    }
    let startIndex = str.index(str.startIndex, offsetBy: findRange.lowerBound)
    let endIndex = str.index(str.startIndex, offsetBy: findRange.upperBound - 1)
    
    let substrUrl = str[startIndex...endIndex];
    print(substrUrl);
    
    let strUrl = String(substrUrl);
    
    let url = URL(string: strUrl);
    completionURL(url: url);
  }
  
  private func completionURL(url: URL?) {
    setLabel("completionURL");
    if let url = url {
      self.parseUrl = url.absoluteString;
      self.service?.parseWebsite(parseUrl: self.parseUrl, completion: completionServiceParseWebsite);
    }
    else {
      self.parseUrl = "";
      completionServiceParseWebsite(nil, nil);
    }
  }
  
  func completionServiceParseWebsite(_ data: ParseWebsiteData?, _ error: AFError?) {
    setLabel("completionServiceParseWebsite");
    
    parseWebsiteData = data;
    navigateToAddGift();
  }
  
  func noAuth() {
    statusLabel.text = "ext3".t();
    activityIndicator.stopAnimating();
  }
  
  func noAvailableContent() {
    statusLabel.text = "No available content";
    activityIndicator.stopAnimating();
  }
  
  func failed() {
    statusLabel.text = "ext2".t();
    activityIndicator.stopAnimating();
    cancelButton.setTitle("back".t(), for: UIControl.State.normal)
  }
  
  func success() {
    statusLabel.text = "ext4".t();
    activityIndicator.stopAnimating();
    cancelButton.setTitle("back".t(), for: UIControl.State.normal)
  }
  
  func navigateToAddGift() {
    self.performSegue(withIdentifier: "addGiftSegue", sender: self);
  }
  
  override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    if segue.identifier == "addGiftSegue", let vc = segue.destination as? AddGiftViewController {
      vc.parseDataWebsite = self.parseWebsiteData;
      vc.parseUrl = self.parseUrl;
      vc.service = self.service;
    }
  }
  
  @IBAction func cancelAction(_ sender: UIButton) {
    extensionContext?.cancelRequest(withError: NSError(domain: Bundle.main.bundleIdentifier!, code: 0));
  }
  
  @IBAction 
  func unwind(_ unwindSegue: UIStoryboardSegue) {
    if statusUnwind == "success" {
      success();
    }
    else {
      failed();
    }
  }
}
