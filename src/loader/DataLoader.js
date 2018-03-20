import BaseLoader from "./BaseLoader";

/**
 * Data loader class
 */
export default class DataLoader extends BaseLoader {

    constructor(url, hasTypes = true) {
        super(url);
        this._hasTypes = hasTypes;
    }

    /**
     * Checks if loader has types
     * @return {boolean}
     */
    hasTypes() {
        return this._hasTypes;
    }

    /**
     * Get types
     * @returns {*}
     */
    getTypes(){
        if (!this._hasTypes) {
            return null;
        }
        return this._fetch(this._url + '/types');
    }
}
