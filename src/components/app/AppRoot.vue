<template>
    <router-view v-if="ready"></router-view>
    <v-app v-else>
        <v-container fluid fill-height>
            <v-layout justify-center align-center>
                <v-flex class="text-xs-center">
                    <img style="max-width: 80%" :src="logo">
                    <v-progress-linear indeterminate></v-progress-linear>
                    <v-flex>{{status}}</v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
    import Logo from "./logo.svg";

    export default {
        name: 'app-root',
        props: {
            user: {type: Object, required: true},
            options: {
                type: Object, default: () => ({
                    firstDayOfWeek: 0,
                    language: 'en'
                })
            }
        },
        data()
        {
            return {
                logo: Logo,
                status: null,
                ready: false
            }
        },
        created()
        {
            this.status = "Initialising...";

            this.user.refresh()
                .then(() => {
                    this.status = "Loading locale...";
                    const options = this.options;
                    this.$intl.firstDayOfWeek = options.firstDayOfWeek || 0;
                    this.$intl.language = options.language || 'en';
                })
                .then(() => {
                    this.status = 'Enjoy!';
                    this.$nextTick(() => {
                        this.ready = true;
                    });
                });
        }
    }
</script>
<style>
    html {
        overflow-y: auto;
    }

    .fab-wrapper {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .fab-wrapper > .v-speed-dial {
        margin-left: -72px;
    }
</style>