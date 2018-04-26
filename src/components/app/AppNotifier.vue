<template>
    <v-snackbar v-model="snackbar" v-bind="position" :color="type" :timeout="timeout" :vertical="vertical" :multi-line="multiLine">
        <slot :message="message">
            {{message}}
        </slot>
        <slot name="actions">
            <v-btn icon flat @click.native.stop="hide()">
                <v-icon>close</v-icon>
            </v-btn>
        </slot>
    </v-snackbar>
</template>
<script>
    export default {
        props: {
            multiLine: {
                type: Boolean,
                default: false,
            },
            vertical: {
                type: Boolean,
                default: false,
            },
            position: {
                type: Object,
                default() {
                    return {bottom: true}
                }
            }
        },
        data() {
            return {
                type: '',
                snackbar: false,
                message: null,
                timeout: 3000
            };
        },
        methods: {
            showInfo(message, timeout = 3000)
            {
                this.show("info", message, timeout);
            },
            showSuccess(message, timeout = 3000)
            {
                this.show("success", message, timeout);
            },
            showError(message, timeout = 3000)
            {
                this.show("error", message, timeout);
            },
            show(type, message, timeout = 3000)
            {
                this.snackbar = false;
                this.$nextTick(() => {
                    this.type = type;
                    this.timeout = timeout;
                    this.message = message;
                    this.snackbar = true;
                })
            },
            hide()
            {
                this.snackbar = false;
            }
        }
    };
</script>