<template>
    <div v-show="false">
        <span v-dom-portal="titleSelector">
            <v-btn v-if="showBack" v-show="back.length > 0" exact small icon class="ml-0 mr-0" :to="back"><v-icon>arrow_back</v-icon></v-btn>
            {{title}}
        </span>
        <div v-dom-portal="toolbarSelector">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'app-toolbar',
        props: {
            title: {
                type: String,
                default: ''
            },
            back: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: 'app-toolbar'
            },
            showBack: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                titleSelector: '#app-title',
                toolbarSelector: '#app-actions',
            };
        },
        created() {
            this.updatePageTitle();
        },
        beforeDestroy() {
            if (document.title === this.title) {
                this.updatePageTitle('');
            }
        },
        watch: {
            title(val) {
                this.updatePageTitle(val);
            }
        },
        methods: {
            updatePageTitle(title = this.title) {
                document.title = title;
            }
        }
    };
</script>