const isHttp = (url: string) => {
  if (!url) {
    return false;
  }
  const res = parseHttpString(url);
  return res !== null;
};

const parseHttpString = (url: string) => {
  if (!url) {
    return null;
  }
  url = url.trim();
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)?/gi;
  const res = regex.exec(url);
  if (res) {
    return res[0] ?? null;
  }
  return null;
};

export {parseHttpString};
export default isHttp;
