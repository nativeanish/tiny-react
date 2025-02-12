import { createElement } from "./renderer";
import { setCurrentComponent } from "./hooks";

let root: HTMLElement | null = null;
let currentVdom: any = null;

export function render(vdom?: any, container?: HTMLElement) {
    if (vdom) currentVdom = vdom;
    if (container) root = container;

    if (!root || !currentVdom) return;

    root.innerHTML = ""; // Clear existing DOM

    function createDOMNode(vnode: any): Node {
        // Handle primitive types (string, number)
        if (typeof vnode === "string" || typeof vnode === "number") {
            return document.createTextNode(String(vnode));
        }

        // Handle null or undefined
        if (vnode == null) {
            return document.createTextNode("");
        }

        // If vnode.type is a function, execute it to get the virtual DOM
        if (typeof vnode.type === "function") {
            setCurrentComponent(vnode.type);
            return createDOMNode(vnode.type(vnode.props || {}));
        }

        const node = document.createElement(vnode.type);
        const props = vnode.props || {};

        // Apply attributes and event listeners (excluding children)
        Object.entries(props).forEach(([key, value]) => {
            if (key === "children") return;

            // Handle event listeners
            if (key.startsWith("on") && typeof value === "function") {
                const eventName = key.toLowerCase().substring(2);
                node.addEventListener(eventName, value);
            } else {
                // Handle regular attributes
                node.setAttribute(key, String(value));
            }
        });

        // Ensure children exist before iterating
        (props.children || []).forEach((child: any) => {
            node.appendChild(createDOMNode(child));
        });

        return node;
    }

    const newNode = createDOMNode(currentVdom);
    root.appendChild(newNode);
}