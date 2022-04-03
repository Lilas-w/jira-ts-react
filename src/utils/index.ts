import { useEffect, useState } from "react";

export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

//删去对象中的空值
//在函数中，改变传入的对象本身，不好
export const cleanObject = (object: object) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    //@ts-ignore
    const value = result[key];
    //undefined,null,NaN,''
    if (isFalsy(value)) {
      //@ts-ignore
      delete result[key];
    }
  });
  return result;
};

//抽离组件加载阶段只执行一次的逻辑
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
};

//把value转换成debouncedValue
//需要用泛型规范类型
export const useDebounce = <V>(value: V, delay?: number) => {
  //新建state，state是响应式的
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    //每次value变化，都新设一个定时器，在delay毫秒以后，才setDebouncedValue
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    //每次在上一个useEffect执行完再执行这个回调函数。最后一个timeout会被保留。
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
