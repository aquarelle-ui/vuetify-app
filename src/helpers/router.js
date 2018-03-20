import {EntityInstanceRoute, EntityTypeRoute, ExtensionRoute} from "../components/router";

import App from "../App";
import User from "../User";

function extensionProps(route) {
    const info = {
        vendor: route.params.vendor || null,
        extension: route.params.extension || null,
        app: App,
        user: User
    };
    return {appInfo: info};
}

export function extensionPermissionHook(to, from, next) {
    const app = App.getVendorExtension(to.params.vendor, to.params.extension);

    if (app && !User.hasPermission(app.permissions)) {
        next(false);
    }
    else {
        next();
    }
}

export function permissionHook(to, from, next) {
    if (to.meta && to.meta.permissions && !User.hasPermission(to.meta.permissions)) {
        next(false);
    }
    else {
        next();
    }
}

export function permissionRoute(route, permissions = []) {
    if (!route.meta) {
        route.meta = {};
    }
    if (!route.component) {
        route.component = {template: '<router-view></router-view>'};
    }
    route.beforeEnter = permissionHook;
    route.meta.permissions = permissions;
    return route;
}

export function entityTypeRoute(name, children = [], permissions = [], options = {}) {
    return permissionRoute({
        path: name,
        component: EntityTypeRoute,
        props() {
            return {
                entityName: name
            }
        },
        children,
        ...options
    }, permissions);
}

export function entityInstanceRoute(entityName, children = [], permissions = [], param = 'entityId', infoName = 'entityInfo', options = {}) {
    return permissionRoute({
        path: ':' + param + '([a-zA-Z0-9]{3,32})',
        component: EntityInstanceRoute,
        props(route) {
            return {
                infoName,
                entityName: entityName,
                entityId: route.params[param],
            }
        },
        children,
        ...options
    }, permissions);
}

export function extensionRoute(extension, url, children = [], options = {}) {
    children = [{
        path: '',
        redirect(route) {
            return {
                path: url,
                params: {
                    vendor: route.params.vendor,
                    extension: extension,
                }
            }
        }
    }].concat(children);
    return {
        path: ':extension(' + extension + ')',
        alias: extension,
        component: ExtensionRoute,
        props: extensionProps,
        beforeEnter: extensionPermissionHook,
        children,
        ...options
    };
}

export function vendorRoute(vendor, defaultExtension, children = [], options = {}) {
    children = [{
        path: '',
        redirect() {
            return {
                path: defaultExtension,
                params: {
                    vendor: vendor,
                    extension: defaultExtension
                }
            }
        }
    }].concat(children);
    return {
        path: '/:vendor(' + vendor + ')',
        alias: '/' + vendor,
        component: {
            template: '<router-view></router-view>'
        },
        children,
        ...options
    };
}


