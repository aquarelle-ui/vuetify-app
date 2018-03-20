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
    export default {
        name: 'app-root',
        data() {
            return {
                status: null,
                ready: false
            }
        },
        created() {
            // TODO: ...
            this.status = "Initialising...";

            // this.status = "Loading user data...";

            // this.status = "Loading locale...";

            this.status = "Enjoy!";
            this.ready = true;

            return;
            setTimeout(() => {
                this.status = "Enjoy!";
                this.ready = true;
            }, 3000)

        }
    }
</script>
<style>
    html {
        overflow-y: auto;
    }
</style>