//
//  Service.swift
//  Share
//
//  Created by Vadim Vereketa on 08.09.2021.
//

import Foundation
import Alamofire;

class Service {
  private static let BASE_URL = URL(string: "https://app-backend.rolbox.app/api/");
  static var TOKEN = "";
  static var user: User? = nil;
  
  let token: String;
  
  init() {
    self.token = Service.TOKEN;
  }
  
  func parseWebsite(parseUrl: String, completion: @escaping (_ data: ParseWebsiteData?, _ error: AFError?) -> Void) {
    let urlRequest = Service.BASE_URL?.appendingPathComponent("url/parse");
    
    
    guard urlRequest != nil else {
      return;
    }
    
    let headers: HTTPHeaders = [
      "Authorization": self.token,
      "Accept": "application/json"
    ];
    
    let parameters: Parameters = [
      "url": parseUrl
    ];
    
    
    AF.request(urlRequest!, method: .post, parameters: parameters, encoding: URLEncoding.default, headers: headers)
      .responseData { response in
        guard let data = response.data else {
          return completion(nil, response.error);
        };
        do {
          let parseData = try? JSONDecoder().decode(ParseWebsiteData.self, from: data);
          completion(parseData, nil);
        }
        catch let jsonError {
          dump(jsonError)
        }
      }
    
  }
  
  func uploadImage(image: TypeUploadImage, idGift: String, completion:  (@escaping (_ data: Any?, _ error: AFError?) -> Void)) {
    let urlRequest = Service.BASE_URL?.appendingPathComponent("gift/\(idGift)/image");
    
    guard urlRequest != nil else {
      return;
    }
    
    let headers: HTTPHeaders = [
      "Authorization": self.token,
      "Accept": "application/json"
    ];
    
    switch image {
    case .url(let url):
      let parameters: Parameters = [
        "url": url,
        "filename": "url_\(Int(Date.init().timeIntervalSince1970))"
      ];
      AF.request(urlRequest!, method: .post, parameters: parameters, encoding: URLEncoding.default, headers: headers)
        .responseJSON { resonse in
          completion(nil, nil);
        };
      break;
    case .image(let img):
      AF.upload(
        multipartFormData: { multipartFormData in
          multipartFormData.append(img.jpegData(compressionQuality: 0.5)!, withName: "file" , fileName: "url_\(Int(Date.init().timeIntervalSince1970))", mimeType: "image/jpeg")
        },
        to: urlRequest!, method: .post , headers: headers)
        .responseJSON { response in
          completion(nil, nil);
        }
      break;
    case .base64:
      break;
    }
  }
  
  func getProfile(completion: @escaping (_ data: User?, _ error: AFError?) -> Void) {
    let urlRequest = Service.BASE_URL?.appendingPathComponent("user/profile");
    
    guard urlRequest != nil else {
      return;
    }
    
    let headers: HTTPHeaders = [
      "Authorization": self.token,
      "Accept": "application/json"
    ];
    
    
    AF.request(urlRequest!, method: .get, parameters: nil, encoding: URLEncoding.default, headers: headers)
      .responseData { response in
        guard let data = response.data else {
          return completion(nil, response.error);
        };
        do {
          let parseData = try JSONDecoder().decode(Array<User>.self, from: data);
          completion(parseData.first, nil);
        }
        catch let jsonError {
          dump(jsonError)
        }
      }
  }
  
  func parseToParams(giftData: GiftPost) -> Parameters {
    var parametrs: Parameters = [:];
    parametrs["name"] = giftData.name;
    parametrs["wishlist"] = giftData.wishlist;
    parametrs["color"] = giftData.color;
    parametrs["size"] = giftData.size;
    parametrs["note"] = giftData.note;
    parametrs["quantity"] = giftData.quantity;
    parametrs["websiteLink"] = giftData.websiteLink;
    if giftData.price != nil {
      parametrs["price"] = [
        "value": giftData.price!.value,
        "currency": giftData.price!.currency,
      ]
    }
    return parametrs;
  };
  
  func parseToParamsWishlist(data: WishlistPost) -> Parameters {
    var parametrs: Parameters = [:];
    parametrs["name"] = data.name;
    parametrs["coverCode"] = data.coverCode;
    parametrs["note"] = data.note;
    parametrs["forWhom"] = data.forWhom;
    parametrs["visibility"] = data.visibility;
    
    return parametrs;
  };
  
  func createGift(giftData: GiftPost, completion: @escaping (_ idGift: String?, _ error: AFError?) -> Void) {
    let urlRequest = Service.BASE_URL?.appendingPathComponent("gift");
    
    guard urlRequest != nil else {
      return;
    }
    
    let headers: HTTPHeaders = [
      "Authorization": self.token,
      "Accept": "application/json"
    ];
    
    let parameters = parseToParams(giftData: giftData);
    
    AF.request(urlRequest!, method: .post, parameters: parameters, encoding: URLEncoding.default, headers: headers)
      .responseData { response in
        guard let data = response.data else {
          return completion(nil, response.error);
        };
        do {
          let parseData = try JSONDecoder().decode(Gift.self, from: data);
          completion(parseData._id, nil);
        }
        catch let jsonError {
          dump(jsonError)
        }
      }
    
  }
  
  func createWishlist(data: WishlistPost, completion: @escaping (_ wishlist: Wishlist?, _ error: AFError?) -> Void) {
    let urlRequest = Service.BASE_URL?.appendingPathComponent("wishlist");
    
    guard urlRequest != nil else {
      return;
    }
    
    let headers: HTTPHeaders = [
      "Authorization": self.token,
      "Accept": "application/json"
    ];
    
    let parameters = parseToParamsWishlist(data: data);
    
    AF.request(urlRequest!, method: .post, parameters: parameters, encoding: URLEncoding.default, headers: headers)
      .responseData { response in
        guard let data = response.data else {
          return completion(nil, response.error);
        };
        do {
          let parseData = try JSONDecoder().decode(Wishlist.self, from: data);
          completion(parseData, nil);
        }
        catch let jsonError {
          dump(jsonError)
        }
      }
    
  }

}
