<template>
    <v-dialog v-model="showDialog" persistent v-bind="$attrs">
        <v-card>
            <v-card-title class="headline">{{$intl.translate(title)}}</v-card-title>
            <v-card-text v-if="!deleteMode">
                <div class="red--text" v-if="error !== null"><v-icon color="red">warning</v-icon> {{error}}</div>
                <template v-else>
                    {{$intl.translate(message)}}
                </template>
            </v-card-text>
            <v-card-text v-else>
                <v-progress-linear indeterminate></v-progress-linear>
            </v-card-text>
            <v-card-actions v-show="!deleteMode">
                <v-spacer></v-spacer>
                <v-btn color="secondary" flat :disabled="deleteMode" @click.native="cancelDialog">
                    {{$intl.translate({text: 'Cancel', key: 'ui:common.cancel'})}}
                </v-btn>
                <v-btn color="red" flat :disabled="deleteMode" @click.native="confirmDialog">
                    {{$intl.translate({text: 'Delete', key: 'ui:common.delete'})}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import DataLoader from "../../loader/DataLoader";
    import Loaders from "../../Loaders";

    export default {
        name: "entity-delete-dialog",
        props: {
            title: {
                type: [Object, String],
                default: () => ({text: 'Delete item', key: 'ui:common.deleteItem'})
            },
            message: {
                type: [Object, String],
                default: () => ({
                    text: 'Are you sure you want to delete this item?',
                    key: 'ui:common.deleteItemMessage'
                })
            },
            loader: {
                type: [String, DataLoader],
                required: true
            },
            item: {
                type: Object,
                required: true
            },
            showDialog: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                deleteMode: false,
                error: null
            };
        },
        watch: {
            showDialog(show) {
                if (show) {
                    this.error = null;
                    this.deleteMode = false;
                }
            }
        },
        computed: {
            loaderObject() {
                return typeof this.loader === 'string' ? Loaders.get(this.loader) : this.loader;
            }
        },
        methods: {
            cancelDialog() {
                this.$emit('update:showDialog', false);
            },
            confirmDialog() {
                this.deleteMode = true;
                this.error = null;
                this.loaderObject.delete(this.item.id).then(() => {
                    this.$emit('update:showDialog', false);
                    this.$emit('delete', this.item);
                }).catch(err => {
                    this.error = err.toString();
                    this.deleteMode = false;
                });
            }
        }
    }
</script>
