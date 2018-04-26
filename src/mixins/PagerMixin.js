export default {
    data() {
        let page = this.$route.query.page;
        page = page ? parseInt(page) : 1;
        return {page};
    },
    watch: {
        page(val) {
            const qs = {};
            if (val > 1) {
                qs.page = val;
            }

            this.$router.push({
                query: qs
            })
        }
    },
    methods: {
        onItemDeleted(data) {
            if (data.list.length === 0 && this.page > 1) {
                this.page--;
            }
        }
    }
};