import {onRouteLeave} from "@aquarelle/utils";

export default {
    beforeRouteLeave(to, from, next) {
        if (this.$refs.page && this.$refs.page.showLogin === true) {
            next(false);
            return false;
        }
        if (onRouteLeave(this) === false) {
            next(false);
            return false;
        }

        if (onRouteLeave(this.$refs.form) === false) {
            next(false);
            return false;
        }

        next();
        return true;
    }
}