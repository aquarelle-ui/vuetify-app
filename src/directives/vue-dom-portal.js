// Credit: https://github.com/calebroseland/vue-dom-portal

/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget(node = document.body) {
    if (node === true) return document.body;
    return node instanceof window.Node ? node : document.querySelector(node);
}

const homes = new Map();

const directive = {
    inserted(el, {value}, vnode) {
        const {parentNode} = el;
        const home = document.createComment('');
        let hasMovedOut = false;

        if (value !== false) {
            parentNode.replaceChild(home, el); // moving out, el is no longer in the document
            getTarget(value).appendChild(el); // moving into new place
            hasMovedOut = true;
        }

        if (!homes.has(el)) {
            // remember where home is or should be
            homes.set(el, {parentNode, home, hasMovedOut});
        }
    },
    componentUpdated(el, {value}) { // need to make sure children are done updating (vs. `update`)
        const {parentNode, home, hasMovedOut} = homes.get(el); // recall where home is

        if (!hasMovedOut && value) {
            // remove from document and leave placeholder
            parentNode.replaceChild(home, el);
            // append to target
            getTarget(value).appendChild(el);
            homes.set(el, {...homes.get(el), hasMovedOut});
        } else if (hasMovedOut && value === false) {
            // previously moved, coming back home
            parentNode.replaceChild(el, home);
            homes.set(el, {...homes.get(el), hasMovedOut});
        } else if (value) {
            // already moved, going somewhere else
            getTarget(value).appendChild(el);
        }
    },
    unbind(el, binding) {
        const {parentNode, home, hasMovedOut} = homes.get(el); // recall where home is
        if (hasMovedOut) {
            // previously moved, coming back home
            parentNode.replaceChild(el, home);
        }
        homes.delete(el);
    }
};

function install(Vue) {
    Vue.directive('dom-portal', directive)
}

export {directive};
export default install;
