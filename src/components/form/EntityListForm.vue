<template>
    <app-page ref="page" :title="$intl.translate(title)" :back="back">

        <v-layout v-if="lastPage > 1" v-show="listLoaded" class="white" align-center justify-center>
            <v-pagination circle v-model="page" :length="lastPage" :total-visible="visiblePages"></v-pagination>
        </v-layout>

        <entity-list
                :page="page"
                :loader="entity"
                ref="list"

                :deletable="hasDelete && canDelete"
                :editable-title="hasTitle && canEdit"
                :has-icon="hasIcon"

                :handler="loadHandler"

                :filter-args="filterArgs"

                :collection-key="collectionKey"
                :type-key="typeKey"
                :behavior-key="behaviorKey"
                :type-cache-key="typeCacheKey"

                @load="onListLoaded()"
                @refresh="onListRefresh()"
                @dataloaded="onListDataLoaded($event)"
                @itemdeleted="onItemDeleted($event)"
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

        <v-fab-transition v-if="canAdd">
            <v-btn v-show="listLoaded" fixed fab bottom right color="accent" :to="addHref">
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
                type: String,
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
            }
        },
        computed: {
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

                if (!data.types) {
                    data.items.map(item => {
                        item.icon = item[this.iconKey] || null;
                    });
                    data.setItems(data.items);
                    return;
                }

                data.items.map(item => {
                    const type = this.entityTypeFromList(data.types, item[this.typeKey],
                        this.behaviorKey ? item[this.behaviorKey] : null, this.typeKey, this.behaviorKey || null);

                    if (!type) {
                        item.icon = null;
                    }
                    else {
                        item.icon = item[this.iconKey] || null;
                    }
                });

                data.setItems(data.items);
            },
            onRouteLeave(func)
            {
                return func(this.$refs.list);
            }
        }
    }
</script>
