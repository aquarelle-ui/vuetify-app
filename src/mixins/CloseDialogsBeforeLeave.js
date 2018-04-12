function closeFormDialogs(control)
{
    if (!control || typeof control !== 'object') {
        return true;
    }

    if (Array.isArray(control)) {
        for (let i = 0; i < control.length; i++) {
            if (closeFormDialogs(control) === false) {
                return false;
            }
        }
        return true;
    }

    if (!control.$refs) {
        return true;
    }

    const formName = control.formName || 'form';
    const blockForm = control.$refs[formName];

    if (!blockForm || !blockForm.$refs) {
        return true;
    }

    const dialogsWrapper = blockForm.$refs.dialogs;
    if (!dialogsWrapper || !dialogsWrapper.dialogs) {
        return true;
    }

    const length = dialogsWrapper.dialogs.length;
    if (length > 0) {
        dialogsWrapper.onCancel(dialogsWrapper.dialogs[length - 1]);
        return false;
    }

    return true;
}

function doOnRouteLeave(control)
{
    if (!control || typeof control !== 'object') {
        return true;
    }

    if (Array.isArray(control)) {
        for (let i = 0; i < control.length; i++) {
            if (doOnRouteLeave(control) === false) {
                return false;
            }
        }
        return true;
    }

    if (typeof control.onRouteLeave === 'function') {
        return control.onRouteLeave(doOnRouteLeave, closeFormDialogs);
    }

    return true;
}

export default {
    beforeRouteLeave(to, from, next) {
        if (doOnRouteLeave(this) === false) {
            next(false);
            return false;
        }

        if (closeFormDialogs(this) === false) {
            next(false);
            return false;
        }

        next();
        return true;
    }
}