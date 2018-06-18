<template>
    <router-view v-if="ready"></router-view>
    <v-app v-else>
        <v-container fluid fill-height>
            <v-layout justify-center align-center>
                <v-flex class="text-xs-center">
                    <img style="max-width: 80%" :src="logo">
                    <v-progress-linear indeterminate></v-progress-linear>
                    <v-flex >{{status}}</v-flex>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
    import User from "../../User";
    import Logo from "./logo.svg";

    export default {
        name: 'app-root',
        data() {
            return {
                logo: Logo,
                status: null,
                ready: false
            }
        },
        created() {
            this.status = "Initialising...";

            User.refresh()
                .then(ok => {
                    // this.status = "Loading locale...";
                    return true;
                })
                .then(() => {
                    this.status = 'Enjoy!';
                    this.ready = true;
                });
        }
    }
</script>
<style>
    html {
        overflow-y: auto;
    }
</style>