interface DotTarget {
	known: string;
}

interface GetterSetterPair {
	get value(): string;
	set value(nextValue: number);
}

class ReadonlyCandidate {
	private value: string;

	constructor(value: string) {
		this.value = value;
	}

	public getValue(): string {
		return this.value;
	}
}

class FluentBuilder {
	public chain(): FluentBuilder {
		return this;
	}
}

class ThisAlias {
	public capture(): ThisAlias {
		const that = this;

		return that;
	}
}

function overloaded(value: string): string;
const overloadSeparator = true;
function overloaded(value: number): number;
function overloaded(value: number | string): number | string {
	return value;
}

function returnsVoid(): void {}

function acceptsVoid(callback: () => void): void {
	callback();
}

function acceptsString(value: string): string {
	return value;
}

function defaultedParameter(value: string = "fallback"): string {
	return value;
}

function unusedGeneric<T>(value: string): string {
	return value;
}

function returnsUnsafe(): string {
	return unsafeValue;
}

async function awaitThenable(): Promise<void> {
	await 1;
}

async function noAwait(): Promise<number> {
	return 1;
}

async function missingReturnAwait(): Promise<number> {
	try {
		return Promise.resolve(1);
	} catch {
		return 0;
	}
}

type Status = "done" | "pending";

enum FirstUnsafeEnum {
	Value = "value",
}

enum SecondUnsafeEnum {
	Value = "value",
}

function renderStatus(status: Status): string {
	switch (status) {
		case "done":
			return "done";
	}
}

/** @deprecated use currentValue instead */
const deprecatedValue = "deprecated";
const currentValue = "current";
const deprecatedRead = deprecatedValue;
const numbers = [3, 2, 1];
const callbacks: Array<() => number> = [];
const record: Record<string, number> = { one: 1 };
const dynamicKey = "one";
const dotTarget: DotTarget = { known: "value" };
const maybeName: string | undefined = Math.random() > 0.5 ? "name" : undefined;
const maybeObject: { child?: { name?: string } } | undefined = {};
const unknownObject = {};
const unsafeValue: any = { member: () => "value" };
const bool = true;
const objectTemplate = `${unknownObject}`;
const confusingVoid = returnsVoid();
const meaninglessVoid = void returnsVoid();
const anyAssignment: string = unsafeValue;
const anyArgument = acceptsString(unsafeValue);
const anyMember = unsafeValue.member;
const anyCall = unsafeValue.member();
const unsafeNegative = -currentValue;
const { requiredName = "fallback" }: { requiredName: string } = { requiredName: "value" };
const dotNotation = dotTarget["known"];
const nonNullValue = maybeName!;
const extraNonNullValue = maybeName!!;
const nonNullFallback = maybeName! ?? "fallback";
const nonNullComparison = maybeName! === undefined;
const nonNullOptionalChain = maybeObject?.child!;
const nonNullAssertionStyle = maybeName as string;
const unnecessaryAssertion = currentValue as string;
const unnecessaryTemplate = `${currentValue}`;
const unnecessaryConversion = currentValue + "";
const optionalFallback = maybeName || "fallback";
const optionalChain = maybeObject && maybeObject.child && maybeObject.child.name;
const includeCheck = numbers.indexOf(2) !== -1;
const foundValue = numbers.filter((value) => value > 1)[0];
const reducedValue = numbers.reduce((total, value) => total + value, 0 as number);
const regexpMatch = currentValue.match(/current/);
const startsWithCheck = currentValue.indexOf("cur") === 0;
const sortedNumbers = numbers.sort();
const plusOperands = currentValue + 1;
const arraySpreadInObject = { ...numbers };
const promiseSpreadInObject = { ...Promise.resolve({ value: 1 }) };
const promiseConditional = Promise.resolve(true);
const promiseRejection = Promise.reject("bad reason");
const promiseCatch = Promise.reject(new Error("bad")).catch((error: Error) => error.message);
const unsafeEnumComparison = FirstUnsafeEnum.Value === SecondUnsafeEnum.Value;

delete numbers[0];
delete record[dynamicKey];

for (const index in numbers) {
	callbacks.push(() => Number(index));
}

for (let index = 0; index < numbers.length; index += 1) {
	callbacks.push(() => numbers[index] ?? 0);
}

for (var capturedIndex = 0; capturedIndex < numbers.length; capturedIndex += 1) {
	callbacks.push(() => capturedIndex);
}

if (bool === true) {
	returnsVoid();
}

if (promiseConditional) {
	returnsVoid();
}

setTimeout("returnsVoid()", 1);
acceptsVoid(async () => Promise.resolve());
throw "not an error";

export {
	anyAssignment,
	anyArgument,
	anyCall,
	anyMember,
	arraySpreadInObject,
	awaitThenable,
	callbacks,
	confusingVoid,
	defaultedParameter,
	deprecatedRead,
	dotNotation,
	extraNonNullValue,
	FluentBuilder,
	foundValue,
	GetterSetterPair,
	includeCheck,
	meaninglessVoid,
	missingReturnAwait,
	noAwait,
	nonNullAssertionStyle,
	nonNullComparison,
	nonNullFallback,
	nonNullOptionalChain,
	nonNullValue,
	objectTemplate,
	optionalChain,
	optionalFallback,
	overloadSeparator,
	overloaded,
	plusOperands,
	promiseRejection,
	promiseCatch,
	promiseSpreadInObject,
	ReadonlyCandidate,
	reducedValue,
	regexpMatch,
	requiredName,
	renderStatus,
	returnsUnsafe,
	sortedNumbers,
	startsWithCheck,
	ThisAlias,
	unnecessaryAssertion,
	unnecessaryConversion,
	unnecessaryTemplate,
	unsafeEnumComparison,
	unsafeNegative,
	unusedGeneric,
};
