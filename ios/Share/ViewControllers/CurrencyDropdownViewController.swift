//
//  CurrencyDropdownViewController.swift
//  Share
//
//  Created by Vadim Vereketa on 04.09.2021.
//

import UIKit


class CurrencyDropdownViewController: UIViewController {
  @IBOutlet weak var stackView: UIStackView!
  var options: [Option<String, Currency>] = [];
  
  var delegateSelect: IDropdownSelectItem? = nil;
  
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Do any additional setup after loading the view.
    setupWishlists();
  }
  
  
  
  func setupWishlists() {
    for item in options.enumerated() {
      let control = createItem(title: item.element.value.getFormatValue());
      control.tag = item.offset;
      control.addTarget(self, action: #selector(touchUpInside(_:)), for: UIControl.Event.touchUpInside);
      stackView.addArrangedSubview(control);
    }
  }
  
  @objc
  func touchUpInside(_  sender: UIControl) {
    delegateSelect?.selectItem(options[sender.tag]);
    dismiss(animated: true, completion: nil);
  }
  
  func createItem(title: String) -> UIControl {
    let control = UIControl(.opacity);
    control.translatesAutoresizingMaskIntoConstraints = false;
    
    let titleLabel = UILabel();
    titleLabel.text = title;
    titleLabel.textColor = UIColor(named: "text");
    titleLabel.translatesAutoresizingMaskIntoConstraints = false;
    
    control.addSubview(titleLabel)
    
    
    control.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor, constant: -20).isActive = true;
    control.trailingAnchor.constraint(equalTo: titleLabel.trailingAnchor, constant: 0).isActive = true;
    control.topAnchor.constraint(equalTo: titleLabel.topAnchor, constant: -10).isActive = true;
    control.bottomAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10).isActive = true;
    
    return control;
  }
  
}
