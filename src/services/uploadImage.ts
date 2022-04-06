import RNFetchBlob from 'rn-fetch-blob';
import {IImage} from '../typings/IUser';

export interface IUploadImage {
  filename?: string;
  mime: string;
  path?: string;
  base64?: string;
  url?: string;
}

const uploadImage = async ({data, url, token}: {data: IUploadImage; url: string; token: string}) => {
  try {
    const res = await RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'file',
          filename: data.filename ?? `unnamed_` + Date.now(),
          type: data.mime,
          data: RNFetchBlob.wrap(data.path),
        },
      ],
    );
    return {
      success: true,
      data: JSON.parse(res.data) as IImage,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
    };
  }
};

const uploadImages = async ({
  images,
  url,
  token,
  message,
}: {
  images: IUploadImage[];
  url: string;
  token: string;
  message: string;
}) => {
  try {
    const res = await RNFetchBlob.fetch(
      'POST',
      url,
      {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      [
        ...images.map((data, i) => {
          const dataSplit = data.path.split('/');
          const name = (dataSplit[dataSplit.length - 1] ?? 'unnamed') + '_';

          return {
            name: 'files',
            filename: data.filename ?? `${name}` + Date.now(),
            type: data.mime,
            data: RNFetchBlob.wrap(data.path),
          };
        }),
        {
          name: 'message',
          data: message,
          type: 'text/plain',
        },
      ],
    );
    return {
      success: true,
      data: JSON.parse(res.data) as IImage,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
    };
  }
};

export {uploadImages};
export default uploadImage;
