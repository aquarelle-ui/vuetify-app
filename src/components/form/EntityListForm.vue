<template>
    <app-page ref="page" :title="pageTitle" :back="back">

        <template slot="toolbar">
            <v-btn v-if="refreshButton" dark icon @click.stop="$refs.list && $refs.list.refreshList()">
                <v-icon>{{$controlIcon('refresh')}}</v-icon>
            </v-btn>
            <template ref="filterDialog" v-if="filterForm && filterForm.length">
                <v-dialog lazy v-model="dialog" max-width="500">
                    <v-btn @click="makeDialogModel()" dark icon slot="activator">
                        <v-icon>{{$controlIcon(contextIcon)}}</v-icon>
                    </v-btn>
                    <block-form
                            ref="filterForm"
                            title="Search..."
                            :items="filterForm"
                            v-model="dialogModel"
                            submit-button="Search"
                            @submit="filterItems($event)"
                            :options="formOptions"
                    >
                        <template slot-scope="props">
                            <v-btn flat @click.stop="dialogModel = {}, filterItems(dialogModel)">
                                <v-icon>clear</v-icon>
                                Reset
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="primary"
                                   :disabled="props.submitDisabled"
                                   @click.stop="props.submit()">
                                <v-icon>search</v-icon>
                                Search
                            </v-btn>
                        </template>
                    </block-form>
                </v-dialog>
            </template>
        </template>

        <entity-list
                :page="listPage"
                :loader="entity"
                ref="list"

                :deletable="hasDelete && canDelete"
                :cloneable="hasClone && canAdd"
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
                @dataloaded="onListDataLoadedCheck($event)"
                @itemdeleted="onItemDeletedCheck($event)"
                @itemcloned="onItemClonedCheck($event)"
                @mustlogin="doLogin($event)"
        >

            <template v-if="customText != null" slot="item-text" slot-scope="{item, type}">
                <v-list-tile-title v-html="getCustomTitle(item, type) || ''"></v-list-tile-title>
                <v-list-tile-sub-title v-html="getCustomDescription(item, type) || ''"></v-list-tile-sub-title>
            </template>

            <template v-if="actions.length > 0" slot="item-actions" slot-scope="{item, type}">
                <v-list-tile v-for="action in actions" :key="$uniqueObjectId(action)"
                             :to="action.callback ? undefined : actionHref(action.href, item, type)"
                             @click="action.callback && canEdit && !(action.disabled && action.disabled(item, type)) && action.callback(item, type)"
                             :disabled="!canEdit || (action.disabled && action.disabled(item, type))">
                    <v-list-tile-avatar>
                        <v-icon v-if="action.icon">{{action.icon}}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="actionTitle(action.title, item, type)">
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>&nbsp;</v-list-tile-action>
                </v-list-tile>
            </template>

        </entity-list>

        <v-layout v-if="lastPage > 1" v-show="listLoaded" class="white" align-center justify-center>
            <v-pagination circle v-model="page" :length="lastPage" :total-visible="visiblePages"></v-pagination>
        </v-layout>

        <div class="fab-wrapper">
            <v-fab-transition>
                <v-btn v-if="canAdd && listLoaded" fab fixed bottom color="primary" :to="addHref">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-fab-transition>
        </div>
    </app-page>
</template>
<script>
    import {AppPage} from "../app";
    import {EntityMixin, PagerMixin, CloseDialogsBeforeLeave, LoginMixin, FormMixin} from "../../mixins";
    import {EntityList, EntityListLoadMixin} from "../list";

    export default {
        components: {
            EntityList,
            AppPage
        },
        mixins: [EntityListLoadMixin, EntityMixin, PagerMixin, CloseDialogsBeforeLeave, LoginMixin, FormMixin],
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
            hasClone: {
                type: Boolean,
                default: false
            },
            actions: {
                type: Array,
                default: () => ([])
            },
            idField: {
                type: String,
                default: 'id'
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
                default: 'search'
            },
            afterDelete: {
                type: Function,
                default: null
            },
            clonedAction: {
                type: [Function, String],
                default: null
            },
            refreshButton: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                totalLoaded: 0,
                dialog: false,
                dialogModel: {}
            }
        },
        watch: {
            '$route.query'(val)
            {
                if (this.dialog) {
                    this.dialog = false;
                }
                if (val.page) {
                    this.page = parseInt(val.page) || 1;
                } else if (this.page > 1) {
                    this.page = 1;
                }
            }
        },
        computed: {
            pageTitle()
            {
                return this.$intl.translate(this.title,
                    {total: this.totalLoaded, page: this.listPage, last: this.lastPage || 1, rows: this.rows},
                    this.totalLoaded, null);
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
            makeDialogModel()
            {
                if (!this.$route || !this.$route.query) {
                    this.dialogModel = {};
                    return;
                }
                this.dialogModel = this.$clone(this.$route.query);
                delete this.dialogModel.page;
            },
            onListDataLoadedCheck(data)
            {
                this.totalLoaded = data.total || 0;
                this.onListDataLoaded(data);
            },
            onItemDeletedCheck(data)
            {
                if (this.afterDelete) {
                    this.afterDelete(data, this);
                }
                this.onItemDeleted(data);
            },
            onItemClonedCheck(data) {
                let url = this.actionHref(this.clonedAction, data, null);
                this.$route.push(url);
            },
            filterItems(data)
            {
                this.dialog = false;
                this.page = 1;
                this.queryFilters = this.clearFilters(this.$clone(data));
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

                return item[text] || undefined;
            },
            actionHref(action, item, type)
            {
                if (typeof action === 'function') {
                    const href = action(item, type, this);
                    return typeof href === 'string' ? href : undefined;
                }
                return action.replace('{id}', item[this.idField]);
            },
            actionTitle(action, item, type) {
                if (typeof action === 'function') {
                    return action(item, type, this);
                }
                return this.$intl.translate(action, item);
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
