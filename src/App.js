import Router from "./Router";
import Loaders from "./Loaders";
import {vendorRoute, extensionRoute} from "./helpers";

const App = {
    _extensions: {},
    _vendors: {},

    get router()
    {
        return Router;
    },

    get loaders()
    {
        return Loaders;
    },

    register(vendor, extensions = [], defaultExtension = null)
    {
        const routes = [];
        if (typeof vendor === 'string') {
            vendor = {name: vendor, title: vendor};
        }

        this._vendors[vendor.name] = vendor;
        this._extensions[vendor.name] = extensions.map(ext => {
            if (defaultExtension === null) {
                defaultExtension = ext.name;
            }

            if (ext.routes && Array.isArray(ext.routes)) {
                let defaultRoute = ext.defaultRoute || null;
                if (defaultRoute === null) {
                    ext.routes.some(route => {
                        if (typeof route.path === 'string') {
                            defaultRoute = route.path;
                            return true;
                        }
                        return false;
                    });
                }
                routes.push(extensionRoute(ext.name, defaultRoute, ext.routes));
            }

            return {
                vendor: vendor.name,
                name: ext.name || null,
                title: ext.title || null,
                description: ext.description || null,
                icon: ext.icon || null,
                permissions: ext.permissions || [],
                menu: ext.menu || []
            };
        });
        if (routes.length > 0) {
            this.router.addRoutes([
                vendorRoute(vendor.name, defaultExtension, routes)
            ]);
        }
    },

    getAllVendors()
    {
        return this._vendors;
    },

    getVendor(name)
    {
        return this._vendors[name];
    },

    getAllExtensions()
    {
        return this._extensions;
    },

    getAllVendorExtensions(vendor)
    {
        if (!this._extensions.hasOwnProperty(vendor)) {
            return null;
        }
        return this._extensions[vendor];
    },

    getVendorExtension(vendor, name)
    {
        const extensions = this.getAllVendorExtensions(vendor);
        if (!extensions) {
            return null;
        }
        for (let i = 0; i < extensions.length; i++) {
            if (name === extensions[i].name) {
                return extensions[i];
            }
        }
        return null;
    }
};

export default App;

