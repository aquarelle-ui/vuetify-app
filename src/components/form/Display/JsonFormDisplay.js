import JsonFormDisplayControl from "./JsonFormDisplayControl";

class JsonFormDisplay
{
    constructor()
    {
        this._controls = {};
    }

    addElementControl(name, element)
    {
        return this.addControl(name, new JsonFormDisplayControl(element));
    }

    addControl(name, control)
    {
        this._controls[name] = control;
        return this;
    }

    removeControl(name)
    {
        if (this.hasControl(name)) {
            delete this._controls[name];
        }
        return this;
    }

    control(name)
    {
        if (!this.hasControl(name)) {
            throw new Error(`Control ${name} was not registered`);
        }
        return this._controls[name];
    }

    hasControl(name)
    {
        return this._controls.hasOwnProperty(name);
    }

    controlTypes()
    {
        return Object.keys(this._controls);
    }

    parseControl(definition)
    {
        if (!definition.control) {
            throw new Error("Control type is not specified");
        }
        let ctrl = definition.control;
        if (!this.hasControl(ctrl)) {
            if (definition.fallback && this.hasControl(definition.fallback)) {
                ctrl = definition.fallback;
            }
        }
        return this.control(ctrl).parse(definition, this);
    }

    parseControlList(definitions)
    {
        return definitions.map(definition => this.parseControl(definition));
    }
}

export default new JsonFormDisplay();
