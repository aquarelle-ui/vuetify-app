export default {
    data() {
        let page = this.$route.query.page;
        page = page ? parseInt(page) : 1;
        let filters = {...this.$route.query};
        delete filters.page;
        return {page, queryFilters: filters};
    },
    watch: {
        page(val) {
            let qs = null;
            if (this.queryFilters) {
                qs = {...this.queryFilters};
            }
            else {
                qs = {};
            }

            if (val > 1) {
                qs.page = val;
            }

            this.$router.push({query: qs});
        },
        queryFilters(val) {
            let qs = null;
            if (val) {
                qs = {...val};
            }
            else {
                qs = {};
            }

            if (this.page > 1) {
                qs.page = this.page;
            }

            this.$router.push({query: qs});
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