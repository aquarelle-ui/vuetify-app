let ID_COUNTER = 0;
const ALLOWED_PROPERTIES = ['control', 'name', 'display', 'config', 'validation', 'items', 'default', 'nullable', 'fallback', 'filter'];

export default class JsonFormDisplayControl
{
    constructor(element) {
        this._element = element;
    }

    getElement(definition, form)
    {
        if (typeof this._element === 'function') {
            return this._element(definition, form);
        }
        return this._element;
    }

    getName(definition, form)
    {
        return definition.name || null;
    }

    getItems(definition, form)
    {
        if (definition.items && Array.isArray(definition.items)) {
            return definition.items;
        }
        return null;
    }

    getDisplay(definition, form)
    {
        return definition.display || {};
    }

    getConfig(definition, form)
    {
        return definition.config || {};
    }

    parse(definition, form)
    {
        definition = this.normalize(definition);

        const data = {
            id: ++ID_COUNTER,
            name: this.getName(definition, form),
            element: this.getElement(definition, form),
            display: this.getDisplay(definition, form),
            config: this.getConfig(definition, form),
            items: this.getItems(definition, form)
        };

        return data;
    }

    normalize(definition)
    {
        let extra = Object.keys(definition).filter(v => ALLOWED_PROPERTIES.indexOf(v) === -1);

        if (typeof definition.config !== 'object') {
            definition.config = {};
        }
        if (typeof definition.display !== 'object') {
            definition.display = {};
        }

        if (extra.length > 0) {
            extra.map(prop => {
                if (!definition.display.hasOwnProperty(prop)) {
                    definition.display[prop] = definition[prop];
                }
            });
        }

        return definition;
    }
}