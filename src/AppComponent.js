import VueRouter from "vue-router";
import {AppExtensionRoute, AppRoot} from "./components";

const RouterRenderComponent = {
    render(h) {
        return h('router-view');
    }
};

export default {
    props: {
        loaders: {type: Object, required: true},
        user: {type: Object, required: true},
        router: {type: VueRouter, required: true},
        options: {type: Object, default: () => ({})},
        logo: {type: String, default: null}
    },
    data() {
        return {
            extensions: {},
            vendors: {},
            vendorRoutes: {}
        };
    },
    render(h) {
        return h(AppRoot, {
            props: {
                user: this.user,
                options: this.options,
                logo: this.logo
            }
        });
    },
    methods: {
        setOptions(options)
        {
            if (!options || typeof options !== 'object') {
                return;
            }
            for (const p in options) {
                if (options.hasOwnProperty(p)) {
                    this.setOption(p, options[p]);
                }
            }
        },
        setOption(name, value)
        {
            this.$set(this.options, name, value);
            return this;
        },
        deleteOption(name)
        {
            this.$delete(this.options, name);
            return this;
        },
        register(vendor, extensions = [], defaultExtension = null)
        {
            const routes = [];
            if (typeof vendor === 'string') {
                vendor = {name: vendor, title: vendor};
            }

            this.vendors[vendor.name] = vendor;

            const mapped = extensions.map(ext => {
                if (defaultExtension === null) {
                    defaultExtension = ext.name;
                }
                return this._mapExtension(routes, ext, vendor.name);
            });

            if (!this.extensions.hasOwnProperty(vendor.name)) {
                this.extensions[vendor.name] = [];
            }
            this.extensions[vendor.name] = this.extensions[vendor.name].concat(mapped);

            if (routes.length > 0) {
                this.vendorRoutes[vendor.name] = true;
                this.router.addRoutes([this._vendorRoute(vendor.name, defaultExtension, routes)]);
            }

            return this;
        },

        registerExtension(vendor, extension)
        {
            const routes = [];
            const ext = this._mapExtension(routes, extension, vendor);

            if (routes.length > 0 && this.vendorRoutes[vendor]) {
                this.router.addRoutes([this._vendorRoute(vendor, null, routes)]);
            }

            if (!this.extensions.hasOwnProperty(vendor)) {
                this.extensions[vendor] = [];
            }
            this.extensions[vendor].push(ext);

            return ext;
        },

        getAllVendors()
        {
            return this.vendors;
        },

        getVendor(name)
        {
            return this.vendors[name];
        },

        getAllExtensions()
        {
            return this.extensions;
        },

        getAllVendorExtensions(vendor)
        {
            if (!this.extensions.hasOwnProperty(vendor)) {
                return null;
            }
            return this.extensions[vendor];
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
        },

        _mapExtension(routes, ext, vendor)
        {
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
                routes.push(this._extensionRoute(ext.name, defaultRoute, ext.routes));
            }

            return {
                vendor: vendor,
                name: ext.name || null,
                title: ext.title || null,
                description: ext.description || null,
                icon: ext.icon || null,
                permissions: ext.permissions || [],
                menu: ext.menu || []
            };
        },

        _vendorRoute(vendor, defaultExtension, children = [], options = {})
        {
            children = [
                {
                    path: '',
                    redirect()
                    {
                        return {
                            path: defaultExtension,
                            params: {
                                vendor: vendor,
                                extension: defaultExtension
                            }
                        }
                    }
                }
            ].concat(children);
            return {
                path: '/:vendor(' + vendor + ')',
                alias: '/' + vendor,
                component: RouterRenderComponent,
                children,
                ...options
            };
        },

        _extensionPermissionHook(to, from, next)
        {
            const app = this.getVendorExtension(to.params.vendor, to.params.extension);

            if (app && !this.user.hasPermission(app.permissions)) {
                next(false);
            }
            else {
                next();
            }
        },

        _extensionRoute(extension, url, children = [], options = {})
        {
            children = [
                {
                    path: '',
                    redirect(route)
                    {
                        return {
                            path: url,
                            params: {
                                vendor: route.params.vendor,
                                extension: extension,
                            }
                        }
                    }
                }
            ].concat(children);
            return {
                path: ':extension(' + extension + ')',
                alias: extension,
                component: AppExtensionRoute,
                props: this._extensionProps,
                beforeEnter: this._extensionPermissionHook,
                children,
                ...options
            };
        },

        _extensionProps(route)
        {
            const info = {
                vendor: route.params.vendor || null,
                extension: route.params.extension || null,
                app: this,
                user: this.user
            };
            return {appInfo: info};
        },
    }
}