export default class CacheLoader {

  constructor() {
    this._registry = {};
    this._cache = {};
  }

  async load(key) {
    let checked = false;
    let now = Date.now();
    if (this._cache.hasOwnProperty(key)) {
      let cache = this._cache[key];
      if (cache.ttl === 0 || cache.ttl > now) {
        return cache.data;
      }
      checked = true;
    }

    if (!checked && !this._registry.hasOwnProperty(key)) {
      throw new Error('Unknown cache key "' + key + '"');
    }

    let entry = this._registry[key];
    let callback = entry.loader;
    let ttl = entry.ttl === 0 ? 0 : entry.ttl + now;

    let data = await callback();
    this._cache[key] = {data, ttl};
    return data;
  }

  register(key, loader, ttl = 0) {
    ttl = ttl <= 0 ? 0 : ttl * 1000;
    this._registry[key] = {loader, ttl};
  }

  isRegistered(key) {
    return this._registry.hasOwnProperty(key);
  }

  clear(key) {
    delete this._cache[key];
  }

  clearAll() {
    this._cache = {};
  }
}
