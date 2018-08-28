export default {
    computed: {
        formTranslate()
        {
            return (a, b, c, d) => this.$intl.translate(a, b, c, d);
        },
        formOptions()
        {
            return {
                language: this.$intl.language,
                firstDayOfWeek: this.$intl.firstDayOfWeek || 0,
            }
        }
    },
}