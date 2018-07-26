export default {
    methods: {
        doLogin(callback) {
            if (this.$refs.page) {
                this.$refs.page.doLogin(callback);
            }
        }
    }
}