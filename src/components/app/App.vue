<template>
    <v-app :dark="dark">
        <slot></slot>
    </v-app>
</template>
<script>
    export default {
        watch: {
            dark(val) {
                this.saveDark(val);
                this.changeTheme(this.theme);
            }
        },
        created() {
            this.$app.options.dark = this.readDark();
            this.changeTheme(this.theme);
        },
        methods: {
            changeTheme(theme) {
                Object.keys(theme).forEach(k => {
                    this.$vuetify.theme[k] = theme[k];
                });
            },
            readDark() {
                return window.localStorage.getItem('ui.dark') === '1';
            },
            saveDark(value) {
                return window.localStorage.setItem('ui.dark', value ? '1' : '0');
            }
        },
        computed: {
            dark() {
                return this.$app.options.dark || false;
            },
            theme() {
                return this.dark
                    ? {
                        primary: '#ff862a',
                        secondary: '#607d8b',
                        accent: '#ffaa76',
                        error: '#ff505a',
                        warning: '#FFC107',
                        info: '#009688',
                        success: '#4caf50',
                    }
                    : {
                        primary: '#1976D2',
                        secondary: '#424242',
                        accent: '#82B1FF',
                        error: '#FF5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FFC107',
                    };
            }
        },
    }
</script>