import { createElement } from "./renderer";

let root: HTMLElement | null = null;

export function render(vdom?: any, container?: HTMLElement) {
    if (!container) return;
    root = container;
    container.innerHTML = ""; // Clear existing DOM

    function createDOMNode(vnode: any): Node {
        if (typeof vnode === "string") {
            return document.createTextNode(vnode);
        }

        // If vnode.type is a function, execute it to get the virtual DOM
        if (typeof vnode.type === "function") {
            return createDOMNode(vnode.type(vnode.props || {}));
        }

        const node = document.createElement(vnode.type);
        const props = vnode.props || {}; // Ensure props is always an object

        // Apply attributes (excluding children)
        Object.entries(props).forEach(([key, value]) => {
            if (key !== "children") {
                node.setAttribute(key, value);
            }
        });

        // Ensure children exist before iterating
        (props.children || []).forEach((child: any) => {
            node.appendChild(createDOMNode(child));
        });

        return node;
    }


    const newNode = createDOMNode(vdom);
    container.appendChild(newNode);
}
