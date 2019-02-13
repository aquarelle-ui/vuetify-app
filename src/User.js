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
        return this._send(this._url + '/signout', {key}, 'POST');
    }

    signIn(email, password, csrf = undefined)
    {
        return this._send(this._url + '/signin', {email, password, csrf}, 'POST');
    }
}

function mapUser(user, data)
{
    ['id', 'name', 'email', 'avatar', 'roles', 'permissions', 'isOwner', 'signOutKey'].map(p => {
        user[p] = data[p];
    });
    return user;
}

export default {
    id: null,
    name: "Admin",
    email: "admin@example.com",
    avatar: null,
    isOwner: true,
    permissions: [],
    roles: [],
    signOutKey: '',
    loader: new Loader('/api/aquarelle/users/users'),
    setLoaderUrl(url)
    {
        this.loader = new Loader(url)
    },
    hasPermission(permission)
    {
        if (permission === false) {
            return this.isOwner;
        }
        if (this.isOwner || !permission) {
            return true;
        }
        if (!Array.isArray(permission)) {
            permission = [permission];
        }
        else {
            if (permission.length === 0) {
                return true;
            }
        }
        if (this.permissions.length === 0) {
            return false;
        }
        return permission.every(p => this.permissions.indexOf(p) >= 0);
    },
    refresh()
    {
        return this.loader.whoAmI().then(data => mapUser(this, data));
    },
    signOut()
    {
        return this.loader.signOut(this.signOutKey).then(() => {
            this.id = null;
            this.name = null;
            this.email = null;
            this.avatar = null;
            this.isOwner = false;
            this.permissions = [];
            this.roles = [];
            this.signOutKey = '';
            return true;
        });
    },
    signIn(email, pass, csrf = undefined)
    {
        return this.loader.signIn(email, pass, csrf).then(data => mapUser(this, data));
    }
};
