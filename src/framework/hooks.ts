import { render } from "./reconciler";

let stateHooks: any[] = [];
let effectHooks: { deps: any[]; cleanup?: () => void }[] = [];
let currentComponent: (() => any) | null = null;
let stateCursor = 0;
let effectCursor = 0;

export function resetHooks() {
    stateCursor = 0;
    effectCursor = 0;
}

export function setCurrentComponent(component: () => any) {
    currentComponent = component;
    resetHooks();
}

export function useState<T>(initialValue: T): [T, (newValue: T) => void] {
    const cursor = stateCursor;

    if (stateHooks[cursor] === undefined) {
        stateHooks[cursor] = initialValue;
    }

    const setState = (newValue: T) => {
        stateHooks[cursor] = newValue;
        resetHooks();
        render();
    };

    const state = stateHooks[cursor];
    stateCursor++;
    return [state, setState];
}

export function useEffect(callback: () => void | (() => void), deps: any[]) {
    const cursor = effectCursor;
    const hasNoDeps = !deps;
    const hasChangedDeps = !effectHooks[cursor] ||
        !deps.every((dep: any, i: number) => dep === effectHooks[cursor].deps[i]);

    if (hasNoDeps || hasChangedDeps) {
        // Cleanup previous effect
        if (effectHooks[cursor]?.cleanup) {
            effectHooks[cursor].cleanup();
        }

        // Run effect and store cleanup if returned
        const cleanup = callback();
        effectHooks[cursor] = {
            deps,
            cleanup: typeof cleanup === 'function' ? cleanup : undefined
        };
    }

    effectCursor++;
}