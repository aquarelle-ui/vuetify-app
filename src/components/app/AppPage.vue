<template>
    <v-content>
        <app-toolbar :title="title" :back="back" :show-back="showBack">
            <slot name="toolbar"></slot>
        </app-toolbar>
        <v-layout v-if="loading" fill-height justify-center align-center>
            <v-progress-circular indeterminate color="secondary"></v-progress-circular>
        </v-layout>
        <slot v-else></slot>
        <app-notifier ref="notifier"></app-notifier>
        <v-dialog lazy v-model="showLogin" persistent max-width="320">
            <v-card>
                <v-card-title class="headline">You are not signed in</v-card-title>
                <v-card-text>
                    <v-text-field :disabled="processingLogin" v-model="email" :rules="emailRules" label="E-mail" type="email"
                                  prepend-icon="email"></v-text-field>
                    <v-text-field :disabled="processingLogin" v-model="pass" :rules="passRules" label="Password" type="password"
                                  prepend-icon="lock"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <span class="red--text" v-show="loginError">
                        <v-icon color="red">error</v-icon>Sign in failed
                    </span>
                    <v-spacer></v-spacer>
                    <v-btn flat
                           :disabled="processingLogin || !canLogin"
                           :loading="processingLogin"
                           @click.stop="tryLogin(email, pass)">
                        Sign in <v-icon>navigate_next</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-content>
</template>
<script>
    import AppToolbar from "./AppToolbar";
    import AppNotifier from "./AppNotifier";

    export default {
        name: 'app-page',
        components: {AppToolbar, AppNotifier},
        props: {
            title: {
                type: String,
                default: ''
            },
            back: {
                type: String,
                default: ''
            },
            loading: {
                type: Boolean,
                default: false
            },
            showBack: {
                type: Boolean,
                default: false
            }
        },
        data()
        {
            return {
                showLogin: false,
                processingLogin: false,
                loginCallback: null,
                loginError: false,

                email: '',
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,32})+$/.test(v) || 'E-mail must be valid'
                ],

                pass: '',
                passRules: [
                    v => !!v || 'Password is required',
                    v => v.length >= 6 || 'Minimum 6 chars',
                ]
            }
        },
        computed: {
            notifier()
            {
                return this.$refs.notifier;
            },
            canLogin()
            {
                return this.emailRules.every(rule => rule(this.email) === true) && this.passRules.every(
                    rule => rule(this.pass) === true);
            }
        },
        methods: {
            notify(type, message, timeout = 3000)
            {
                this.notifier.show(type, message, timeout);
            },
            doLogin(callback)
            {
                this.processingLogin = false;
                this.loginCallback = callback || null;
                this.email = this.$user.email || '';
                this.pass = '';
                this.showLogin = true;
            },
            tryLogin(email, pass)
            {
                if (!this.canLogin) {
                    return;
                }
                this.processingLogin = true;
                this.loginError = false;

                this.$user.signIn(email, pass)
                    .then(() => {
                        this.processingLogin = false;
                        this.showLogin = false;
                        const cb = this.loginCallback;
                        this.loginCallback = null;
                        if (typeof cb === 'function') {
                            this.$nextTick(cb);
                        }
                    })
                    .catch(error => {
                        this.processingLogin = false;
                        this.loginError = true;
                    })

            }
        }
    };
</script>