import Loaders from "../Loaders";

export default {
    methods: {
        entityLoader(name)
        {
            return Loaders.get(name);
        },
        entityTypes(name, cached = true)
        {
            const loader = this.entityLoader(name);
            let promise = null;
            if (cached) {
                promise = loader.cached('types');
            }
            else {
                promise = loader.getTypes();
            }
            return promise;
        },
        entityType(name, type, behavior = null, cached = true, type_field = 'type', behavior_field = 'behavior')
        {
            return this.entityTypes(name, cached)
                .then(types => this.entityTypeFromList(types, type, behavior, type_field, behavior_field));
        },
        entityTypeFields(
            name,
            type,
            prop = 'fields',
            fallback = [],
            type_field = 'type',
            behavior_field = 'behavior',
            cached = true
        )
        {
            let behavior = null;

            if (typeof type === 'object') {
                behavior = type[behavior_field] || null;
                type = type[type_field];
            }

            return this.entityType(name, type, behavior, cached, type_field, behavior_field)
                .then(type => type[prop] || fallback)
                .catch(() => fallback);
        },
        entityTypeFromList(types, type, behavior = null, type_field = 'type', behavior_field = 'behavior')
        {
            for (let i = 0; i < types.length; i++) {
                if (types[i][type_field] !== type) {
                    continue;
                }

                if (behavior == null) {
                    return types[i];
                }

                if (types[i][behavior_field] === behavior) {
                    return types[i];
                }
            }
            return null;
        }
    }
}