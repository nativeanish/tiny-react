import { render } from "./reconciler";

let stateHooks: any[] = [];
let effectHooks: any[] = [];
let stateCursor = 0;


export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    const cursor = stateCursor; // Capture cursor at call time

    if (stateHooks[cursor] === undefined) {
        stateHooks[cursor] = initialValue;
    }

    function setState(newValue: T) {
        stateHooks[cursor] = newValue;
        stateCursor = 0; // Reset cursor before re-rendering
        render(); // Re-render after state update
    }

    stateCursor++; // Move to the next state slot
    return [stateHooks[cursor], setState];
}


export function useEffect(callback: () => void, deps: any[]) {
    const cursor = effectHooks.length;
    const prevDeps = effectHooks[cursor];

    const hasChanged = !prevDeps || deps.some((dep, i) => dep !== prevDeps[i]);

    if (hasChanged) {
        callback();
        effectHooks[cursor] = deps;
    }
}
