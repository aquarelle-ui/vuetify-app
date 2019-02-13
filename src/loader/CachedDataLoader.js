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

    create(data)
    {
        return super.create(data).then(r => this._clearCache(r));
    }

    update(id, data)
    {
        return super.update(id, data).then(r => this._clearCache(r));
    }

    delete(id)
    {
        return super.delete(id).then(r => this._clearCache(r));
    }

    clone(id, data)
    {
        return this._sendData(data, id, '/clone').then(r => this._clearCache(r));
    }

    cached(what) {
        return Cache.load(this._key + '/' + what);
    }

    _clearCache(data) {
        Cache.clear(this._key + '/instances');
        return data;
    }

    static cacheStorage() {
        return Cache;
    }
};