<template>
    <v-menu v-show="false" v-model="contextMenu" :left="openLeft" :position-x="x" :position-y="y">
        <v-list>
            <slot></slot>

            <v-list-tile v-if="item && showTitle" :disabled="isTitleDisabled"
                         @click.stop="contextMenu = false; showTitleDialog = true">
                <v-list-tile-avatar>
                    <v-icon>title</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{$intl.translate({text: 'Change title', key: 'common.changeTitle'})}}
                    </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <entity-change-title-dialog
                            :show-dialog.sync="showTitleDialog"
                            :item="item"
                            :loader="loader"
                            ref="titleDialog"
                            @changed="onTitleChanged"
                            @mustlogin="$emit('mustlogin', $event)"
                            max-width="300">
                    </entity-change-title-dialog>
                </v-list-tile-action>
            </v-list-tile>

            <v-list-tile v-if="item && showClone" :disabled="isCloneEnabled"
                         @click.stop="contextMenu = false; showCloneDialog = true">
                <v-list-tile-avatar>
                    <v-icon>control_point_duplicate</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{$intl.translate({text: 'Clone', key: 'common.clone'})}}
                    </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                    <entity-clone-dialog
                            :show-dialog.sync="showCloneDialog"
                            :item="item"
                            :loader="loader"
                            ref="cloneDialog"
                            @cloned="onClone"
                            @mustlogin="$emit('mustlogin', $event)"
                            max-width="300">
                    </entity-clone-dialog>
                </v-list-tile-action>
            </v-list-tile>

            <template v-if="item && showDelete">
                <v-divider></v-divider>
                <v-list-tile :disabled="isDeleteDisabled"
                             @click.stop="contextMenu = false; showDeleteDialog = true">
                    <v-list-tile-avatar>
                        <v-icon>delete</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{$intl.translate({text: 'Delete', key: 'common.delete'})}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <entity-delete-dialog
                                :show-dialog.sync="showDeleteDialog"
                                :item="item"
                                :loader="loader"
                                ref="deleteDialog"
                                @delete="onDelete"
                                @mustlogin="$emit('mustlogin', $event)"
                                max-width="300">
                        </entity-delete-dialog>
                    </v-list-tile-action>
                </v-list-tile>
            </template>
        </v-list>
    </v-menu>
</template>
<script>
    import {EntityChangeTitleDialog, EntityCloneDialog, EntityDeleteDialog} from "../dialog";

    export default {
        components: {
            EntityChangeTitleDialog,
            EntityDeleteDialog,
            EntityCloneDialog,
        },
        data() {
            return {
                contextMenu: false,
                showTitleDialog: false,
                showDeleteDialog: false,
                showCloneDialog: false,
                item: null,
                x: 0,
                y: 0,
                openLeft: false,
            }
        },
        props: {
            showTitle: {
                type: Boolean,
                default: true,
            },
            isTitleDisabled: {
                type: Boolean,
                default: true
            },
            showDelete: {
                type: Boolean,
                default: true,
            },
            isDeleteDisabled: {
                type: Boolean,
                default: true
            },
            showClone: {
                type: Boolean,
                default: false,
            },
            isCloneEnabled: {
                type: Boolean,
                default: false,
            },

            loader: {
                type: Object,
                required: true
            }
        },
        methods: {
            show(event, item) {
                if (this.contextMenu) {
                    return;
                }
                this.x = event.x;
                this.y = event.y;
                this.openLeft = event.x > window.innerWidth / 2;
                this.item = item || null;
                this.contextMenu = true;
            },
            onTitleChanged(item, title) {
                this.$emit('titlechanged', item, title);
            },
            onClone(data) {
                this.$emit('itemcloned', data);
            },
            onDelete(item) {
               this.$emit('delete', item);
            },
            onRouteLeave(func)
            {
                if (this.showTitle) {
                    if (!func(this.$refs.titleDialog)) {
                        return false;
                    }
                }

                if (this.showClone) {
                    if (!func(this.$refs.cloneDialog)) {
                        return false;
                    }
                }

                if (this.showDelete) {
                    if (!func(this.$refs.deleteDialog)) {
                        return false;
                    }
                }

                this.contextMenu = false;

                return true;
            }
        }
    }
</script>
