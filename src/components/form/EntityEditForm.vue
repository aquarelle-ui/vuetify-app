<template>
    <app-page ref="page" :title="$intl.translate(title)" :back="back" :loading="loading">
        <div v-if="loaderError">
            Error! Cannot load {{entity}}:{{id}}
        </div>
        <block-form
                v-else
                ref="form"
                :fill-height="fillHeight"
                :processing="processing"
                :title="instance && instance[titleKey] || ''"
                v-model="model"
                :items="parsedFields"
                :submit-button="submitButtonText"
                @submit="onSubmit($event)"
        >
        </block-form>
    </app-page>
</template>
<script>
    import {AppPage} from "../app";
    import {EntityMixin, CloseDialogsBeforeLeave, PageNotifier, ServerErrorMixin} from "../../mixins";

    export default {
        components: {AppPage},
        mixins: [EntityMixin, CloseDialogsBeforeLeave, PageNotifier, ServerErrorMixin],
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
                type: String,
                default: 'title'
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
                    const fields = this.parseFormFields(this.fields, data);
                    if (fields instanceof Promise) {
                        fields.then(fields => {
                            this.parsedFields = fields;
                            initModel(data, this.modelFieldName);
                            this.loading = false;
                        });
                    }
                    else {
                        this.parsedFields = fields;
                        initModel(data, this.modelFieldName);
                        this.loading = false;
                    }
                })
                .catch(error => {
                    this.loaderError = true;
                    this.loading = false;
                });
        },
        computed: {
            loader()
            {
                return this.entityLoader(this.entity);
            }
        },
        methods: {
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
            onSubmit(data)
            {
                this.processing = true;

                data = this.$clone(data);

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