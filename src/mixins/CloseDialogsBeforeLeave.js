import {onRouteLeave} from "@aquarelle/utils";

export default {
    beforeRouteLeave(to, from, next) {
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