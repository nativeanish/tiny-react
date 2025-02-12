/** @jsx createElement */
import { createElement, render } from "./framework";
import { App } from "./App";

const root = document.getElementById("root")!;
render(<App />, root);
