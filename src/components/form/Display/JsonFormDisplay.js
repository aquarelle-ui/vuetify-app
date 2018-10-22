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
            return null;
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
        ctrl = this.control(ctrl);
        if (ctrl == null) {
            return null;
        }
        return ctrl.parse(definition, this);
    }

    parseControlList(definitions)
    {
        if (!Array.isArray(definitions)) {
            return null;
        }
        return definitions.map(definition => this.parseControl(definition)).filter(item => item != null);
    }
}

export default new JsonFormDisplay();
