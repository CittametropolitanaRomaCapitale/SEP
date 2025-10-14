interface IDictionary<T, Q> {
  add<K1 extends keyof Exclude<T, '__typename'>, K2 extends keyof Q>(
    name: K1 | K2,
    value: string
  ): IDictionary<T, Q>;

  get<K1 extends keyof Exclude<T, '__typename'>, K2 extends keyof Q>(
    key: K1 | K2,
    params?: { [key: string]: string }
  ): string;
}

export class Dictionary<T, Q> implements IDictionary<T, Q> {
  items: any;
  name: string;

  constructor(name: string) {
    this.items = {};
    this.name = name;

    //console.log("new dictionary", name);
  }

  private replace(str: string, params: { [key: string]: string }) {
    const re = new RegExp(
      Object.keys(params)
        .map((key) => `:${key}`)
        .join('|'),
      'gi'
    );
    str = str.replace(re, function (matched) {
      return params[matched.substring(1).toLowerCase()];
    });

    return str;
  }

  add<K1 extends keyof Exclude<T, '__typename'>, K2 extends keyof Q>(
    name: K1 | K2,
    value: string
  ) {
    this.items[name as any] = value;
    return this;
  }

  get<K1 extends keyof Exclude<T, '__typename'>, K2 extends keyof Q>(
    key: K1 | K2,
    params?: { [key: string]: string }
  ) {
    if (!this.items.hasOwnProperty(key)) {
      console.warn(`[${this.name}] Missing key ${key}`);
      return `😡 Missing Key : ${key}`;
    }

    if (params) {
      return this.replace(this.items[key], params);
    }
    return this.items[key];
  }

  getOrIgnore<K1 extends keyof Exclude<T, '__typename'>, K2 extends keyof Q>(
    key: K1 | K2,
    params?: { [key: string]: string }
  ) {
    if (!this.items.hasOwnProperty(key)) {
      return key;
    }

    return this.replaceTranslations(key, params);
  }

  private replaceTranslations<
    K1 extends keyof Exclude<T, '__typename'>,
    K2 extends keyof Q
  >(key: K1 | K2, params?: { [key: string]: string }) {
    if (params) {
      return this.replace(this.items[key], params);
    }
    return this.items[key];
  }
}
