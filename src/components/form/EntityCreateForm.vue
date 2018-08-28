<template>
    <app-page ref="page" :title="$intl.translate(title)" :back="back" :loading="loading">
        <div v-if="loaderError">
            Error! There is no such entity {{entity}}
        </div>
        <stepper-form v-else
                      ref="form"
                      v-model="model"
                      :processing="processing"
                      :steps="parsedSteps"
                      :next-button-text="nextButtonText"
                      :finishButtonText="finishButtonText"
                      :fill-height="fillHeight"
                      :translate="formTranslate"
                      :options="formOptions"
                      @input="onSubmit($event)">
        </stepper-form>
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

            // Steps
            steps: {
                type: Array,
                required: true
            },

            // Initial model data
            initialModelData: {
                type: [Function, Object],
                required: false
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
                default: 'create'
            },

            // Where to redirect after creation
            redirectPath: {
                type: [String, Function],
                default: 'list.html'
            },

            // Stepper settings
            nextButtonText: {
                type: [String, Object],
                required: false
            },

            finishButtonText: {
                type: [String, Object],
                required: false
            },

            fillHeight: {
                type: Boolean,
                default: true
            },

            afterSave: {
                type: Function,
                default: null
            }
        },
        data()
        {
            return {
                parsedSteps: null,
                loading: true,
                loaderError: false,
                model: {},
                processing: false,
            };
        },
        created()
        {
            if (!this.loader) {
                this.loading = false;
                this.loaderError = true;
                return;
            }

            if (this.initialModelData) {
                if (typeof this.initialModelData === 'function') {
                    this.model = this.initialModelData(this);
                }
                else {
                    this.model = {...this.initialModelData}
                }
            }

            const wrap = (step, prop, copy = true) => {
                if (copy) {
                    step = {...step};
                }
                let f = step[prop];
                step[prop] = (model, step, form) => f(model, step, form, this);
                return step;
            };

            const parseType = (info) => {
                info = {
                    entity: this.entity,
                    field: '_entity_type',
                    prop: 'fields',
                    typeProp: 'type',
                    behaviorProp: 'behavior',
                    fallback: [],
                    ...info
                };

                return model => {
                    return this.entityTypeFields(info.entity, model[info.field], info.prop, info.fallback,
                        info.typeProp, info.behaviorProp);
                };
            };

            this.parsedSteps = this.steps.map(step => {
                if (typeof step.items !== 'function') {
                    let copy = true;

                    if (step.items && typeof step.items === 'object' && !Array.isArray(step.items)) {
                        copy = false;
                        step = {...step};
                        step.items = parseType(step.items);
                    }

                    if (typeof step.callback !== 'function') {
                        return step;
                    }

                    return wrap(step, 'callback', copy);
                }
                else {
                    if (typeof step.callback !== 'function') {
                        return wrap(step, 'items');
                    }
                }

                step = wrap(step, 'items');
                return wrap(step, 'callback', false);
            });

            this.loading = false;
        },
        computed: {
            loader()
            {
                return this.entityLoader(this.entity);
            }
        },
        methods: {
            onSubmit(originalData)
            {
                this.processing = true;

                let data = this.$clone(originalData);

                if (this.extraModelData) {
                    data = {...data, ...this.extraModelData};
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
                        data = this.preProcessModelData(data, this);
                    }
                }

                const promise = this.saveHandler
                    ? this.saveHandler(this.loader, data, this.entity)
                    : this.loader[this.loaderMethod](data);

                promise
                    .then(result => {
                        this.processing = false;

                        if (this.afterSave) {
                            this.afterSave(data, result, this);
                        }

                        let path = this.redirectPath;
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
                                text: "Cannot create entity " + this.entity,
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