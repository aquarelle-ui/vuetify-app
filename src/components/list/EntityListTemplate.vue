<template>
    <v-flex v-if="ready && items.length > 0" align-center>
        <v-list v-bind="$attrs">
            <slot name="item"
                  v-for="(item, index) in items"
                  :item="item"
                  :type="getItemType(item)"
                  :index="index"
                  :itemList="items">
            </slot>
        </v-list>
        <slot></slot>
    </v-flex>
    <v-container v-else fluid fill-height>
        <v-layout column justify-center align-center>
            <v-progress-circular v-if="!ready" indeterminate color="secondary"></v-progress-circular>
            <template v-else>
                <slot name="empty">
                    {{$intl.translate(this.emptyText)}}
                </slot>
                <slot></slot>
            </template>
        </v-layout>
    </v-container>
</template>
<script>
    import {EntityMixin} from "../../mixins";

    export default {
        name: 'entity-list-template',
        mixins: [EntityMixin],
        props: {
            emptyText: {
                type: [Object, String],
                default: () => ({text: 'No items to display', key: 'ui:common.emptyList'})
            },
            loader: {
                type: [Object, String],
                required: true
            },
            handler: {
                type: Function,
                default: null
            },
            filterArgs: {
                type: Object,
                default: null
            },
            collectionKey: {
                type: String,
                default: 'collection'
            },
            typeCacheKey: {
                type: String,
                default: 'types'
            },
            typeKey: {
                type: String,
                default: 'type',
                required: false
            },
            behaviorKey: {
                type: String,
                default: 'behavior',
                required: false
            },
            dataLoader: {
                type: Function,
                default: null
            }
        },
        data()
        {
            return {
                items: [],
                types: null,
                ready: false
            };
        },
        watch: {
            filterArgs(val)
            {
                this.refreshList(val);
            }
        },
        computed: {
            loaderObject()
            {
                return typeof this.loader === 'string' ? this.entityLoader(this.loader) : this.loader;
            }
        },
        created()
        {
            this.refreshList();
        },
        methods: {
            refreshList(args = this.filterArgs)
            {
                this.$emit('refresh', args);
                this.ready = false;
                this.items = [];
                this.types = null;

                let promise = null;
                if (this.loaderObject.hasTypes()) {
                    promise = this.loaderObject.cached(this.typeCacheKey).then(data => {
                        this.types = data;
                        return this.loaderObject.getAll(args);
                    });
                }
                else {
                    promise = this.dataLoader
                        ? this.dataLoader(this.loaderObject, args)
                        : this.loaderObject.getAll(args);
                }

                promise = promise.then(data => {
                    this.$emit('dataloaded', data);
                    return {
                        items: data[this.collectionKey] || [],
                        types: this.types,
                        setItems: (result) => {
                            this.items = result;
                            this.ready = true;
                            this.$emit('load', result);
                        }
                    };
                });

                if (this.handler) {
                    promise = promise.then(this.handler);
                }
                else {
                    promise = promise.then(data => {
                        data.setItems(data.items);
                    });
                }
                return promise;
            },
            getItemType(item)
            {
                if (!Array.isArray(this.types)) {
                    return null;
                }

                return this.entityTypeFromList(this.types, item[this.typeKey],
                    this.behaviorKey ? item[this.behaviorKey] : null, this.typeKey, this.behaviorKey || null);
            }
        }
    };
</script>
