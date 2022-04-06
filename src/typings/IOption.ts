interface IOption<T = string, V = string, E = any> {
  label: T;
  value: V;
  extra?: E;
}

export default IOption;
