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
                <v-menu>
                    <v-btn icon slot="activator">
                        <v-icon>arrow_drop_down</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>My account</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action></v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                        <v-list-tile @click.prevent.stop="signOut">
                            <v-list-tile-avatar>
                                <v-icon>exit_to_app</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>Sign out</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action></v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-menu>

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