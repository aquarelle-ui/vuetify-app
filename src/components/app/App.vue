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