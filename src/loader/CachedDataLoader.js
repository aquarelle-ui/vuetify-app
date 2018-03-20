import DataLoader from "./DataLoader";
import CacheLoader from "./CacheLoader";

const Cache = new CacheLoader();

export default class extends DataLoader {
    constructor(url, key, hasTypes = true, loaders = {}, ttl = 300) {
        super(url, hasTypes);
        this._key = key;
        loaders = {
            types: () => this.getTypes(),
            instances: () => this.getAll(),
            ...loaders
        };
        for (const name in loaders) {
            if (!loaders.hasOwnProperty(name) || typeof loaders[name] !== 'function') {
                continue;
            }
            Cache.register(key + '/' + name, loaders[name], ttl);
        }
    }

    cached(what) {
        return Cache.load(this._key + '/' + what);
    }

    static cacheStorage() {
        return Cache;
    }
};