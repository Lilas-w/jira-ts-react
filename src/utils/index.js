export const isFalsy = (value) => (value === 0 ? false : !value);
//删去对象中的空值
//在函数中，改变传入的对象本身，不好
export const cleanObject = (object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    //undefined,null,NaN,''
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
