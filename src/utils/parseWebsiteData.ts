import IWebsiteParseData from '../typings/IWebsiteParseData';
import isHttp from './isHttp';

export enum ITypeParseImage {
  none,
  url,
  base64,
  gallery,
}

const parseWebsiteData = {
  parseTitle: (title: string) => {
    if (!title) {
      return '';
    }
    return title;
  },
  parsePrice: (price: string) => {
    if (!price) {
      return '';
    }
    const regex = /\d+[\,\.]\d+/;
    const value = regex.exec(price);
    if (value === null) {
      return '';
    }
    return value[0];
  },
  parseImage: (image: string) => {
    if (!image) {
      return {
        type: ITypeParseImage.none,
        data: null,
      };
    }

    return {
      type: isHttp(image) ? ITypeParseImage.url : ITypeParseImage.base64,
      data: image,
    };
  },
  parse: (data: IWebsiteParseData) => {
    return {
      title: parseWebsiteData.parseTitle(data.title),
      price: parseWebsiteData.parsePrice(data.price),
      image: parseWebsiteData.parseImage(data.image),
    };
  },
};

export default parseWebsiteData;
