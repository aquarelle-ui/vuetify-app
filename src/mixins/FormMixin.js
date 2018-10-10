export default {
    computed: {
        formOptions()
        {
            return {
                language: this.$intl.language,
                firstDayOfWeek: this.$intl.firstDayOfWeek || 0,
                rtl: this.$intl.rtl
            }
        }
    },
}