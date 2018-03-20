import Loaders from "../Loaders";

export default {
    methods: {
        entityLoader(name) {
            return Loaders.get(name);
        },
        entityTypes(name, cached = true) {
            const loader = this.entityLoader(name);
            let promise = null;
            if (cached) {
                promise = loader.cached('types');
            }
            else {
                promise = loader.getTypes();
            }
            return promise.then(types => types.collection);
        },
        entityType(name, type, behavior, cached = true) {
            return this.entityTypes(name, cached).then(types => this.entityTypeFromList(types, type, behavior));
        },
        entityTypeFromList(types, type, behavior) {
            for (let i = 0; i < types.length; i++) {
                if (types[i].type === type && types[i].behavior === behavior) {
                    return types[i];
                }
            }
            return null;
        }
    }
}