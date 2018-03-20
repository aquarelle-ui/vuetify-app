export default {
    _items: {},
    get(name) {
        return this.has(name) ? this._items[name] : null;
    },
    register(name, obj) {
        this._items[name] = obj;
        return this;
    },
    unregister(name) {
        delete this._items[name];
        return this;
    },
    has(name) {
        return this._items.hasOwnProperty(name);
    }
};