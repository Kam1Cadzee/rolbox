export default (errors: any, name: string) => {
  return errors[name] ? errors[name].message : '';
};
