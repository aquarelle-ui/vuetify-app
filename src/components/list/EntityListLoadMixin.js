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
            this.lastPage = data.lastPage;
        },
        onListLoaded() {
            this.listLoaded = true
        },
        onListRefresh() {
            this.listLoaded = false;
        }
    }
};