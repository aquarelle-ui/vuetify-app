<template>
    <entity-list-template
            ref="list"
            @refresh="$emit('refresh', $event)"
            @load="$emit('load', $event)"
            @dataloaded="$emit('dataloaded', $event)"
            two-line
            v-bind="$attrs"
            :loader="loader"
            :filterArgs="searchData">
        <template slot="item" slot-scope="{item, type, index}">
            <v-divider v-if="index > 0"></v-divider>
            <v-list-tile :key="item.id" @click="showContextMenu(item, type, $event)">
                <v-list-tile-avatar v-if="hasIcon" class="avatar--tile">
                    <slot name="item-avatar" :item="item" :type="type" :loader="loaderObject">
                        <image-icon v-if="!!item.icon" :src="item.icon"></image-icon>
                    </slot>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <slot name="item-text" :item="item" :type="type" :loader="loaderObject">
                        <v-list-tile-title>{{item.title}}</v-list-tile-title>
                        <v-list-tile-sub-title v-if="type !== null">
                            {{type.title}}
                            <small>({{item.type}}:{{item.behavior}})</small>
                        </v-list-tile-sub-title>
                    </slot>
                </v-list-tile-content>
                <v-list-tile-action>
                    <v-btn icon ripple @click="showContextMenu(item, type, $event)">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                </v-list-tile-action>
            </v-list-tile>
        </template>
        <context-menu ref="contextMenu"
                      @titlechanged="onTitleChanged"
                      @delete="onDelete"
                      :loader="loaderObject"
                      :show-title="editableTitle !== false"
                      :show-delete="deletable !== false"
                      :is-title-disabled="!isTitleEditable"
                      :is-delete-disabled="!isDeletable">
            <slot v-if="currentItem !== null"
                  name="item-actions"
                  :item="currentItem"
                  :type="currentItemType"
                  :loader="loaderObject">
            </slot>
        </context-menu>

        <slot></slot>
    </entity-list-template>
</template>
<script>
    import DataLoader from "../../loader/DataLoader";
    import Loaders from "../../Loaders";
    import EntityListTemplate from "./EntityListTemplate";
    import ImageIcon from "../misc/ImageIcon";
    import User from "../../User";
    import {EntityChangeTitleDialog, EntityDeleteDialog} from "../dialog";
    import ContextMenu from "./ContextMenu";

    export default {
        name: 'entity-list',
        components: {
            ContextMenu,
            EntityDeleteDialog,
            EntityChangeTitleDialog,
            ImageIcon,
            EntityListTemplate
        },
        props: {
            loader: {
                type: [DataLoader, String],
                required: true
            },
            deletable: {
                type: [Boolean, String, Array],
                default: false
            },
            editableTitle: {
                type: [Boolean, String, Array],
                default: false
            },
            hasIcon: {
                type: Boolean,
                default: true
            },
            page: {
                type: Number,
                default: 1
            },
            rows: {
                type: Number,
                default: 30
            },
            filterArgs: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                currentItem: null,
                currentItemType: null
            }
        },
        methods: {
            showContextMenu(item, type, event) {
                this.currentItem = item;
                this.currentItemType = type;
                this.$refs.contextMenu.show(event, item);
            },
            onTitleChanged(item, title) {
                this.$set(item, 'title', title);
            },
            onDelete(item) {
                const list = this.$refs.list.items;
                const index = list.indexOf(item);
                if (index > -1) {
                    list.splice(index, 1);
                    this.$emit('itemdeleted', {item, list});
                }
            },
            refreshList(args) {
                const list = this.$refs.list;
                list.refreshList(args === undefined ? list.filterArgs : args);
            }
        },
        computed: {
            searchData() {
                return {...this.filterArgs, page: this.page, rows: this.rows};
            },
            loaderObject() {
                return typeof this.loader === 'string' ? Loaders.get(this.loader) : this.loader;
            },
            isDeletable() {
                if (typeof this.deletable === 'boolean') {
                    return this.deletable;
                }
                return User.hasPermission(this.deletable);
            },
            isTitleEditable() {
                if (typeof this.editableTitle === 'boolean') {
                    return this.editableTitle;
                }
                return User.hasPermission(this.editableTitle);
            }
        }
    };
</script>