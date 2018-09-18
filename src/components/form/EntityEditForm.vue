<template>
    <app-page ref="page" :title="$intl.translate(title)" :back="back" :loading="loading">
        <div v-if="loaderError">
            Error! Cannot load {{entity}}:{{id}}
        </div>
        <template v-else>
            <template v-if="contextActions && contextActions.length" slot="toolbar">
                <v-menu offset-y>
                    <v-btn icon slot="activator">
                        <v-icon>{{$controlIcon(contextIcon)}}</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile v-for="item in contextActions" :key="$uniqueObjectId(item)" @click="contextItemAction(item)" :disabled="isContextItemDisabled(item)">
                            <v-list-tile-avatar>
                                <v-icon>{{$controlIcon(item.icon || '')}}</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{$intl.translate(item.title)}}
                                </v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>&nbsp;</v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </template>
            <block-form
                    ref="form"
                    :fill-height="fillHeight"
                    :processing="processing"
                    :title="instanceTitle"
                    v-model="model"
                    :items="parsedFields"
                    :submit-button="submitButtonText"
                    @submit="onSubmit($event)"
                    :translate="formTranslate"
                    :options="formOptions"
            >
            </block-form>
        </template>
    </app-page>
</template>
<script>
    import {AppPage} from "../app";
    import {EntityMixin, CloseDialogsBeforeLeave, PageNotifier, ServerErrorMixin, LoginMixin, FormMixin} from "../../mixins";

    export default {
        components: {AppPage},
        mixins: [EntityMixin, CloseDialogsBeforeLeave, PageNotifier, ServerErrorMixin, LoginMixin, FormMixin],
        props: {
            // Page title
            title: {
                type: [String, Object],
                required: true
            },

            // Back button action
            back: {
                type: String,
                default: '../'
            },

            // Errors
            errors: {
                type: Object,
                required: false
            },

            // Custom error handler
            errorHandler: {
                type: Function,
                required: false,
            },

            // Entity name
            entity: {
                type: String,
                required: true
            },

            // Entity id
            id: {
                type: String,
                required: true
            },

            // Steps
            fields: {
                type: [String, Array, Function],
                default: null
            },

            modelFieldName: {
                type: String,
                default: 'settings'
            },

            // Function to pre-process data before saving
            // Or an array of allowed properties
            preProcessModelData: {
                type: [Function, Array],
                required: false
            },

            // Extra data that should be added before saving
            extraModelData: {
                type: Object,
                required: false
            },

            // Custom save handler
            saveHandler: {
                type: Function,
                required: false
            },

            // Method to call on loader
            loaderMethod: {
                type: String,
                default: 'update'
            },

            // Where to redirect after creation
            redirectPath: {
                type: [String, Function],
                required: false
            },

            submitButtonText: {
                type: [String, Object],
                default: 'Save'
            },

            successMessage: {
                type: [String, Object],
                default: 'Saved'
            },

            fillHeight: {
                type: Boolean,
                default: true
            },

            titleKey: {
                type: [String, Function],
                default: 'title'
            },

            contextActions: {
                type: Array,
                default: null
            },
            contextIcon: {
                type: String,
                default: 'edit'
            },

            afterSave: {
                type: Function,
                default: null
            }
        },
        data()
        {
            return {
                parsedFields: null,
                loading: true,
                loaderError: false,
                model: {},
                processing: false,
                instance: null
            };
        },
        created()
        {
            if (!this.loader) {
                this.loading = false;
                this.loaderError = true;
                return;
            }

            this.onInit();
        },
        watch: {
            id() {
                this.loading = true;
                this.instance = null;
                this.$nextTick(() => {
                    this.model = null;
                    this.parsedFields = null;
                    this.onInit();
                });
            }
        },
        computed: {
            loader()
            {
                return this.entityLoader(this.entity);
            },
            instanceTitle()
            {
                if (!this.instance) {
                    return '';
                }
                if (typeof this.titleKey === 'function') {
                    return this.titleKey(this.instance, this) || '';
                }
                return this.instance[this.titleKey] || '';
            }
        },
        methods: {
            onInit() {
                const initModel = (data, field) => {
                    if (field == null) {
                        this.model = data;
                    }
                    else {
                        this.model = data[field];
                    }
                };

                this.loader.get(this.id)
                    .then(data => {
                        this.instance = data;
                        initModel(data, this.modelFieldName);
                        const fields = this.parseFormFields(this.fields, data);
                        if (fields instanceof Promise) {
                            fields.then(fields => {
                                this.parsedFields = fields;
                                this.loading = false;
                            });
                        }
                        else {
                            this.parsedFields = fields;
                            this.loading = false;
                        }
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 401) {
                            this.doLogin(() => this.onInit());
                            return;
                        }
                        this.loaderError = true;
                        this.loading = false;
                    });
            },
            contextItemAction(item) {
                if (this.isContextItemDisabled(item)) {
                    return false;
                }
                if (item.action && typeof item.action === 'function') {
                    return item.action(this, item);
                }
                return false;
            },
            isContextItemDisabled(item) {
                if (!item.hasOwnProperty('disabled')) {
                    return false;
                }
                if (typeof item.disabled === 'boolean') {
                    return item.disabled;
                }
                if (Array.isArray(item.disabled)) {
                    return !this.$user.hasPermission(item.disabled)
                }
                if (typeof item.disabled === "function") {
                    return item.disabled(this, item);
                }
                return false;
            },
            parseFormFields(fields, data)
            {
                if (Array.isArray(fields)) {
                    return fields;
                }
                if (typeof fields === 'function') {
                    return fields(data, this);
                }

                if (!fields) {
                    fields = {prop: "fields"};
                }
                else if (typeof fields === "string") {
                    fields = {prop: fields};
                }

                fields = {
                    prop: 'fields',
                    typeProp: 'type',
                    behaviorProp: 'behavior',
                    ...fields
                };

                let type = null;
                if (fields.behaviorProp == null) {
                    type = data[fields.typeProp];
                } else {
                    type = {
                        [fields.typeProp]: data[fields.typeProp],
                        [fields.behaviorProp]: data[fields.behaviorProp]
                    }
                }

                return this.entityTypeFields(this.entity, type, fields.prop, [], this.typeProp, this.behaviorProp);
            },
            onSubmit(originalData)
            {
                this.processing = true;

                let data = this.$clone(originalData);

                if (this.modelFieldName) {
                    data = {[this.modelFieldName]: data}
                }

                if (this.preProcessModelData) {
                    if (Array.isArray(this.preProcessModelData)) {
                        for (let prop in data) {
                            if (!data.hasOwnProperty(prop)) {
                                continue;
                            }
                            if (this.preProcessModelData.indexOf(prop) === -1) {
                                delete data[prop];
                            }
                        }
                    }
                    else {
                        data = this.preProcessModelData(data);
                    }
                }

                if (this.extraModelData) {
                    data = {...data, ...this.extraModelData};
                }

                const promise = this.saveHandler
                    ? this.saveHandler(this.loader, this.id, data, this.entity)
                    : this.loader[this.loaderMethod](this.id, data);

                promise
                    .then(result => {
                        this.processing = false;

                        if (this.afterSave) {
                            this.afterSave(data, result, this);
                        }

                        let path = this.redirectPath;

                        if (!path) {
                            this.notifier.showSuccess(this.$intl.translate(this.successMessage));
                            return;
                        }

                        if (typeof path === 'function') {
                            path = path(result, data);
                        } else {
                            path = path.replace('{id}', result.id);
                        }

                        this.$nextTick(() => this.$router.push(path));
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 401) {
                            this.doLogin(() => this.onSubmit(originalData));
                            return;
                        }
                        if (this.errorHandler) {
                            let err = this.errorHandler(error, this);
                            if (err != null) {
                                error = err;
                            }
                        } else {
                            error = this.parseErrorObject(error, this.errors);
                        }

                        if (error == null) {
                            error = {
                                text: "Cannot save entity " + this.entity,
                                key: null, // TODO
                            };
                        }

                        if (typeof error.then === 'function') {
                            error.then(error => {
                                this.notifier.showError(this.$intl.translate(error));
                                this.processing = false;
                            });
                        }
                        else {
                            this.notifier.showError(this.$intl.translate(error));
                            this.processing = false;
                        }
                    });
            }
        }
    }
</script>