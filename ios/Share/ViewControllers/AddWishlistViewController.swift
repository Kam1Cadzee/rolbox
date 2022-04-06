//
//  AddWishlistViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 14.09.2021.
//

import UIKit

class AddWishlistViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
  static private let SIZE: CGFloat = 70;
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return items.count;
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath) as! CoverIconCollectionViewCell;
    
    let item = items[indexPath.row];
    cell.nameIcon = item;
    return cell;
  }
  
  func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
    return CGSize(width: AddWishlistViewController.SIZE, height: AddWishlistViewController.SIZE);
  }
  
  func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    coverIcon = items[indexPath.row];
  }
  
  var fullUserName = "";
  var selectedVisibilityType = VisibilityType.Private;
  var isLoading: Bool = false {
    didSet {
      updateButton();
    }
  };
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var stackView: UIStackView!
  var helperKeyboard: HelperKeyboardDisplaying!;
  var collectionView: UICollectionView!;
  var controls: [VisibilityControl] = [];
  var views: Dictionary<String, WrapperView> = [:];
  var activityIndicator: UIActivityIndicatorView!;
  var coverIcon: String = "";
  var service: Service!;
  var wishlist: Wishlist? = nil;
  
  lazy var buttonSave: UIButton = {
    let button = UIButton(.opacity);
    button.translatesAutoresizingMaskIntoConstraints = false;
    button.backgroundColor = UIColor(named: "secondary");
    button.setTitle("save".t(), for: UIControl.State.normal);
    button.setTitleColor(UIColor(named: "reverseText"), for: UIControl.State.normal);
    button.contentEdgeInsets = UIEdgeInsets(top: 16, left: 0, bottom: 16, right: 0);
    button.layer.cornerRadius = 4;
    button.addTarget(self, action: #selector(submitCreateWishlist), for: UIControl.Event.touchUpInside);
    
    
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
  func submitCreateWishlist() {
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
    
    service.createWishlist(data: getFetchData()) { wishlist, error in
      self.isLoading = false;
      guard let wishlist = wishlist else {
        return;
      }
      self.wishlist = wishlist;
      NotificationCenter.default.post(name: NSNotification.Name(rawValue: "wishlistName"), object: nil, userInfo: ["wishlist": wishlist])
      self.dismiss(animated: true, completion: nil);
    }
    
  }
  
  
  func getFetchData() -> WishlistPost {
    let name = views["name"] as! InputView;
    let forWhom = views["forWhom"] as! InputView;
    let note = views["note"] as! InputView;
    
    let result = WishlistPost(name: name.value!, visibility: selectedVisibilityType.rawValue, coverCode: coverIcon, forWhom: forWhom.value!, note: note.value);
    
    return result;
  }
  
  func updateButton() {
    if isLoading {
      activityIndicator.startAnimating();
      buttonSave.setTitle("", for: UIControl.State.normal);
      buttonSave.isEnabled = false;
    }
    else {
      activityIndicator.stopAnimating();
      buttonSave.setTitle("save".t(), for: UIControl.State.normal);
      buttonSave.isEnabled = true;
    }
  };
  
  var items = ["BalloonCoverIcon",
               "BottleCoverIcon",
               "CakeCoverIcon",
               "GiftCoverIcon",
               "HeartCoverIcon",
               "HouseCoverIcon",
               "RingCoverIcon",
               "SalutCoverIcon",
               "StarCoverIcon",
               "StarsCoverIcon",
               "TreeCoverIcon"];
  
  override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated);
    helperKeyboard.unsubscribeFromAllNotifications();
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated);
   
  }
  
  override func viewDidLoad() {
    super.viewDidLoad();
    scrollView.delegate = self;
    helperKeyboard = HelperKeyboardDisplaying(view: view, scrollView: scrollView);
    
    service = Service();
    
    views["name"] = InputView(titleContent: "name".t(), validationRule: nil, isRequired: true, placeholder: "");
    stackView.addArrangedSubview(
      views["name"]!
    );
    
    views["forWhom"] = InputView(titleContent: "listFor".t(), validationRule: nil, isRequired: true, placeholder: "", defaultValue: Service.user?.getFullName() ?? "");
    stackView.addArrangedSubview(
      views["forWhom"]!
    );
    
    let labelCoverWishlist = UILabel();
    labelCoverWishlist.textColor = UIColor(named: "text")
    labelCoverWishlist.text = "chooseCover".t();
    stackView.addArrangedSubview(
      labelCoverWishlist
    );
    
    setupCollectionView();
    
    let labelVisibility = UILabel();
    labelVisibility.textColor = UIColor(named: "text")
    labelVisibility.text = "whoCanSee".t();
    stackView.addArrangedSubview(
      labelVisibility
    );
    
    
    setupPrivatyWishlist();
    
    
    views["note"] = InputView(titleContent: "note".t(), validationRule: nil, isRequired: false, placeholder: "");
    stackView.addArrangedSubview(
      views["note"]!
    );
    
    stackView.addArrangedSubview(buttonSave);
  }
  
  func setupCollectionView() {
    let layout = UICollectionViewFlowLayout();
    //layout.estimatedItemSize = CGSize(width: AddWishlistViewController.SIZE, height: AddWishlistViewController.SIZE)
    layout.scrollDirection = .horizontal;
    layout.minimumLineSpacing = 20;
    layout.minimumInteritemSpacing = 0;
    
    collectionView = UICollectionView(frame: CGRect(x: 0, y: 0, width: 0, height: 0), collectionViewLayout: layout);
    collectionView.showsHorizontalScrollIndicator = false;
    collectionView.backgroundColor = UIColor(named: "background");
    collectionView.translatesAutoresizingMaskIntoConstraints = false;
    collectionView.heightAnchor.constraint(equalToConstant: AddWishlistViewController.SIZE).isActive = true;
    collectionView.delegate = self;
    collectionView.dataSource = self;
    
    collectionView.register(CoverIconCollectionViewCell.self, forCellWithReuseIdentifier: "cell");
    
    
    stackView.addArrangedSubview(collectionView);
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated);
    collectionView.selectItem(at: IndexPath(row: 0, section: 0), animated: true, scrollPosition: UICollectionView.ScrollPosition.left)
   coverIcon = items[0];
    helperKeyboard.subscribeNotificationKeyboard();
  }
  
  func setupPrivatyWishlist() {
    let sw = UIStackView();
    sw.axis = .vertical;
    sw.translatesAutoresizingMaskIntoConstraints = false;
    sw.spacing = 16;
    
    for type in VisibilityType.allCases {
      let control = VisibilityControl(value: type, handler: touchInVisibilityType, checked: selectedVisibilityType);
      controls.append(control)
      sw.addArrangedSubview(control)
    };
    
    stackView.addArrangedSubview(sw);
  }
  
  func touchInVisibilityType(_ type: VisibilityType) {
    selectedVisibilityType = type;
    for c in controls {
      c.checked = type;
    }
  }
  
}

extension AddWishlistViewController: UIScrollViewDelegate {
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    //scrollView.contentOffset.x = 0
  }
}


