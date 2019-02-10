<template>
    <v-app :dark="dark">
        <slot></slot>
    </v-app>
</template>
<script>
    export default {
        created() {
            Object.keys(this.theme).forEach(k => {
                this.$vuetify.theme[k] = this.theme[k];
            });
        },
        computed: {
            dark() {
                return true;
            },
            theme() {
                return this.dark
                    ? {
                        primary: '#2196f3',
                        secondary: '#3f51b5',
                        accent: '#673ab7',
                        error: '#f44336',
                        warning: '#ffc107',
                        info: '#00bcd4',
                        success: '#4caf50',
                    }
                    : {
                        primary: '#673ab7',
                        secondary: '#3f51b5',
                        accent: '#9c27b0',
                        error: '#f44336',
                        warning: '#ffc107',
                        info: '#00bcd4',
                        success: '#4caf50',
                    };
            }
        },
    }
</script>