export default {
    props: {
        model: {type: [Array, Object], required: true},
        name: {type: [String, Number], required: false, default: null},
        display: {type: Object, required: false, default: () => ({})},
        config: {type: Object, required: false, default: () => ({})},
        items: {type: Array, required: false, default: null},
        files: {type: Object, default: null}
    },
    computed: {
        hasName()
        {
            if (this.name === null) {
                return false;
            }
            if (typeof this.name === 'number') {
                return this.name >= 0 && isFinite(this.name);
            }
            return this.name !== '';
        },
        modelProxy()
        {
            return this.hasName ? this.model[this.name] : this.model;
        }
    }
};
