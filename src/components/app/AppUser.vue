<template>
    <v-list>
        <v-list-tile avatar>
            <v-list-tile-avatar>
                <image-icon :letters-count="1" :src="user.avatar || user.name"></image-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title class="text--primary">{{user.name}}</v-list-tile-title>
                <v-list-tile-sub-title>{{user.email}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-btn icon @click.prevent.stop="signOut">
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
            </v-list-tile-action>
        </v-list-tile>
        <v-divider></v-divider>
    </v-list>
</template>
<script>
    import ImageIcon from "../misc/ImageIcon";

    export default {
        name: 'app-user',
        components: {ImageIcon},
        props: {
            user: {
                type: Object,
                required: true
            }
        },
        methods: {
            signOut()
            {
                this.user.signOut().then(() => {
                   window.location.replace(window.location.toString().split('#')[0]);
                });
            }
        }
    };
</script>