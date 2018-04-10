<template>
    <router-view :entity-info="entityInfo"></router-view>
</template>
<script>
    import Loaders from "../../Loaders";

    export default {
        name: 'entity-instance-route',
        props: {
            entityName: {
                type: String,
                required: true,
            },
            entityId: {
                type: String,
                required: true
            },
            typeCacheKey: {
                type: String,
                default: 'types'
            }
        },
        data() {
            return {
                entityInstance: null,
                entityIsLoading: true,
                entityError: null,
                entityType: null
            };
        },
        mounted() {
            this.refreshEntity();
        },
        watch: {
            entityId(val) {
                this.refreshEntity(val);
            },
            entityLoader() {
                this.refreshEntity();
            }
        },
        computed: {
            entityLoader() {
                return Loaders.get(this.entityName);
            },
            entityInfo() {
                return {
                    name: this.entityName,
                    id: this.entityId,
                    loader: this.entityLoader,
                    instance: this.entityInstance,
                    type: this.entityType,
                    loading: this.entityIsLoading,
                    error: this.entityError,
                    refresh: () => {
                        this.refreshEntity()
                    }
                };
            }
        },
        methods: {
            refreshEntity(id = this.entityId) {
                this.entityIsLoading = true;
                this.entityType = null;
                this.entityLoader.get(id)
                    .then(data => {
                        this.entityInstance = data;
                        if (this.entityLoader.hasTypes()) {
                            this.entityLoader.cached(this.typeCacheKey)
                                .then(types => {
                                    this.entityType = this.entityTypeFromList(this.entityInstance, types);
                                    this.entityError = null;
                                    this.entityIsLoading = false;
                                })
                                .catch(this.onError);
                        }
                        else {
                            this.entityError = null;
                            this.entityIsLoading = false;
                        }
                    })
                    .catch(this.onError);
            },
            onError(error) {
                this.entityInstance = null;
                this.entityError = error;
                this.entityIsLoading = false;
            },
            entityTypeFromList(entity, types) {
                for (let i = 0; i < types.length; i++) {
                    if (types[i].type === entity.type && types[i].behavior === entity.behavior) {
                        return types[i];
                    }
                }
                return null;
            }
        }
    };
</script>