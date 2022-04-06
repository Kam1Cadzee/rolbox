interface IGetHeightDropdown {
  maxRow?: number;
  height: number;
  count: number;
}
const getHeightDropdown = ({count, height, maxRow = 3}: IGetHeightDropdown) => {
  const length = Math.min(count, maxRow);
  return length * height;
};

export default getHeightDropdown;
