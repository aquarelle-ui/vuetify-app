export default {
    data() {
        return {
            listLoaded: false,
            totalItems: 0,
            lastPage: 0
        }
    },
    methods: {
        onListDataLoaded(data) {
            this.totalItems = data.total;
            this.lastPage = data.rows > 0 ? Math.ceil(data.total / data.rows) : 0;
        },
        onListLoaded() {
            this.listLoaded = true
        },
        onListRefresh() {
            this.listLoaded = false;
        }
    }
};