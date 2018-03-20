export default {
    id: null,
    isAdmin: false,
    permissions: [],
    hasPermission(permission) {
        if (this.isAdmin || !permission) {
            return true;
        }
        if (!Array.isArray(permission)) {
            permission = [permission];
        }
        else if (permission.length === 0) {
            return true;
        }
        if (this.permissions.length === 0) {
            return false;
        }
        return permission.every(p => this.permissions.indexOf(p) >= 0);
    }
};
