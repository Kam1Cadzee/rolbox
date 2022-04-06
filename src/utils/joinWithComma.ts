const joinWithComma = (obj: any) => {
  return Object.values(obj)
    .filter((el) => !!el)
    .join(', ');
};

export default joinWithComma;
