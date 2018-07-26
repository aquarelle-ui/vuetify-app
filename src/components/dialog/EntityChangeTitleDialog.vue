<template>
    <v-dialog v-model="showDialog" persistent v-bind="$attrs">
        <v-card>
            <v-card-title class="headline">
                {{$intl.translate(title)}}
            </v-card-title>
            <v-card-text v-if="!processingMode">
                <v-text-field :label="$intl.translate(titleLabel)" :error-messages="error === null ? undefined : [error]" v-model="itemTitle" required></v-text-field>
            </v-card-text>
            <v-card-text v-else>
                <v-progress-linear indeterminate></v-progress-linear>
            </v-card-text>
            <v-card-actions v-show="!processingMode">
                <v-spacer></v-spacer>
                <v-btn color="secondary" flat :disabled="processingMode" @click.native="cancelDialog">
                    {{$intl.translate({text: 'Cancel', key: 'ui:common.cancel'})}}
                </v-btn>
                <v-btn color="primary" flat :disabled="saveDisabled" @click.native="confirmDialog">
                    {{$intl.translate({text: 'Save', key: 'ui:common.save'})}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import DataLoader from "../../loader/DataLoader";
    import Loaders from "../../Loaders";

    export default {
        name: "entity-change-title-dialog",
        props: {
            title: {
                type: [Object, String],
                default: () => ({text: 'Change title', key: 'ui:common.changeTitle'})
            },
            titleLabel: {
                type: [Object, String],
                default: () => ({text: 'Title', key: 'ui:common.titleLabel'})
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
                processingMode: false,
                itemTitle: null,
                error: null
            };
        },
        watch: {
            showDialog(value) {
                if (value) {
                    this.processingMode = false;
                    this.error = null;
                    this.itemTitle = this.item.title;
                }
            }
        },
        computed: {
            saveDisabled() {
                return this.processingMode || this.itemTitle === this.item.title;
            },
            loaderObject() {
                return typeof this.loader === 'string' ? Loaders.get(this.loader) : this.loader;
            }
        },
        methods: {
            cancelDialog() {
                this.$emit('update:showDialog', false);
            },
            confirmDialog() {
                this.processingMode = true;
                this.loaderObject.update(this.item.id, {title: this.itemTitle}).then(() => {
                    this.$emit('update:showDialog', false);
                    this.$emit('changed', this.item, this.itemTitle);
                }).catch(error => {
                    if (error.response && error.response.status === 401) {
                        this.$emit('mustlogin', () => {
                           this.confirmDialog();
                        });
                        return;
                    }
                    this.processingMode = false;
                    this.error = error.toString();
                });
            },
            onRouteLeave(func)
            {
                if (this.showDialog) {
                    if (this.processingMode) {
                        return false;
                    }
                    this.cancelDialog();
                    return false;
                }

                return true;
            }
        }
    }
</script>
