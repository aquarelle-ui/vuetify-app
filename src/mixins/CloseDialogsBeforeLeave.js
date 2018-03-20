export default {
    beforeRouteLeave(to, from, next) {
        const formName = this.formName || 'form';
        if (!this.$refs[formName] || !this.$refs[formName].$refs || !this.$refs[formName].$refs.dialogs) {
            next();
            return;
        }
        const dialogsWrapper = this.$refs.form.$refs.dialogs;
        const length = dialogsWrapper.dialogs.length;
        if (length > 0) {
            dialogsWrapper.onCancel(dialogsWrapper.dialogs[length - 1]);
            next(false);
        }
        else {
            next();
        }
    }
}