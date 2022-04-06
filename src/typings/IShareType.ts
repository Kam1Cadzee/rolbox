interface IShareType<T = any> {
  extraData: T;
  data: string;
  mimeType: 'text/plain';
}

export default IShareType;
