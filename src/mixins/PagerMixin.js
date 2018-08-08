export default {
    props: {
        filterArgs: {
            type: Object,
            default: null
        },
    },
    data() {
        let page = this.$route.query.page;
        page = page ? parseInt(page) : 1;
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        let filters = {...this.$route.query};
        delete filters.page;
        return {
            page,
            queryFilters: filters
        };
    },
    watch: {
        page(val) {
            const qp = this.$route.query.page || 1;
            if (val <= 1) {
                if (qp <= 1) {
                    return;
                }
            } else {
                if (qp == val) {
                    return;
                }
            }

            this.changeRouterQuery(this.queryFilters, val);
        },
        queryFilters(val) {
            this.changeRouterQuery(val, this.page);
        }
    },
    computed: {
        listPage() {
            if (!this.$route.query) {
                return 1;
            }
            let page = this.$route.query.page || null;
            if (page == null) {
                return 1;
            }
            page = parseInt(page);
            if (isNaN(page) || page < 1) {
                return 1;
            }
            return page;
        },
        filters()
        {
            let qs = {};
            if (this.$route && this.$route.query) {
                Object.assign(qs, this.$clone(this.$route.query));
            }
            delete qs.page;
            qs = this.clearFilters(qs);

            if (this.filterArgs) {
                if (qs == null) {
                    qs = {};
                }
                Object.assign(qs, this.filterArgs);
            }
            return qs;
        },
    },
    methods: {
        changeRouterQuery(queryFilters = null, page = 1)
        {
            let qs = null;
            if (queryFilters) {
                qs = {...queryFilters};
            }
            if (page && page > 1) {
                if (qs == null) {
                    qs = {page}
                } else {
                    qs.page = page;
                }
            }

            this.$router.push({query: qs});
        },
        clearFilters(obj) {
            if (obj == null || typeof obj !== 'object') {
                return obj;
            }
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return null;
            }
            keys.map(key => {
                if (obj[key] == null || obj[key] === '') {
                    delete obj[key];
                    return;
                }

                const type = typeof obj[key];

                if (type === 'string') {
                    obj[key] = obj[key].trim();
                    if (obj[key] === '') {
                        delete obj[key];
                    }
                    return;
                }
                if (type === 'number') {
                    if (isNaN(obj[key]) || !isFinite(obj[key])) {
                        delete obj[key];
                    }
                    return;
                }

                if (Array.isArray(obj[key])) {
                    obj[key] = obj[key].map(this.clearFilters(obj[key])).filter(Boolean);
                    if (obj[key].length === 0) {
                        delete obj[key];
                    }
                    return;
                }

                if (type !== 'object') {
                    delete obj[key];
                    return;
                }

                obj[key] = this.clearFilters(obj[key]);
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            });

            if (Object.keys(obj).length === 0) {
                return null;
            }

            return obj;
        },
        onItemDeleted(data) {
            if (data.list.length === 0 && this.page > 1) {
                this.page--;
            }
        }
    }
};