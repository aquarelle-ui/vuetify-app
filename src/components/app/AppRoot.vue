<template>
    <router-view v-if="ready"></router-view>
    <v-app v-else>
        <v-container fluid fill-height>
            <v-layout justify-center align-center>
                <v-flex>
                    <v-flex class="text-xs-center">{{status}}</v-flex>
                    <v-progress-linear indeterminate></v-progress-linear>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
    import User from "../../User";

    export default {
        name: 'app-root',
        data() {
            return {
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