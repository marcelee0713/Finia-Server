type FunctionKey<T> = {
  [K in keyof T]: T[K] extends CallableFunction ? K : never;
}[keyof T];

export type ExcludeFunctions<T> = Omit<T, FunctionKey<T>>;

export type ExcludeUnderscores<T> = {
  [K in keyof T as `${Uncapitalize<string & K> extends `_${infer R}` ? Uncapitalize<string & R> : Uncapitalize<string & K>}`]: T[K];
};
