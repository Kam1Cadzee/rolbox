//
//  AddGiftViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 16.08.2021.
//

import UIKit

class AddGiftViewController: UIViewController {
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var stackView: UIStackView!
  var activityIndicator: UIActivityIndicatorView!;
  
  var views: Dictionary<String, WrapperView> = [:];
  
  var fullUserName = "";
  var statusUnwind = "";
  var parseDataWebsite: ParseWebsiteData? = nil;
  var parseUrl: String = "";
  var service: Service! = nil;
  var photoView: AddPhotoView! = nil;
  var helperKeyboard: HelperKeyboardDisplaying!;
  var isLoading: Bool = false {
    didSet {
      updateButton();
    }
  };
  
  func updateButton() {
    if isLoading {
      activityIndicator.startAnimating();
      buttonSave.setTitle("", for: UIControl.State.normal);
    }
    else {
      activityIndicator.stopAnimating();
      buttonSave.setTitle("save".t(), for: UIControl.State.normal);
    }
  };
  
  lazy var buttonSave: UIButton = {
    let button = UIButton(.opacity);
    button.translatesAutoresizingMaskIntoConstraints = false;
    button.backgroundColor = UIColor(named: "secondary");
    button.setTitle("save".t(), for: UIControl.State.normal);
    button.setTitleColor(UIColor(named: "reverseText"), for: UIControl.State.normal);
    button.contentEdgeInsets = UIEdgeInsets(top: 16, left: 0, bottom: 16, right: 0);
    button.layer.cornerRadius = 4;
    button.addTarget(self, action: #selector(submitCreateGift), for: UIControl.Event.touchUpInside);
    
    
    activityIndicator = UIActivityIndicatorView();
    activityIndicator.translatesAutoresizingMaskIntoConstraints = false;
    activityIndicator.color = UIColor(named: "reverseText");
    activityIndicator.hidesWhenStopped = true;
    
    
    
    button.addSubview(activityIndicator);
    activityIndicator.centerXAnchor.constraint(equalTo: button.centerXAnchor).isActive = true;
    activityIndicator.centerYAnchor.constraint(equalTo: button.centerYAnchor).isActive = true;
    return button;
  }();
  
  
  @objc
  func submitCreateGift() {
    var isValid = true;
    
    for view in views.values {
      if !view.validateRules() {
        isValid = false;
      }
    }
    guard isValid else {
      return;
    }
    
    isLoading = true;
    
    
    service.createGift(giftData: getFetchData()) { idGift, error in
      if idGift == nil {
        self.isLoading = false;
        return;
      }
      
      switch self.photoView.value {
      case .base64, .none:
        self.isLoading = false;
        self.navigateToSuccessScreen();
        return;
      case .image, .url:
        self.service.uploadImage(image: self.photoView.value!, idGift: idGift!) { any, error in
          self.isLoading = false;
          self.navigateToSuccessScreen();
        };
        return;
      }
    }
    
    
  }
  
  func navigateToSuccessScreen() {
    statusUnwind = "success";
    performSegue(withIdentifier: "mainScreen", sender: self);
  }
  
  func navigateToFailedScreen() {
    performSegue(withIdentifier: "mainScreen", sender: self);
  }
  
  override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    guard let vc = segue.destination as? ShareViewController else {
      return;
    }
    vc.statusUnwind = self.statusUnwind;
  }
  
  func getFetchData() -> GiftPost {
    let wishlist = views["wishlist"] as! DropdownWishlist;
    let currency = views["currency"] as! DropdownCurrency;
    
    let name = views["name"] as! InputView;
    let website = views["website"] as! InputView;
    let price = views["price"] as! InputView;
    let quantity = views["quantity"] as! InputView;
    let size = views["size"] as! InputView;
    let color = views["color"] as! InputView;
    let note = views["note"] as! InputView;
    
    var priceObj: Price? = nil;
    
    if (price.value ?? "") != "" {
      priceObj = Price(value: price.value!, currency: currency.value!.rawValue)
    }
    
    let result = GiftPost(name: name.value!, wishlist: wishlist.value!._id, websiteLink: website.value, quantity: Int(quantity.value!) ?? 0, size: size.value, color: color.value, note: note.value, price: priceObj);
    
    return result;
  }
  
  override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated);
    helperKeyboard.unsubscribeFromAllNotifications();
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated);
    helperKeyboard.subscribeNotificationKeyboard();
  }
  
  override func viewDidLoad() {
    super.viewDidLoad();
    NotificationCenter.default.addObserver(self, selector: #selector(self.showSpinningWheel(_:)), name: NSNotification.Name(rawValue: "wishlistName"), object: nil)
    scrollView.delegate = self;
    helperKeyboard = HelperKeyboardDisplaying(view: view, scrollView: scrollView);
    
    views["wishlist"] = DropdownWishlist(titleContent: "addToWishlist".t() + ":", validationRule: nil, isRequired: true, placeholder: "chooseList".t());
    //(views["wishlist"] as! DropdownWishlist).value = Wishlist(_id: "123", name: "test", coverCode: "as");
    stackView.addArrangedSubview(views["wishlist"]!);
    
    service?.getProfile(completion: { [weak self]  user, error in
      guard let user = user else {
        self?.navigateToFailedScreen();
        return;
      }
      (self?.views["wishlist"] as? DropdownWishlist)?.setOptions(user.ownedWishlists);
      (self!.fullUserName) = user.getFullName();
      Service.user = user;
    })
    
    photoView = AddPhotoView(presentationController: self, url: URL(string: parseDataWebsite?.image ?? ""))
    stackView.addArrangedSubview(photoView);
    
    views["name"] = InputView(titleContent: "name".t(), validationRule: nil, isRequired: true, placeholder: "", defaultValue: parseDataWebsite?.title ?? "");
    stackView.addArrangedSubview(
      views["name"]!
    );
    
    views["website"] = InputView(titleContent: "website".t(), validationRule: nil, isRequired: false, placeholder: "", defaultValue: parseUrl);
    stackView.addArrangedSubview(
      views["website"]!
    );
    
    views["price"] = InputView(titleContent: "price".t(), validationRule: nil, isRequired: false, placeholder: "", defaultValue: parseDataWebsite?.price ?? "", keyboardType: .decimalPad);
    
    (views["price"] as? InputView)?.handlerChangeCharactersIn.append(contentsOf: [
                                                                      ValidationCharactersInput.onlyOnePoint,
                                                                      ValidationCharactersInput.twoDigitsAfterPoint,
                                                                      ValidationCharactersInput.maxValueOfString(1000000.9)])
    views["currency"] =  DropdownCurrency(titleContent: "", validationRule: nil, isRequired: false, placeholder: "");
    (views["currency"] as? DropdownCurrency)?.value = getDefaultCurrency();
    stackView.addArrangedSubview(
      insertInStackview(views["price"]!, views["currency"]!)
    );
    
    let validationRuleQuantity = ValidationRule();
    validationRuleQuantity.addRule({ (value) in
      let str = value as? String ?? "";
      let n = Int(str) ?? 0;
      
      return n <= 0;
    }, textError: "errorMoreThanZero".t())
    views["quantity"] = InputView(titleContent: "quantity".t(), validationRule: validationRuleQuantity, isRequired: true, placeholder: "", defaultValue: "1",
                                  keyboardType: .numberPad);
    (views["quantity"] as? InputView)?.handlerChangeCharactersIn.append(contentsOf: [
                                                                          ValidationCharactersInput.onlyNumbers, ValidationCharactersInput.withoutFirstZero,
                                                                          ValidationCharactersInput.maxLengthOfString(3)])
    
    views["size"] = InputView(titleContent: "size".t(), validationRule: nil, isRequired: false, placeholder: "");
    stackView.addArrangedSubview(
      insertInStackview(views["quantity"]!, views["size"]!)
    );
    
    views["color"] = InputView(titleContent: "color".t(), validationRule: nil, isRequired: false, placeholder: "");
    stackView.addArrangedSubview(
      views["color"]!
    );
    
    views["note"] = InputView(titleContent: "note".t(), validationRule: nil, isRequired: false, placeholder: "whereToFind".t());
    stackView.addArrangedSubview(
      views["note"]!
    );
    
    stackView.addArrangedSubview(buttonSave);
    
  }
  
  func getDefaultCurrency() -> Currency {
    let currency = Currency(rawValue: parseDataWebsite?.currency ?? "");
    var defaultCurrency = Currency.usd;
    let locale = Locale.current.languageCode ?? "en";
    if locale == "ru" || locale == "uk" {
      defaultCurrency = Currency.uah
    }
    else if locale == "es" {
      defaultCurrency = Currency.eur;
    }
    
    return currency ?? defaultCurrency;
  }
  
  func insertInStackview(_ v1: UIView, _ v2: UIView) -> UIStackView {
    let sw = UIStackView();
    sw.spacing = 10;
    sw.axis = .horizontal;
    sw.distribution = .fillEqually;
    sw.addArrangedSubview(v1);
    sw.addArrangedSubview(v2);
    
    return sw;
  }
  
  @objc func showSpinningWheel(_ notification: NSNotification) {
    if let dict = notification.userInfo as NSDictionary? {
      if let wishlist = dict["wishlist"] as? Wishlist {
        var newOptions = (self.views["wishlist"] as? DropdownWishlist)?.options.map({ wishlist in
          return wishlist;
        }) ?? [];
        newOptions.append(wishlist);
        (self.views["wishlist"] as? DropdownWishlist)?.setOptions(newOptions)
        (self.views["wishlist"] as! DropdownWishlist).value = wishlist;
      }
    }
    
  }
}

extension AddGiftViewController: UIScrollViewDelegate {
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    scrollView.contentOffset.x = 0
  }
}

