import type { IRuleBehaviorCase } from "../types";
import { createCase, createCases } from "../case-factory";

export const RULE_BEHAVIOR_SONAR_CASES: Array<IRuleBehaviorCase> = [
	createCase("sonar", "sonarjs/bool-param-default", { withSonar: true, withTypescript: true }, "test/e2e/fixture/sonar/invalid/bool-param-default.fixture.ts"),
	createCase("sonar", "sonarjs/cognitive-complexity", { withSonar: true }, "test/e2e/fixture/sonar/invalid/cognitive-complexity.fixture.js", createCognitiveComplexityCase()),
	createCase("sonar", "sonarjs/no-duplicate-string", { withSonar: true }, "test/e2e/fixture/sonar/invalid/no-duplicate-string.fixture.js", createDuplicateStringCase()),
	createCase("sonar", "sonarjs/todo-tag", { withSonar: true }, "test/e2e/fixture/sonar/invalid/todo-tag.fixture.js", `// TODO: finish this\nconst value = 1;\n`),
	...createSonarBehaviorCases(),
];

function createSonarBehaviorCases(): Array<IRuleBehaviorCase> {
	const branchesCode: string = `function classify(value) {
	if (value > 10) {
		return "same";
	} else if (value > 5) {
		return "same";
	} else {
		return "same";
	}
}

function compare(left, right) {
	if (left === left || right === right) {
		return true;
	}

	return false;
}

function choose(value) {
	switch (value) {
		case 1:
			return "one";
		default:
			return "other";
	}
}

console.log(classify(1), compare(1, 2), choose(1));
`;
	const regexCode: string = `const duplicate = /[aa]/;
const empty = /(?:)/;
const spaces = /foo   bar/;
const single = /[x]/;
const alternative = /a|b|c/;
const reluctant = /a*?/;
console.log(duplicate, empty, spaces, single, alternative, reluctant);
`;
	const testsCode: string = `describe.only("suite", () => {
	it.skip("skips", () => {
		expect(true);
	});

	it("has done", (done) => {
		done();
		done();
	});
});
`;
	const conditionsCode: string = `function check(value, other) {
	if (value > 0) {
		return "positive";
	} else if (value > 0) {
		return "also positive";
	} else if (other > 0) {
		return "other";
	}

	const same = value + other === value + other;
	const redundant = same === true;
	const nested = value ? (other ? "both" : "value") : "none";

	return redundant ? nested : "different";
}

console.log(check(1, 2));
`;
	const statementsCode: string = `let leaked = 0;
function update(value) {
	if ((leaked = value)) {
		console.log(leaked);
	}

	return;
}

outer: for (let index = 0; index < 1; index++) {
	break outer;
}
update(1);
`;
	const constructsCode: string = `function Worker() {
	this.value = 1;
}
new Worker();
function* ids() {
	return 1;
}
const text = new String("value");
new Error("lost");
console.log(ids, text);
`;
	const loopsCode: string = `for (let outer = 0; outer < 3; outer++) {
	for (let inner = 0; inner < 3; outer++) {
		console.log(inner);
	}
}
for (let count = 0; count < 3; count++) {
	count = count++;
}
`;
	const switchFallthroughCode: string = `function use(value) {
	switch (value) {
		case 1:
			console.log("one");
		case 2:
			console.log("two");
			break;
		default:
			break;
	}
}
use(1);
`;
	const callbacksCode: string = `function takesOne(value) {
	return value;
}
takesOne(1, 2);
`;
	const deadStoreCode: string = `function compute() {
	let value = 1;
	value = 2;
	const unused = 3;

	return value;
}
console.log(compute());
`;
	const collectionsCode: string = `function collect(items) {
	const set = new Set();
	for (const item of items) {
		set.add(item);
	}
	if (set.size < 0) {
		return set;
	}
	return [];
}
console.log(collect([1]));
`;
	const switchDefaultCode: string = `function use(value) {
	switch (value) {
		default:
			return "default";
		case 1:
		case 2 || 3:
			return "number";
	}
}
console.log(use(1));
`;
	const jsxCode: string = `export function Component() {
	return (
		<main>
			<table>
				<tr>
					<td>Name</td>
				</tr>
			</table>
			<object data="movie.swf"></object>
		</main>
	);
}
`;
	const typeAwareCode: string = `const numberValue: number = 1;
const compared = numberValue === "1";
function returnsVoid(): void {
	console.log("x");
}
const value = returnsVoid() || true;
console.log(compared, value);
`;
	const additionalGeneralCode: string = `function scoped(flag) {
	if (flag) {
		var leaked = 1;
	}
	return leaked;
}
function oneArgument(value) { return value; }
oneArgument
	(1);
class bad_name {}
const dynamicCode = "console.log(1)";
eval(dynamicCode);
var loopIndex;
for (loopIndex = 0; loopIndex < 2; loopIndex++) {
	const nested = function() { return loopIndex; };
	console.log(nested());
}
unneededLabel: console.log("label");
function manyCases(value) {
	switch (value) {
		case 0: return 0;
		case 1: return 1;
		case 2: return 2;
		case 3: return 3;
		case 4: return 4;
		case 5: return 5;
		case 6: return 6;
		case 7: return 7;
		case 8: return 8;
		case 9: return 9;
		case 10: return 10;
		case 11: return 11;
		case 12: return 12;
		case 13: return 13;
		case 14: return 14;
		case 15: return 15;
		case 16: return 16;
		case 17: return 17;
		case 18: return 18;
		case 19: return 19;
		case 20: return 20;
		case 21: return 21;
		case 22: return 22;
		case 23: return 23;
		case 24: return 24;
		case 25: return 25;
		case 26: return 26;
		case 27: return 27;
		case 28: return 28;
		case 29: return 29;
		case 30: return 30;
		case 31: return 31;
		case 32: return 32;
		case 33: return 33;
		case 34: return 34;
		default: return -1;
	}
}
switch (1) {
	case 1:
		caseLabel: console.log(1);
		break;
}
delete (1 + 2);
function duplicatedBranch(value) {
	if (value === 1) {
		const result = value + 1;
		console.log(result);
		return result;
	} else if (value === 2) {
		const result = value + 1;
		console.log(result);
		return result;
	}
	return 0;
}
for (let equalityIndex = 0; equalityIndex === 10; equalityIndex++) {
	console.log(equalityIndex);
}
this.globalValue = 1;
var undefined = 1;
const host = "192.168.0.1";
function identicalFirst(value) {
	const result = value + 1;
	console.log(result);
	return result;
}
function identicalSecond(value) {
	const result = value + 1;
	console.log(result);
	return result;
}
try {
	throw new Error("bad");
} catch (error) {
}
implicitGlobal = 1;
function inverted(value) {
	if (!(value === 1)) {
		return false;
	}
	return true;
}
function nestedFunctionsA() {
	function nestedFunctionsB() {
		function nestedFunctionsC() {
			function nestedFunctionsD() {
				function nestedFunctionsE() {
					return 1;
				}
				return nestedFunctionsE();
			}
			return nestedFunctionsD();
		}
		return nestedFunctionsC();
	}
	return nestedFunctionsB();
}
const nestedName = "Ada";
const nestedTemplate = \`hello \${\`inner \${nestedName}\`}\`;
function reassignParameter(value) {
	value = 1;
	return value;
}
function redundantBoolean(value) {
	return value == true;
}
try {
	doWork();
} catch (error) {
	throw error;
}
let nonExistent = 1;
nonExistent =+ 2;
const promise = new Promise((resolve) => resolve(1));
let preferWhileValue = 0;
for (; preferWhileValue < 3;) {
	preferWhileValue++;
}
const random = Math.random();
const constValue = 1;
constValue = 2;
console.log(scoped, bad_name, manyCases, duplicatedBranch, host, identicalFirst, identicalSecond, implicitGlobal, inverted, nestedFunctionsA, nestedTemplate, reassignParameter, redundantBoolean, nonExistent, promise, preferWhileValue, random);
`;
	const securityCode: string = `const password = "A1b2C3d4E5";
const pg = require("pg");
const client = new pg.Client();
const id = process.argv[2];
client.query(\`SELECT * FROM users WHERE id = \${id}\`);
const cryptoA = require("crypto");
cryptoA.createHash("md5").update("x").digest("hex");
const cryptoB = require("crypto");
cryptoB.createCipheriv("des-ede3-cbc", key, iv);
const cryptoC = require("crypto");
cryptoC.createCipheriv("aes-128-ecb", key, null);
const csrf = require("csurf");
app.use(csrf({ ignoreMethods: ["POST"] }));
const libxml = require("libxmljs");
libxml.parseXml(xml, { noent: true });
const fsA = require("fs");
fsA.chmodSync("file.txt", 0o777);
const childProcessA = require("child_process");
childProcessA.exec("ls " + path);
const childProcessB = require("child_process");
childProcessB.execFile("ls", []);
const fsB = require("fs");
fsB.writeFileSync("/tmp/data.txt", "value");
console.log(password);
`;
	const additionalTypeAwareCode: string = `import { readFileSync } from "node:fs";
const mappedValues = [1, 2, 3].map((value) => { console.log(value); });
const inPrimitive = "name" in 1;
const names = ["a", "b"];
const found = names.indexOf("b") > 0;
const deletedValues = [1, 2];
delete deletedValues[0];
const associativeValues: Array<number> = [];
associativeValues["name"] = 1;
const controlRegex = /\\x1f/;
const emptyAlternative = /foo||bar/;
const emptyClass = /[]/;
"value".trim();
const inArrayValues = [1, 2];
if ("1" in inArrayValues) {
	console.log(inArrayValues);
}
const misleadingClass = /[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66]/u;
function defaulted(value = 1) { return value; }
defaulted(undefined);
const nullableValue: { name: string } | null = null;
console.log(nullableValue.name);
const stringMatch = "abc".match(/a/);
class SonarConfig {
	static value = 1;
}
const reduced = [1, 2].reduce((total, value) => total + value);
const namedGroupMatch = /(?<name>a)/.exec("a");
function voidFunction(): void {
	return void console.log("x");
}
function inconsistentReturn(flag: boolean) {
	if (flag) {
		return 1;
	}
	return "one";
}
const overwrittenValues = [0, 1];
overwrittenValues[0] = 2;
overwrittenValues[0] = 3;
const reversedValues = [1, 2, 3];
const reversed = reversedValues.reverse();
function unusedCollection() {
	const values = new Set<number>();
	values.add(1);
}
type DuplicateComposite = string | string;
type RedundantAlias = string;
const literalCallValue = "hello"();
class AsyncConstructorWorker {
	constructor() {
		return Promise.resolve(this);
	}
}
const slowRegex = /(a+)+$/;
console.log(mappedValues, inPrimitive, found, deletedValues, associativeValues, controlRegex, emptyAlternative, emptyClass, misleadingClass, stringMatch, SonarConfig.value, reduced, namedGroupMatch, voidFunction, inconsistentReturn, overwrittenValues, reversed, unusedCollection, literalCallValue, AsyncConstructorWorker, slowRegex);
`;
	const hookCode: string = `import { useState } from "react";
export function Component() {
	const [value, setValue] = useState(0);
	setValue(value + 1);
	return <div>{value}</div>;
}
`;
	const missingRegexCode: string = `const anchor = /^foo|bar|baz$/;
const concise = /[0-9]{1}/;
const emptyRepeat = /(a?)*b/;
const complex = /^(?:(foo|bar|baz)+(qux|quux|corge)?|(grault|garply){1,3}|waldo(?=fred)|plugh(?!xyzzy))*$/;
const stateful = /a/g;
stateful.test("a");
stateful.test("b");
const replaced = "abc".replace(/(a)/, "$2");
const invalid = new RegExp("[");
console.log(anchor, concise, emptyRepeat, complex, replaced, invalid);
`;
	const missingTypeAwareCode: string = `/** @deprecated use newValue */
function oldValue(): number { return 1; }
const deprecatedValue = oldValue();
"abc".charAt("1");
function range(startDate: Date, endDate: Date): Array<Date> { return [startDate, endDate]; }
const startDate = new Date();
const endDate = new Date();
range(endDate, startDate);
if (a & b) {
	console.log(a, b);
}
for (let index = 10; index > 0; index++) {
	console.log(index);
}
function inconsistent(): number { return 1; }
inconsistent();
new inconsistent();
const builtIn = new Math.max();
const sortedNumbers = [10, 2, 1].sort();
const emptyValues: Array<string> = [];
emptyValues[0];
function redundant(flag: boolean): boolean {
	if (flag) {
		return flag || true;
	}
	return false;
}
function assign(): number {
	let value = 1;
	value = 1;
	return value;
}
interface OptionalExample { name?: string | undefined; }
type EmptyIntersection = string & {};
if (first) { doFirst(); } if (second) {
	doSecond();
}
function choose(isCreate: boolean): object {
	return isCreate ? createUser() : updateUser();
}
function promiseTry(): void {
	try {
		fetch("/");
	} catch (error) {
		console.error(error);
	}
}
if (ready)
	doFirst();
	doSecond();
interface Cat { meow(): void; }
interface Dog { bark(): void; }
function isCat(pet: Cat | Dog): boolean {
	return (pet as Cat).meow !== undefined;
}
function firstUnion(value: string | number | boolean): string | number | boolean { return value; }
function secondUnion(value: string | number | boolean): string | number | boolean { return value; }
function thirdUnion(value: string | number | boolean): string | number | boolean { return value; }
const script = document.createElement("script");
script.src = "https://cdn.example.org/app.js";
window.postMessage("x", "*");
window.addEventListener("message", (event) => {
	console.log(event.data);
});
console.log(deprecatedValue, builtIn, sortedNumbers, OptionalExample, EmptyIntersection, choose, promiseTry, isCat, firstUnion, secondUnion, thirdUnion, script);
`;
	const missingAwsCode: string = `import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as efs from "aws-cdk-lib/aws-efs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as sagemaker from "aws-cdk-lib/aws-sagemaker";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
new apigateway.CfnMethod(this, "Method", { authorizationType: "NONE" });
new apigatewayv2.CfnRoute(this, "Route", {});
new ec2.Instance(this, "Instance", { vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC } });
new ec2.Volume(this, "Volume", { encrypted: false });
new ec2.CfnSecurityGroup(this, "SecurityGroup", { securityGroupIngress: [{ cidrIp: "0.0.0.0/0", fromPort: 22, ipProtocol: "tcp", toPort: 22 }] });
new efs.CfnFileSystem(this, "FileSystem", {});
new iam.PolicyStatement({ actions: ["*"], effect: iam.Effect.ALLOW, resources: ["*"] });
new iam.PolicyStatement({ actions: ["iam:CreatePolicyVersion"], effect: iam.Effect.ALLOW, resources: ["*"] });
new iam.PolicyStatement({ actions: ["s3:GetObject"], effect: iam.Effect.ALLOW, principals: [new iam.AnyPrincipal()], resources: ["*"] });
new opensearch.Domain(this, "Domain", { encryptionAtRest: { enabled: false } });
new rds.CfnDBInstance(this, "DB", { publiclyAccessible: true, storageEncrypted: false });
new s3.Bucket(this, "Bucket", { accessControl: s3.BucketAccessControl.PUBLIC_READ, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, enforceSSL: false, publicReadAccess: true, versioned: false });
new s3deploy.BucketDeployment(this, "Deploy", { accessControl: s3.BucketAccessControl.PUBLIC_READ });
new sagemaker.CfnNotebookInstance(this, "Notebook", {});
new sns.Topic(this, "Topic", {});
new sqs.Queue(this, "Queue", { encryption: sqs.QueueEncryption.UNENCRYPTED });
`;
	const missingWebSecurityCode: string = `const express = require("express");
const helmet = require("helmet");
const csp = require("helmet-csp");
const cors = require("cors");
const serveStatic = require("serve-static");
const session = require("express-session");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const formidable = require("formidable");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const https = require("https");
const tls = require("tls");
const signale = require("signale");
const DOMPurify = require("dompurify");
const Mustache = require("mustache");
const marked = require("marked");
const ejs = require("ejs");
const httpProxy = require("http-proxy");
const nodemailer = require("nodemailer");
const ftp = require("ftp");
const { Wallet } = require("ethers");
const app = express();
app.use(helmet({ contentSecurityPolicy: false, hsts: false, noSniff: false, referrerPolicy: false }));
app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], frameAncestors: ["'none'"] } }));
app.use(csp({ directives: { defaultSrc: ["'self'"] } }));
app.use(cors());
app.use(session({ cookie: { httpOnly: false, secure: false }, secret: "secret" }));
app.use(cookieSession({ httpOnly: false, keys: ["secret"], secure: false }));
app.use(express.static("public"));
app.set("x-powered-by", true);
app.use(require("errorhandler")());
app.get("/", (req, res) => {
	res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
});
serveStatic("public", { dotfiles: "allow" });
bodyParser.json();
multer();
formidable({ keepExtensions: true });
httpProxy.createProxyServer({ xfwd: true });
const publicUrl = "http://public.example.org/api";
const ftpClient = new ftp();
ftpClient.connect({ secure: false });
nodemailer.createTransport({ port: 25, requireTLS: false, secure: false });
new signale.Signale({ secrets: [] });
DOMPurify.sanitize(input, { ADD_TAGS: ["script"], ALLOWED_URI_REGEXP: /javascript/ });
Mustache.escape = (value) => value;
marked.setOptions({ sanitize: false });
const templateName = process.argv[2];
ejs.render(templateName, {});
jwt.sign({ sub: "1" }, "secret", { algorithm: "none" });
jwt.verify(token, null, { algorithms: ["none"] });
crypto.generateKeyPairSync("rsa", { modulusLength: 1024 });
https.request({ rejectUnauthorized: false });
tls.connect(443, "example.com", { checkServerIdentity: () => true, rejectUnauthorized: false });
window.open("https://example.org", "_blank");
navigator.geolocation.getCurrentPosition(() => {});
sanitizer.bypassSecurityTrustHtml(templateName);
passport.authenticate("local")(req, res, function authenticateCallback() {
	res.redirect("/");
});
require("./node_modules/private/internal");
const authToken = "mN7qL4sV8zB2cX9pR5tY3wK6hJ1dF0gH4aS8uI2oP7eQ5rT9vW3xZ6bC1nM4";
const phrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
Wallet.fromPhrase(phrase);
console.log(publicUrl, authToken);
`;
	const missingFrameworkCode: string = `const chai = require("chai");
describe("suite", function suite() {
	this.timeout(2147483649);
	this.retries(2);
	it.skip("skips", function skipped() {});
	it("checks assertions", function checks(done) {
		const value = compute();
		expect(value).not.property("name", "Ada");
		expect("literal").to.equal(value);
		expect(value).to.equal(value);
		assert.equal("literal", value);
		assert.equal(value, value);
		try {
			throw new Error("x");
		} catch (error) {
			done();
		}
	});
});
jest.retryTimes(2);
console.log(chai);
`;
	const missingJsxCode: string = `import React, { useState } from "react";
type Props = { name: string };
export function Component(props: Props) {
	const [value, setValue] = useState(0);
	setValue(value);
	const items = ["a"];
	return (
		<main>
			{items.length && <span>{props.name}</span>}
			{items.map((item) => <span key={Math.random()}>{item}</span>)}
			<table role="presentation">
				<tr>
					<td>Layout</td>
				</tr>
			</table>
			<table>
				<tr>
					<th id="name">Name</th>
					<th id="age">Age</th>
				</tr>
				<tr>
					<td headers="age">Ada</td>
					<td headers="name">36</td>
				</tr>
			</table>
			{value}
		</main>
	);
}
`;
	const commentedCodeCurrentBehavior: string = `// const oldValue: number = 1;
// if (oldValue > 0) {
// 	console.log(oldValue);
// }
const value = 1;
console.log(value);
`;

	return [
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/branches.fixture.js", ["sonarjs/no-all-duplicated-branches", "sonarjs/no-invariant-returns", "sonarjs/no-small-switch", "sonarjs/prefer-single-boolean-return"], branchesCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/regex.fixture.js", ["sonarjs/duplicates-in-character-class", "sonarjs/no-empty-after-reluctant", "sonarjs/no-empty-group", "sonarjs/no-regex-spaces", "sonarjs/single-char-in-character-classes", "sonarjs/single-character-alternation"], regexCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/tests.fixture.js", ["sonarjs/no-code-after-done", "sonarjs/no-exclusive-tests", "sonarjs/no-incomplete-assertions"], testsCode),
		createCase(
			"sonar",
			"sonarjs/assertions-in-tests",
			{ withSonar: true },
			"test/e2e/fixture/sonar/invalid/assertions-in-tests.fixture.js",
			`import { describe, it } from "vitest";
describe("suite", () => {
	it("works", () => {
		const value = 1;
		console.log(value);
	});
});
`,
		),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/conditions.fixture.js", ["sonarjs/no-identical-conditions", "sonarjs/no-identical-expressions", "sonarjs/no-nested-conditional"], conditionsCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/statements.fixture.js", ["sonarjs/no-labels", "sonarjs/no-nested-assignment", "sonarjs/no-redundant-jump"], statementsCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/constructs.fixture.js", ["sonarjs/constructor-for-side-effects", "sonarjs/generator-without-yield", "sonarjs/no-primitive-wrappers", "sonarjs/no-unthrown-error"], constructsCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/loops.fixture.js", ["sonarjs/misplaced-loop-counter", "sonarjs/no-useless-increment", "sonarjs/updated-loop-counter"], loopsCode),
		createCase("sonar", "sonarjs/no-fallthrough", { withSonar: true }, "test/e2e/fixture/sonar/invalid/switch-fallthrough.fixture.js", switchFallthroughCode),
		createCase("sonar", "sonarjs/no-extra-arguments", { withSonar: true }, "test/e2e/fixture/sonar/invalid/callbacks.fixture.js", callbacksCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/dead-store.fixture.js", ["sonarjs/no-dead-store", "sonarjs/no-unused-vars"], deadStoreCode),
		createCase("sonar", "sonarjs/no-collection-size-mischeck", { withSonar: true }, "test/e2e/fixture/sonar/invalid/collections.fixture.js", collectionsCode),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/invalid/switch-default.fixture.js", ["sonarjs/comma-or-logical-or-case", "sonarjs/prefer-default-last"], switchDefaultCode),
		createCase("sonar", "sonarjs/fixme-tag", { withSonar: true }, "test/e2e/fixture/sonar/invalid/fixme-tag.fixture.js", `// FIXME: remove this workaround\nconst value = 1;\nconsole.log(value);\n`),
		...createCases("sonar", { withJsx: true, withSonar: true }, "test/e2e/fixture/sonar/invalid/jsx.fixture.jsx", ["sonarjs/object-alt-content", "sonarjs/table-header"], jsxCode),
		...createCases("sonar", { withSonar: true, withTypescript: true }, "test/e2e/rule-behavior-matrix.fixture.ts", ["sonarjs/different-types-comparison", "sonarjs/no-use-of-empty-return-value"], typeAwareCode),
		...createCases(
			"sonar",
			{ withSonar: true },
			"test/e2e/fixture/sonar/invalid/additional-general.fixture.js",
			[
				"sonarjs/block-scoped-var",
				"sonarjs/call-argument-line",
				"sonarjs/class-name",
				"sonarjs/code-eval",
				"sonarjs/function-inside-loop",
				"sonarjs/label-position",
				"sonarjs/max-switch-cases",
				"sonarjs/no-case-label-in-switch",
				"sonarjs/no-delete-var",
				"sonarjs/no-duplicated-branches",
				"sonarjs/no-equals-in-for-termination",
				"sonarjs/no-global-this",
				"sonarjs/no-globals-shadowing",
				"sonarjs/no-hardcoded-ip",
				"sonarjs/no-identical-functions",
				"sonarjs/no-ignored-exceptions",
				"sonarjs/no-implicit-global",
				"sonarjs/no-inverted-boolean-check",
				"sonarjs/no-nested-functions",
				"sonarjs/no-nested-template-literals",
				"sonarjs/no-parameter-reassignment",
				"sonarjs/no-redundant-boolean",
				"sonarjs/no-useless-catch",
				"sonarjs/non-existent-operator",
				"sonarjs/prefer-promise-shorthand",
				"sonarjs/prefer-while",
				"sonarjs/pseudo-random",
				"sonarjs/updated-const-var",
			],
			additionalGeneralCode,
		),
		...createCases("sonar", { withSonar: true }, "src/sonar-security.fixture.js", ["sonarjs/no-hardcoded-passwords", "sonarjs/sql-queries", "sonarjs/hashing", "sonarjs/no-weak-cipher", "sonarjs/encryption-secure-mode", "sonarjs/csrf", "sonarjs/xml-parser-xxe", "sonarjs/file-permissions", "sonarjs/os-command", "sonarjs/no-os-command-from-path", "sonarjs/publicly-writable-directories"], securityCode),
		...createCases(
			"sonar",
			{ withSonar: true, withTypescript: true },
			"test/e2e/rule-behavior-matrix.fixture.ts",
			[
				"sonarjs/array-callback-without-return",
				"sonarjs/in-operator-type-error",
				"sonarjs/index-of-compare-to-positive-number",
				"sonarjs/no-array-delete",
				"sonarjs/no-associative-arrays",
				"sonarjs/no-control-regex",
				"sonarjs/no-empty-alternatives",
				"sonarjs/no-empty-character-class",
				"sonarjs/no-ignored-return",
				"sonarjs/no-in-misuse",
				"sonarjs/no-misleading-character-class",
				"sonarjs/no-undefined-argument",
				"sonarjs/null-dereference",
				"sonarjs/prefer-regexp-exec",
				"sonarjs/public-static-readonly",
				"sonarjs/reduce-initial-value",
				"sonarjs/unused-import",
				"sonarjs/unused-named-groups",
				"sonarjs/void-use",
				"sonarjs/function-return-type",
				"sonarjs/no-element-overwrite",
				"sonarjs/no-misleading-array-reverse",
				"sonarjs/no-unused-collection",
				"sonarjs/no-duplicate-in-composite",
				"sonarjs/redundant-type-aliases",
				"sonarjs/no-literal-call",
				"sonarjs/no-async-constructor",
				"sonarjs/slow-regex",
			],
			additionalTypeAwareCode,
		),
		createCase("sonar", "sonarjs/no-hook-setter-in-body", { withJsx: true, withSonar: true }, "test/e2e/fixture/sonar/invalid/no-hook-setter-in-body.fixture.jsx", hookCode),
		...createCases("sonar", { withSonar: true, withTypescript: true }, "test/e2e/rule-behavior-matrix.fixture.ts", ["sonarjs/anchor-precedence", "sonarjs/concise-regex", "sonarjs/empty-string-repetition", "sonarjs/existing-groups", "sonarjs/no-invalid-regexp", "sonarjs/regex-complexity", "sonarjs/stateful-regex"], missingRegexCode),
		...createCases(
			"sonar",
			{ withSonar: true, withTypescript: true },
			"test/e2e/rule-behavior-matrix.fixture.ts",
			[
				"sonarjs/argument-type",
				"sonarjs/arguments-order",
				"sonarjs/bitwise-operators",
				"sonarjs/deprecation",
				"sonarjs/disabled-resource-integrity",
				"sonarjs/for-loop-increment-sign",
				"sonarjs/inconsistent-function-call",
				"sonarjs/new-operator-misuse",
				"sonarjs/no-alphabetical-sort",
				"sonarjs/no-empty-collection",
				"sonarjs/no-gratuitous-expressions",
				"sonarjs/no-redundant-assignments",
				"sonarjs/no-redundant-optional",
				"sonarjs/no-same-line-conditional",
				"sonarjs/no-selector-parameter",
				"sonarjs/no-try-promise",
				"sonarjs/no-unenclosed-multiline-block",
				"sonarjs/no-useless-intersection",
				"sonarjs/post-message",
				"sonarjs/prefer-type-guard",
				"sonarjs/use-type-alias",
			],
			missingTypeAwareCode,
		),
		...createCases(
			"sonar",
			{ withSonar: true },
			"test/e2e/fixture/sonar/invalid/aws-cdk.fixture.js",
			[
				"sonarjs/aws-apigateway-public-api",
				"sonarjs/aws-ec2-rds-dms-public",
				"sonarjs/aws-ec2-unencrypted-ebs-volume",
				"sonarjs/aws-efs-unencrypted",
				"sonarjs/aws-iam-all-privileges",
				"sonarjs/aws-iam-privilege-escalation",
				"sonarjs/aws-iam-public-access",
				"sonarjs/aws-opensearchservice-domain",
				"sonarjs/aws-rds-unencrypted-databases",
				"sonarjs/aws-restricted-ip-admin-access",
				"sonarjs/aws-s3-bucket-granted-access",
				"sonarjs/aws-s3-bucket-insecure-http",
				"sonarjs/aws-s3-bucket-public-access",
				"sonarjs/aws-s3-bucket-versioning",
				"sonarjs/aws-sagemaker-unencrypted-notebook",
				"sonarjs/aws-sns-unencrypted-topics",
				"sonarjs/aws-sqs-unencrypted-queue",
				"sonarjs/weak-ssl",
			],
			missingAwsCode,
		),
		...createCases(
			"sonar",
			{ withSonar: true },
			"test/e2e/fixture/sonar/invalid/web-security-missing.fixture.js",
			[
				"sonarjs/confidential-information-logging",
				"sonarjs/content-length",
				"sonarjs/content-security-policy",
				"sonarjs/cookie-no-httponly",
				"sonarjs/cors",
				"sonarjs/disabled-auto-escaping",
				"sonarjs/dompurify-unsafe-config",
				"sonarjs/dynamically-constructed-templates",
				"sonarjs/file-uploads",
				"sonarjs/frame-ancestors",
				"sonarjs/hardcoded-secret-signatures",
				"sonarjs/hidden-files",
				"sonarjs/insecure-cookie",
				"sonarjs/insecure-jwt-token",
				"sonarjs/link-with-target-blank",
				"sonarjs/no-angular-bypass-sanitization",
				"sonarjs/no-clear-text-protocols",
				"sonarjs/no-hardcoded-secrets",
				"sonarjs/no-internal-api-use",
				"sonarjs/no-intrusive-permissions",
				"sonarjs/no-ip-forward",
				"sonarjs/no-mime-sniff",
				"sonarjs/no-mixed-content",
				"sonarjs/no-referrer-policy",
				"sonarjs/no-session-cookies-on-static-assets",
				"sonarjs/no-weak-keys",
				"sonarjs/production-debug",
				"sonarjs/review-blockchain-mnemonic",
				"sonarjs/session-regeneration",
				"sonarjs/strict-transport-security",
				"sonarjs/unverified-certificate",
				"sonarjs/unverified-hostname",
			],
			missingWebSecurityCode,
		),
		createCase("sonar", "sonarjs/x-powered-by", { withSonar: true }, "test/e2e/fixture/sonar/invalid/x-powered-by.fixture.js", `const express = require("express");\nconst app = express();\napp.set("x-powered-by", true);\n`),
		...createCases("sonar", { withSonar: true }, "test/e2e/fixture/sonar/framework-package/framework-rules.test.js", ["sonarjs/chai-determinate-assertion", "sonarjs/disabled-timeout", "sonarjs/inverted-assertion-arguments", "sonarjs/no-same-argument-assert", "sonarjs/no-skipped-tests", "sonarjs/stable-tests", "sonarjs/test-check-exception"], missingFrameworkCode),
		...createCases("sonar", { withJsx: true, withReact: true, withSonar: true, withTypescript: true }, "test/e2e/fixture/rule-behavior-matrix/react.fixture.tsx", ["sonarjs/jsx-no-leaked-render", "sonarjs/no-table-as-layout", "sonarjs/no-uniq-key", "sonarjs/no-useless-react-setstate", "sonarjs/prefer-read-only-props", "sonarjs/table-header-reference"], missingJsxCode),
		// Current parser settings reject future-reserved identifiers before SonarJS can report this rule.
		createCase("sonar", "sonarjs/future-reserved-words", { withSonar: true }, "test/e2e/fixture/sonar/valid/future-reserved-words.fixture.js", `const value = 1;\nconsole.log(value);\n`, "not-reported"),
		// SonarJS no-commented-code does not report under this runtime even for parseable commented snippets.
		createCase("sonar", "sonarjs/no-commented-code", { withSonar: true, withTypescript: true }, "test/e2e/rule-behavior-matrix.fixture.ts", commentedCodeCurrentBehavior, "not-reported"),
	];
}

function createCognitiveComplexityCase(): string {
	const branchLines: Array<string> = Array.from({ length: 105 }, (_value: unknown, index: number) => `\tif (value > ${index}) {\n\t\tvalue -= 1;\n\t}`);

	return `function complex(value) {\n${branchLines.join("\n")}\n\treturn value;\n}\n`;
}

function createDuplicateStringCase(): string {
	return Array.from({ length: 11 }, (_value: unknown, index: number) => `const value${index} = "duplicate literal";`).join("\n");
}
