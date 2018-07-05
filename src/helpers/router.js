import {ExtensionRoute} from "../components/router";
import {EntityCreateForm, EntityEditForm, EntityListForm} from "../components/form";

import App from "../App";
import User from "../User";

function extensionProps(route)
{
    const info = {
        vendor: route.params.vendor || null,
        extension: route.params.extension || null,
        app: App,
        user: User
    };
    return {appInfo: info};
}

export function extensionPermissionHook(to, from, next)
{
    const app = App.getVendorExtension(to.params.vendor, to.params.extension);

    if (app && !User.hasPermission(app.permissions)) {
        next(false);
    }
    else {
        next();
    }
}

export function permissionHook(to, from, next)
{
    if (to.meta && to.meta.permissions && !User.hasPermission(to.meta.permissions)) {
        next(false);
    }
    else {
        next();
    }
}

export function permissionRoute(route, permissions = [])
{
    if (!route.meta) {
        route.meta = {};
    }
    if (!route.component) {
        route.component = {
            template: '<router-view></router-view>'
        };
    }
    route.beforeEnter = permissionHook;
    route.meta.permissions = permissions;
    return route;
}

export function extensionRoute(extension, url, children = [], options = {})
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
        component: ExtensionRoute,
        props: extensionProps,
        beforeEnter: extensionPermissionHook,
        children,
        ...options
    };
}

export function vendorRoute(vendor, defaultExtension, children = [], options = {})
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
        component: {
            template: '<router-view></router-view>'
        },
        children,
        ...options
    };
}

export function entityCreateRoute(name, props, permissions = [], options = {})
{
    return permissionRoute({
        path: name,
        component: EntityCreateForm,
        props()
        {
            return props;
        },
        ...options
    }, permissions);
}

export function entityEditRoute(name, props, permissions = [], idParam = 'entityInstanceId', options = {})
{
    return permissionRoute({
        path: ':' + idParam + '([a-zA-Z0-9-:]{3,32})' + '/' + name,
        component: EntityEditForm,
        props(route)
        {
            return {...props, id: route.params[idParam]};
        },
        ...options
    }, permissions);
}

export function entityListRoute(name, props, permissions = [], options = {})
{
    return permissionRoute({
        path: name,
        component: EntityListForm,
        props()
        {
            return props;
        },
        ...options
    }, permissions);
}