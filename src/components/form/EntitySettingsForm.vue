<template>
    <app-page :title="$intl.translate(title)" :back="back" :loading="entityInfo.loading">
        <v-layout v-if="entityInfo.error !== null" fill-height justify-center align-center>
            Server error
        </v-layout>
        <template v-else-if="fields !== null && model !== null">
            <block-form
                    ref="form"
                    @submit="onSubmit($event)"
                    fill-height
                    :processing="processing"
                    :title="entityInfo.instance.title"
                    v-model="model"
                    :items="fields"
            >
            </block-form>
        </template>
    </app-page>
</template>
<script>
    import AppPage from "../app/AppPage";
    import {EntityInfoMixin, CloseDialogsBeforeLeave} from "../../mixins";

    export default {
        components: {AppPage},
        mixins: [EntityInfoMixin, CloseDialogsBeforeLeave],
        props: {
            fieldName: {
                type: String,
                default: 'settings',
            },
            formFields: {
                type: [String, Array, Function],
                default: 'fields'
            },
            allowedFields: {
                type: Array,
                default: null
            },
            title: {
                type: [String, Object],
                default: 'Edit'
            },
            back: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                fields: null,
                model: null,
                processing: false,
            };
        },
        created() {
            if (!this.entityInfo.loading) {
                this.setupModel();
                this.setupFields();
            }
        },
        watch: {
            'entityInfo.loading'(val) {
                if (!val) {
                    this.setupModel();
                    this.setupFields();
                }
            }
        },
        methods: {
            setupFields() {
                if (Array.isArray(this.formFields)) {
                    this.fields = this.formFields;
                    return;
                }
                if (typeof this.formFields === 'function') {
                    const f = this.formFields(this.entityInfo.instance);
                    if (f instanceof Promise) {
                        f.then(data => this.fields = data);
                    }
                    else {
                        this.fields = f;
                    }
                    return;
                }
                this.fields = this.entityInfo.type[this.formFields];
            },
            setupModel() {
                if (this.entityInfo && this.entityInfo.instance) {
                    if (this.fieldName) {
                        this.model = this.$clone(this.entityInfo.instance[this.fieldName]);
                    }
                    else {
                        this.model = this.$clone(this.entityInfo.instance);
                    }
                }
            },
            onSubmit(data) {
                this.processing = true;
                if (this.allowedFields && this.allowedFields.length > 0) {
                    const newData = {};
                    this.allowedFields.map(field => {
                        if (data.hasOwnProperty(field)) {
                            newData[field] = data[field];
                        }
                    });
                    data = newData;
                }
                if (this.fieldName) {
                    data = {[this.fieldName]: data};
                }
                this.entityInfo.loader.update(this.entityInfo.id, data)
                    .then(() => {
                        this.processing = false;
                        // TODO: show notification ...
                    })
                    .catch(error => {
                        this.processing = false;
                        error.response.json().then(data => {
                            // TODO: handle error
                        });
                    });
            }
        }
    }
</script>
