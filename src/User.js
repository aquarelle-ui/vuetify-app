import DataLoader from "./loader/DataLoader";

class Loader extends DataLoader
{
    constructor(url)
    {
        super(url, false);
    }

    whoAmI()
    {
        return this._fetch(this._url + '/whoami');
    }

    signOut(key = '')
    {
        return this._send(this._url + '/signout', {key}, 'post');
    }
}

export default {
    id: null,
    name: "Admin",
    email: "admin@example.com",
    avatar: null,
    // TODO: change this
    isAdmin: true,
    permissions: [],
    roles: [],
    signOutKey: '',
    loader: null,
    setLoaderUrl(url)
    {
        this.loader = new Loader(url)
    },
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
    },
    refresh()
    {
        return this.loader.whoAmI().then(data => {
            ['id', 'name', 'email', 'avatar', 'roles', 'permissions', 'isAdmin', 'signOutKey'].map(p => {
                this[p] = data[p];
            });
            return this;
        });
    },
    signOut()
    {
        return this.loader.signOut(this.signOutKey).then(() => {
            this.id = null;
            this.name = null;
            this.email = null;
            this.avatar = null;
            this.isAdmin = false;
            this.permissions = [];
            this.roles = [];
            this.signOutKey = '';
            return true;
        });
    }
};
