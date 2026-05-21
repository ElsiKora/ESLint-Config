import type { IRuleBehaviorCase } from "../types";
import { createCase, createCases } from "../case-factory";

const REACT_RULE_BEHAVIOR_FILE_PATH = "test/e2e/fixture/rule-behavior-matrix/react.fixture.tsx";
const REACT_RULE_BEHAVIOR_CODE = createReactRuleBehaviorCase();

const REACT_RULE_IDS: ReadonlyArray<string> = [
	"@elsikora/react/1/dom-no-dangerously-set-innerhtml",
	"@elsikora/react/1/dom-no-dangerously-set-innerhtml-with-children",
	"@elsikora/react/1/dom-no-find-dom-node",
	"@elsikora/react/1/dom-no-flush-sync",
	"@elsikora/react/1/dom-no-hydrate",
	"@elsikora/react/1/dom-no-missing-button-type",
	"@elsikora/react/1/dom-no-missing-iframe-sandbox",
	"@elsikora/react/1/dom-no-render",
	"@elsikora/react/1/dom-no-render-return-value",
	"@elsikora/react/1/dom-no-script-url",
	"@elsikora/react/1/dom-no-string-style-prop",
	"@elsikora/react/1/dom-no-unknown-property",
	"@elsikora/react/1/dom-no-unsafe-iframe-sandbox",
	"@elsikora/react/1/dom-no-unsafe-target-blank",
	"@elsikora/react/1/dom-no-use-form-state",
	"@elsikora/react/1/dom-no-void-elements-with-children",
	"@elsikora/react/1/error-boundaries",
	"@elsikora/react/1/exhaustive-deps",
	"@elsikora/react/1/jsx-no-children-prop",
	"@elsikora/react/1/jsx-no-children-prop-with-children",
	"@elsikora/react/1/jsx-no-comment-textnodes",
	"@elsikora/react/1/jsx-no-key-after-spread",
	"@elsikora/react/1/jsx-no-leaked-dollar",
	"@elsikora/react/1/jsx-no-leaked-semicolon",
	"@elsikora/react/1/jsx-no-namespace",
	"@elsikora/react/1/jsx-no-useless-fragment",
	"@elsikora/react/1/naming-convention-context-name",
	"@elsikora/react/1/naming-convention-id-name",
	"@elsikora/react/1/naming-convention-ref-name",
	"@elsikora/react/1/no-access-state-in-setstate",
	"@elsikora/react/1/no-array-index-key",
	"@elsikora/react/1/no-children-count",
	"@elsikora/react/1/no-children-for-each",
	"@elsikora/react/1/no-children-map",
	"@elsikora/react/1/no-children-only",
	"@elsikora/react/1/no-children-to-array",
	"@elsikora/react/1/no-class-component",
	"@elsikora/react/1/no-clone-element",
	"@elsikora/react/1/no-component-will-mount",
	"@elsikora/react/1/no-component-will-receive-props",
	"@elsikora/react/1/no-component-will-update",
	"@elsikora/react/1/no-context-provider",
	"@elsikora/react/1/no-create-ref",
	"@elsikora/react/1/no-forward-ref",
	"@elsikora/react/1/no-leaked-conditional-rendering",
	"@elsikora/react/1/no-missing-key",
	"@elsikora/react/1/no-misused-capture-owner-stack",
	"@elsikora/react/1/no-nested-component-definitions",
	"@elsikora/react/1/no-nested-lazy-component-declarations",
	"@elsikora/react/1/no-set-state-in-component-did-mount",
	"@elsikora/react/1/no-set-state-in-component-did-update",
	"@elsikora/react/1/no-set-state-in-component-will-update",
	"@elsikora/react/1/no-unnecessary-use-prefix",
	"@elsikora/react/1/no-unsafe-component-will-mount",
	"@elsikora/react/1/no-unsafe-component-will-receive-props",
	"@elsikora/react/1/no-unsafe-component-will-update",
	"@elsikora/react/1/no-unstable-context-value",
	"@elsikora/react/1/no-unstable-default-props",
	"@elsikora/react/1/no-unused-class-component-members",
	"@elsikora/react/1/no-unused-props",
	"@elsikora/react/1/no-use-context",
	"@elsikora/react/1/purity",
	"@elsikora/react/1/rsc-function-definition",
	"@elsikora/react/1/rules-of-hooks",
	"@elsikora/react/1/set-state-in-effect",
	"@elsikora/react/1/set-state-in-render",
	"@elsikora/react/1/static-components",
	"@elsikora/react/1/unsupported-syntax",
	"@elsikora/react/1/use-memo",
	"@elsikora/react/1/use-state",
	"@elsikora/react/1/web-api-no-leaked-event-listener",
	"@elsikora/react/1/web-api-no-leaked-fetch",
	"@elsikora/react/1/web-api-no-leaked-interval",
	"@elsikora/react/1/web-api-no-leaked-resize-observer",
	"@elsikora/react/1/web-api-no-leaked-timeout",
];

export const RULE_BEHAVIOR_REACT_CASES: Array<IRuleBehaviorCase> = [
	...createCases("react", { withReact: true }, REACT_RULE_BEHAVIOR_FILE_PATH, [...REACT_RULE_IDS], REACT_RULE_BEHAVIOR_CODE),
	createCase("react", "@elsikora/react/1/no-direct-mutation-state", { withReact: true }, REACT_RULE_BEHAVIOR_FILE_PATH, `import React from "react";\n\nexport class Mutator extends React.Component<{}, { count: number }> {\n\tstate = { count: 0 };\n\tcomponentDidMount() {\n\t\tthis.state = { count: 1 };\n\t}\n\trender() {\n\t\treturn <div>{this.state.count}</div>;\n\t}\n}\n`),
];

function createReactRuleBehaviorCase(): string {
	return `"use server";
import React, { Children, cloneElement, createContext, createRef, forwardRef, lazy, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { captureOwnerStack } from "react";
import ReactDOM, { useFormState } from "react-dom";

const Ctx = createContext({ value: 1 });
const BadContext = createContext({ value: 1 });

export function action() {
\treturn 1;
}

function useUtility() {
\treturn 1;
}

type Props = { optional?: number; unused: string; used: string };
export function PropsComponent(props: Props) {
\treturn <div>{props.used}</div>;
}

export function FunctionComponent({ count, items = [] }: { count: number; items: Array<string> }) {
\tconst [state, setState] = useState(0);
\tconst [name, setName] = useState("");
\tconst bad = useId();
\tconst thing = useRef(null);
\tconst made = createRef<HTMLDivElement>();
\tlet outer = 0;
\tuseMemo((param) => { outer = param; }, [state]);
\tuseMemo(() => { state.toString(); }, [state]);
\tuseFormState(() => state, state);
\tuseEffect(() => {
\t\tsetName(String(state));
\t\tfetch("/api/data");
\t\twindow.addEventListener("resize", () => {});
\t\tsetInterval(() => {}, 1000);
\t\tsetTimeout(() => {}, 1000);
\t\tnew ResizeObserver(() => {}).observe(document.body);
\t}, []);
\ttry {
\t\treturn <span>inside try</span>;
\t} catch {
\t\treturn null;
\t}
\tsetState(1);
\tfunction NestedComponent() { return <span />; }
\tconst LazyInside = lazy(() => import("./Lazy"));
\tconst props = { role: "button" };
\tMath.random();
\treturn (
\t\t<BadContext.Provider value={{ count }}>
\t\t\t<div>
\t\t\t\t{items.map((item, index) => <span key={index}>{item}</span>)}
\t\t\t\t{items.map((item) => <span>{item}</span>)}
\t\t\t\t{count && <span />}
\t\t\t\t{(() => <span />)()}
\t\t\t\t<button onClick={() => setState(state + 1)}>Save</button>
\t\t\t\t<iframe src="/frame" />
\t\t\t\t<iframe src="/frame" sandbox="allow-scripts allow-same-origin" />
\t\t\t\t<a href="javascript:alert(1)" target="_blank">bad</a>
\t\t\t\t<div style="color: red" class="bad" />
\t\t\t\t<div dangerouslySetInnerHTML={{ __html: "bad" }}>child</div>
\t\t\t\t<script>bad</script>
\t\t\t\t<img src="x">child</img>
\t\t\t\t<fbt:param name="x" />
\t\t\t\t<div>// this is not a jsx comment</div>
\t\t\t\t<span {...props} key="bad" />
\t\t\t\t<span>Total: \${state}</span>
\t\t\t\t<span>;
{state}</span>
\t\t\t\t<div children={<span />}>child</div>
\t\t\t\t<React.Fragment><span /></React.Fragment>
\t\t\t\t{Children.count(items)}
\t\t\t\t{Children.forEach(items, () => null)}
\t\t\t\t{Children.map(items, () => null)}
\t\t\t\t{Children.only(items)}
\t\t\t\t{Children.toArray(items)}
\t\t\t\t{cloneElement(<span />)}
\t\t\t\t<NestedComponent />
\t\t\t\t<LazyInside />
\t\t\t</div>
\t\t</BadContext.Provider>
\t);
}

FunctionComponent.defaultProps = { items: [] };

export class ClassComponent extends React.Component<{ value: string }, { count: number }> {
\tstate = { count: 0 };
\tunused = 1;
\tcomponentWillMount() { this.setState({ count: 1 }); }
\tUNSAFE_componentWillMount() {}
\tcomponentWillReceiveProps() { this.setState({ count: 2 }); }
\tUNSAFE_componentWillReceiveProps() {}
\tcomponentWillUpdate() { this.setState({ count: 3 }); }
\tUNSAFE_componentWillUpdate() {}
\tcomponentDidMount() { this.setState({ count: 4 }); this.state.count = 1; }
\tcomponentDidUpdate() { this.setState({ count: 5 }); }
\tupdate() { this.setState({ count: this.state.count + 1 }); }
\trender() { return <div>{this.props.value}</div>; }
}

export const RefForward = forwardRef<HTMLDivElement, { label: string }>((props, ref) => <div ref={ref}>{props.label}</div>);

export function HookMistake({ flag }: { flag: boolean }) {
\tif (flag) {
\t\tuseState(0);
\t}
\tconst ctx = useContext(Ctx);
\tcaptureOwnerStack();
\treturn <div>{ctx.value}</div>;
}

export function RenderSetter() {
\tconst [count, setCount] = useState(0);
\tsetCount(count + 1);
\treturn <div>{count}</div>;
}

ReactDOM.findDOMNode(document.body);
ReactDOM.flushSync(() => {});
ReactDOM.hydrate(<div />, document.getElementById("root"));
ReactDOM.render(<div />, document.getElementById("root"));
const rendered = ReactDOM.render(<div />, document.getElementById("root"));
console.log(bad, thing, made, name, outer, rendered, useUtility);
`;
}
