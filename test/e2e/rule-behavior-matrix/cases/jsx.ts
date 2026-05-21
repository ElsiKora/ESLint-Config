import type { IRuleBehaviorCase } from "../types";
import { createCase, createCases } from "../case-factory";

const JSX_ACCESSIBILITY_FILE_PATH = "src/accessibility-problems.jsx";
const JSX_ACCESSIBILITY_CODE = createJsxAccessibilityRuleBehaviorCase();

const JSX_ACCESSIBILITY_REPORTED_RULE_IDS: ReadonlyArray<string> = [
	"@elsikora/jsx/alt-text",
	"@elsikora/jsx/anchor-has-content",
	"@elsikora/jsx/anchor-is-valid",
	"@elsikora/jsx/aria-activedescendant-has-tabindex",
	"@elsikora/jsx/aria-props",
	"@elsikora/jsx/aria-proptypes",
	"@elsikora/jsx/aria-role",
	"@elsikora/jsx/aria-unsupported-elements",
	"@elsikora/jsx/autocomplete-valid",
	"@elsikora/jsx/click-events-have-key-events",
	"@elsikora/jsx/heading-has-content",
	"@elsikora/jsx/html-has-lang",
	"@elsikora/jsx/iframe-has-title",
	"@elsikora/jsx/img-redundant-alt",
	"@elsikora/jsx/interactive-supports-focus",
	"@elsikora/jsx/label-has-associated-control",
	"@elsikora/jsx/media-has-caption",
	"@elsikora/jsx/mouse-events-have-key-events",
	"@elsikora/jsx/no-access-key",
	"@elsikora/jsx/no-distracting-elements",
	"@elsikora/jsx/no-interactive-element-to-noninteractive-role",
	"@elsikora/jsx/no-noninteractive-element-interactions",
	"@elsikora/jsx/no-noninteractive-element-to-interactive-role",
	"@elsikora/jsx/no-noninteractive-tabindex",
	"@elsikora/jsx/no-redundant-roles",
	"@elsikora/jsx/no-static-element-interactions",
	"@elsikora/jsx/role-has-required-aria-props",
	"@elsikora/jsx/role-supports-aria-props",
	"@elsikora/jsx/scope",
	"@elsikora/jsx/tabindex-no-positive",
];

export const RULE_BEHAVIOR_JSX_CASES: Array<IRuleBehaviorCase> = [...createCases("jsx", { withJsx: true }, JSX_ACCESSIBILITY_FILE_PATH, [...JSX_ACCESSIBILITY_REPORTED_RULE_IDS], JSX_ACCESSIBILITY_CODE), createCase("jsx", "@elsikora/jsx/no-autofocus", { withJsx: true }, JSX_ACCESSIBILITY_FILE_PATH, JSX_ACCESSIBILITY_CODE, "not-reported")];

function createJsxAccessibilityRuleBehaviorCase(): string {
	return `export function AccessibilityProblems() {
\treturn (
\t\t<html>
\t\t\t<body>
\t\t\t\t<img src="logo.png" />
\t\t\t\t<img src="cat.png" alt="image of a cat" />
\t\t\t\t<a />
\t\t\t\t<a onClick={() => {}}>Click</a>
\t\t\t\t<div aria-activedescendant="item-1" />
\t\t\t\t<div aria-bogus="true" />
\t\t\t\t<div aria-hidden="maybe" />
\t\t\t\t<div role="datepicker" />
\t\t\t\t<meta aria-hidden="true" />
\t\t\t\t<input autoComplete="not-a-token" />
\t\t\t\t<div onClick={() => {}}>Clickable</div>
\t\t\t\t<h1 />
\t\t\t\t<iframe src="/frame" />
\t\t\t\t<div role="button" onClick={() => {}}>Role button</div>
\t\t\t\t<label>Name</label>
\t\t\t\t<video src="movie.mp4" />
\t\t\t\t<div onMouseOver={() => {}}>Hover</div>
\t\t\t\t<div accessKey="s" />
\t\t\t\t<input autoFocus />
\t\t\t\t<marquee>Sale</marquee>
\t\t\t\t<button role="presentation">Button</button>
\t\t\t\t<li onClick={() => {}}>List item</li>
\t\t\t\t<h2 role="button">Heading button</h2>
\t\t\t\t<article tabIndex={0}>Article</article>
\t\t\t\t<button role="button">Submit</button>
\t\t\t\t<div role="checkbox">Check me</div>
\t\t\t\t<img alt="decorative" aria-checked="true" />
\t\t\t\t<td scope="row">Cell</td>
\t\t\t\t<div tabIndex={1}>Positive</div>
\t\t\t</body>
\t\t</html>
\t);
}
`;
}
