import User from "../User";

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

export function onRouteLeave(control, method = 'onRouteLeave')
{
    if (!control || typeof control !== 'object') {
        return true;
    }

    if (Array.isArray(control)) {
        for (let i = 0; i < control.length; i++) {
            if (onRouteLeave(control[i]) === false) {
                return false;
            }
        }
        return true;
    }

    if (typeof control[method] === 'function') {
        return control[method](onRouteLeave);
    }

    return true;
}
