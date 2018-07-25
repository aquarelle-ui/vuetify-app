<template>
    <app-page ref="page" :title="$intl.translate(title)" :back="back">

        <template ref="filterDialog" v-if="filterForm && filterForm.length" slot="toolbar">
            <v-dialog v-model="dialog" max-width="500">
                <v-btn icon slot="activator">
                    <v-icon>{{$controlIcon(contextIcon)}}</v-icon>
                </v-btn>
                <block-form
                        ref="filterForm"
                        title="Filter items"
                        :items="filterForm"
                        v-model="dialogModel"
                        submit-button="Filter"
                        @submit="filterItems($event)"
                >
                </block-form>
            </v-dialog>
        </template>

        <entity-list
                :page="page"
                :loader="entity"
                ref="list"

                :deletable="hasDelete && canDelete"
                :editable-title="hasTitle && canEdit"
                :has-icon="hasIcon"

                :handler="loadHandler"

                :filter-args="filters"

                :collection-key="collectionKey"
                :type-key="typeKey"
                :behavior-key="behaviorKey"
                :type-cache-key="typeCacheKey"
                :rows="rows"

                :squared-icon="squaredIcon"
                @load="onListLoaded()"
                @refresh="onListRefresh()"
                @dataloaded="onListDataLoaded($event)"
                @itemdeleted="onItemDeletedCheck($event)"
        >

            <template v-if="customText != null" slot="item-text" slot-scope="{item, type}">
                <v-list-tile-title>{{getCustomTitle(item, type)}}</v-list-tile-title>
                <v-list-tile-sub-title>{{getCustomDescription(item, type)}}</v-list-tile-sub-title>
            </template>

            <template v-if="actions.length > 0" slot="item-actions" slot-scope="{item, type}">
                <v-list-tile v-for="action in actions" :key="$uniqueObjectId(action)"
                        :to="actionHref(action.href, item, type)" :disabled="!canEdit || (action.disabled && action.disabled(item, type))">
                    <v-list-tile-avatar>
                        <v-icon v-if="action.icon">{{action.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{$intl.translate(action.title)}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action></v-list-tile-action>
                </v-list-tile>
            </template>

        </entity-list>

        <v-layout v-if="lastPage > 1" v-show="listLoaded" class="white" align-center justify-center>
            <v-pagination circle v-model="page" :length="lastPage" :total-visible="visiblePages"></v-pagination>
        </v-layout>

        <v-fab-transition>
            <v-btn v-if="canAdd && listLoaded" fixed fab bottom right color="accent" :to="addHref">
                <v-icon>add</v-icon>
            </v-btn>
        </v-fab-transition>
    </app-page>
</template>
<script>
    import {AppPage} from "../app";
    import {EntityMixin, PagerMixin, CloseDialogsBeforeLeave} from "../../mixins";
    import {EntityList, EntityListLoadMixin} from "../list";

    export default {
        components: {
            EntityList,
            AppPage
        },
        mixins: [EntityListLoadMixin, EntityMixin, PagerMixin, CloseDialogsBeforeLeave],
        props: {
            entity: {
                type: String,
                required: true
            },
            title: {
                type: [String, Object],
                required: true
            },
            back: {
                type: String,
                default: '../'
            },
            permissions: {
                type: Object,
                require: true
            },
            rows: {
                type: Number,
                default: 30
            },
            addHref: {
                type: String,
                default: 'add.html'
            },
            hasTitle: {
                type: Boolean,
                default: true
            },
            hasIcon: {
                type: Boolean,
                default: true
            },
            hasDelete: {
                type: Boolean,
                default: true
            },
            actions: {
                type: Array,
                default: () => ([])
            },
            idField: {
                type: String,
                default: 'id'
            },

            filterArgs: {
                type: Object,
                default: null
            },
            filterForm: {
                type: Array,
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

            iconKey: {
                type: [String, Function],
                required: false,
                default: 'icon'
            },

            customText: {
                type: Object,
                default: null
            },

            visiblePages: {
                type: Number,
                default: 7
            },

            squaredIcon: {
                type: Boolean,
                default: false
            },
            contextIcon: {
                type: String,
                default: 'filter_list'
            },
            afterDelete: {
                type: Function,
                default: null
            }
        },
        data() {
            return {
                dialog: false,
                dialogModel: null
            }
        },
        created()
        {
            this.dialogModel = this.$clone(this.queryFilters) || {};
        },
        computed: {
            filters() {
                return {...this.queryFilters, ...this.filterArgs};
            },
            canAdd()
            {
                return this.checkPermission(this.permissions.add);
            },
            canEdit()
            {
                return this.checkPermission(this.permissions.edit);
            },
            canDelete()
            {
                return this.checkPermission(this.permissions.delete);
            }
        },
        methods: {
            onItemDeletedCheck(data) {
                if (this.afterDelete) {
                    this.afterDelete(data, this);
                }
                this.onItemDeleted(data);
            },
            filterItems(data) {
                this.dialog = false;
                this.page = 1;
                this.queryFilters = this.clearFilters(this.$clone(data));
            },
            clearFilters(obj) {
                if (obj == null || typeof obj !== 'object') {
                    return obj;
                }
                const keys = Object.keys(obj);
                if (keys.length === 0) {
                    return null;
                }
                keys.map(key => {
                    if (obj[key] == null || obj[key] === '') {
                        delete obj[key];
                        return;
                    }

                    const type = typeof obj[key];

                    if (type === 'string') {
                        obj[key] = obj[key].trim();
                        if (obj[key] === '') {
                            delete obj[key];
                        }
                        return;
                    }
                    if (type === 'number') {
                        if (isNaN(obj[key]) || !isFinite(obj[key])) {
                            delete obj[key];
                        }
                        return;
                    }

                    if (Array.isArray(obj[key])) {
                        obj[key] = obj[key].map(this.clearFilters(obj[key])).filter(Boolean);
                        if (obj[key].length === 0) {
                            delete obj[key];
                        }
                        return;
                    }

                    if (type !== 'object') {
                        delete obj[key];
                        return;
                    }

                    obj[key] = this.clearFilters(obj[key]);
                    if (Object.keys(obj[key]).length === 0) {
                        delete obj[key];
                    }
                });

                if (Object.keys(obj).length === 0) {
                    return null;
                }

                return obj;
            },
            getCustomTitle(item, type)
            {
                return this.getCustomText(this.customText.title, item, type);
            },
            getCustomDescription(item, type)
            {
                return this.getCustomText(this.customText.description, item, type);
            },
            getCustomText(text, item, type)
            {
                if (!text) {
                    return null;
                }
                if (typeof text === 'function') {
                    return text(item, type, this);
                }

                return item[text] || null;
            },
            actionHref(action, item, type)
            {
                if (typeof action === 'function') {
                    return action(item, type, this);
                }
                return action.replace('{id}', item[this.idField]);
            },
            checkPermission(perm)
            {
                if (typeof perm === 'boolean') {
                    return perm;
                }
                return this.$user.hasPermission(perm);
            },
            loadHandler(data)
            {
                if (!this.hasIcon || !this.iconKey) {
                    data.setItems(data.items);
                    return;
                }

                const isFunc = typeof this.iconKey === 'function';

                if (!data.types) {
                    data.items.map(item => {
                        if (isFunc) {
                            item.icon = this.iconKey(item, this);
                        }
                        else {
                            item.icon = item[this.iconKey] || null;
                        }
                    });
                    data.setItems(data.items);
                    return;
                }

                data.items.map(item => {
                    const type = this.entityTypeFromList(data.types, item[this.typeKey],
                        this.behaviorKey ? item[this.behaviorKey] : null, this.typeKey, this.behaviorKey || null);

                    if (!type) {
                        item.icon = (isFunc ? this.iconKey(item, this) : item[this.iconKey]) || null;
                    }
                    else {
                        item.icon = (isFunc ? this.iconKey(type, this) : (type[this.iconKey] || type.title));
                    }
                });

                data.setItems(data.items);
            },
            onRouteLeave(func)
            {
                if (this.dialog) {
                    if (func(this.$refs.filterForm)) {
                        this.dialog = false;
                    }
                    return false;
                }

                return func(this.$refs.list);
            }
        }
    }
</script>
