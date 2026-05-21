/// <reference path="./type-only-source.fixture.ts" />

import { type ExportedAlias } from "./type-only-source.fixture";
import { ExportedShape } from "./type-only-source.fixture";

// tslint:disable-next-line:no-any
interface EmptyInterface {}

interface Dictionary {
	[key: string]: number;
}

interface Callable {
	(value: string): void;
}

interface Constructable {
	new (): Constructable;
	constructor(): void;
}

interface UnifiedSignature {
	run(value: string): void;
	run(value: number): void;
}

type LocalShape = {
	value: string;
};

type StringList = string[];
type DuplicateUnion = string | string;
type RedundantUnion = string | unknown;
type InvalidVoidUnion = string | void;
type UnsafeFunctionAlias = Function;
type WrapperObjectAlias = String;
type UnnecessaryConstraint<T extends unknown> = T;
type WithDefault<T = string> = T;
type UnnecessaryDefault = WithDefault<string>;

enum DuplicateValues {
	First = "same",
	Second = "same",
}

enum MixedValues {
	Name = "name",
	Count = 1,
}

enum MissingInitializers {
	First,
	Second,
}

module LegacyModule {
	export const value = 1;
}

namespace LegacyNamespace {
	export const value = 1;
}

class LiteralHolder {
	public get status(): string {
		return "ready";
	}
}

class UselessConstructor {
	constructor() {}
}

interface MergedDeclaration {
	value: string;
}

class MergedDeclaration {
	public value = "merged";
}

const arrayConstructed = new Array(1, 2);
const genericConstructed: Map<string, string> = new Map();
const assertedWithAngle = <string>"value";
const literalAsType = "ready" as "ready";
let looseValue: any;
var legacyValue = 1;
let reassignedNever = 1;
const list: StringList = ["a"];
const dictionary: Dictionary = { a: 1 };
const exportedShape: ExportedShape = { value: "shape" };
const aliasValue: ExportedAlias = "alias";
const requiredFs = require("node:fs");
const spreadArguments = [1];

delete dictionary[Math.random().toString()];

function emptyFunction(): void {}

function redeclaredFunction(): void {}

function redeclaredFunction(): void {}

function useArguments(): number {
	return arguments[0];
}

function spreadTarget(value: number): number {
	return value;
}

Math.max.apply(Math, [1, 2]);
spreadTarget.apply(null, spreadArguments);
looseValue;

export { LocalShape };
export {};
export {
	aliasValue,
	arrayConstructed,
	assertedWithAngle,
	Callable,
	dictionary,
	DuplicateUnion,
	DuplicateValues,
	EmptyInterface,
	emptyFunction,
	exportedShape,
	genericConstructed,
	InvalidVoidUnion,
	legacyValue,
	LegacyModule,
	LegacyNamespace,
	list,
	LiteralHolder,
	looseValue,
	MergedDeclaration,
	MissingInitializers,
	MixedValues,
	RedundantUnion,
	reassignedNever,
	redeclaredFunction,
	requiredFs,
	spreadArguments,
	spreadTarget,
	UnnecessaryConstraint,
	UnnecessaryDefault,
	UnsafeFunctionAlias,
	useArguments,
	UselessConstructor,
	WrapperObjectAlias,
};
