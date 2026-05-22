import type { IRuleBehaviorCase } from "../types";
import { createCases } from "../case-factory";

const REGEXP_RECOMMENDED_RULE_IDS: ReadonlyArray<string> = [
	"no-control-regex",
	"no-misleading-character-class",
	"no-regex-spaces",
	"prefer-regex-literals",
	"regexp/confusing-quantifier",
	"regexp/control-character-escape",
	"regexp/match-any",
	"regexp/negation",
	"regexp/no-contradiction-with-assertion",
	"regexp/no-dupe-characters-character-class",
	"regexp/no-dupe-disjunctions",
	"regexp/no-empty-alternative",
	"regexp/no-empty-capturing-group",
	"regexp/no-empty-character-class",
	"regexp/no-empty-group",
	"regexp/no-empty-lookarounds-assertion",
	"regexp/no-empty-string-literal",
	"regexp/no-escape-backspace",
	"regexp/no-extra-lookaround-assertions",
	"regexp/no-invalid-regexp",
	"regexp/no-invisible-character",
	"regexp/no-lazy-ends",
	"regexp/no-legacy-features",
	"regexp/no-misleading-capturing-group",
	"regexp/no-misleading-unicode-character",
	"regexp/no-missing-g-flag",
	"regexp/no-non-standard-flag",
	"regexp/no-obscure-range",
	"regexp/no-optional-assertion",
	"regexp/no-potentially-useless-backreference",
	"regexp/no-super-linear-backtracking",
	"regexp/no-trivially-nested-assertion",
	"regexp/no-trivially-nested-quantifier",
	"regexp/no-unused-capturing-group",
	"regexp/no-useless-assertions",
	"regexp/no-useless-backreference",
	"regexp/no-useless-character-class",
	"regexp/no-useless-dollar-replacements",
	"regexp/no-useless-escape",
	"regexp/no-useless-flag",
	"regexp/no-useless-lazy",
	"regexp/no-useless-non-capturing-group",
	"regexp/no-useless-quantifier",
	"regexp/no-useless-range",
	"regexp/no-useless-set-operand",
	"regexp/no-useless-string-literal",
	"regexp/no-useless-two-nums-quantifier",
	"regexp/no-zero-quantifier",
	"regexp/optimal-lookaround-quantifier",
	"regexp/optimal-quantifier-concatenation",
	"regexp/prefer-character-class",
	"regexp/prefer-d",
	"regexp/prefer-plus-quantifier",
	"regexp/prefer-predefined-assertion",
	"regexp/prefer-question-quantifier",
	"regexp/prefer-range",
	"regexp/prefer-set-operation",
	"regexp/prefer-star-quantifier",
	"regexp/prefer-unicode-codepoint-escapes",
	"regexp/prefer-w",
	"regexp/simplify-set-operations",
	"regexp/sort-flags",
	"regexp/strict",
	"regexp/use-ignore-case",
];

export const RULE_BEHAVIOR_REGEXP_CASES: Array<IRuleBehaviorCase> = [...createCases("regexp", { withRegexp: true }, "test/e2e/fixture/regexp/invalid/recommended.fixture.js", [...REGEXP_RECOMMENDED_RULE_IDS], createRegexpRecommendedCase())];

function createRegexpRecommendedCase(): string {
	const zeroWidthSpace: string = String.fromCodePoint(0x20_0b);
	const familyEmoji: string = [0x1f_468, 0x20_0d, 0x1f_469, 0x20_0d, 0x1f_467, 0x20_0d, 0x1f_466].map((codePoint: number) => String.fromCodePoint(codePoint)).join("");

	return String.raw`
const sample = "aaa";
const noMisleadingCharacterClass = /[A\u0301]/u;
const noRegexSpaces = /foo   bar/;
const preferRegexLiterals = new RegExp("a", "l");
const noControlRegex = /\u{0001}/u;
const confusingQuantifier = /(?:a?){2}/;
const controlCharacterEscape = /\x0a/;
const matchAny = /[^]/;
const negation = /[^\d]/;
const noContradictionWithAssertion = /(?=a)b*/u;
const noDupeCharactersCharacterClass = /[aa]/;
const noDupeDisjunctions = /(?:a|a)/;
const noEmptyAlternative = /(?:a|)/;
const noEmptyCapturingGroup = /()/;
const noEmptyCharacterClass = /[]/;
const noEmptyGroup = /(?:)/;
const noEmptyLookaroundsAssertion = /(?=)/;
const noEmptyStringLiteral = /[\q{}]/v;
const noEscapeBackspace = /[\b]/;
const noExtraLookaroundAssertions = /(?=(?=a))/;
const noInvalidRegexp = new RegExp("[");
const noInvisibleCharacter = /${zeroWidthSpace}/;
const noLazyEnds = /a+?/.test(sample);
const noLegacyFeatures = RegExp.$1;
const noMisleadingCapturingGroup = /a+(a*)/;
const noMisleadingUnicodeCharacter = /[${familyEmoji}]/u;
const noMissingGFlag = sample.matchAll(/a/);
const noNonStandardFlag = new RegExp("a", "l");
const noObscureRange = /[A-z]/;
const noOptionalAssertion = /(?=a)?/;
const noPotentiallyUselessBackreference = /(?:a|(b))\1/;
const noSuperLinearBacktracking = /(?:a*)*b/;
const noTriviallyNestedAssertion = /(?=(?=a))/;
const noTriviallyNestedQuantifier = /(?:a*){2}/;
const noUnusedCapturingGroup = /(a)b/.test("ab");
const noUselessAssertions = /(?=a)(?:a)/;
const noUselessBackreference = /(a)|\1/;
const noUselessCharacterClass = /[a]/;
const noUselessDollarReplacements = sample.replace(/a/, "$1");
const noUselessEscape = /\a/;
const noUselessFlag = /\d/i;
const noUselessLazy = /a+?b/;
const noUselessNonCapturingGroup = /(?:ab)c/;
const noUselessQuantifier = /a{1}/;
const noUselessRange = /[a-a]/;
const noUselessSetOperand = /[a--b]/v;
const noUselessStringLiteral = /[\q{a}]/v;
const noUselessTwoNumsQuantifier = /a{1,1}/;
const noZeroQuantifier = /a{0}/;
const optimalLookaroundQuantifier = /(?=a*)/;
const optimalQuantifierConcatenation = /a{2}a{3}/;
const preferCharacterClass = /a|b|c/;
const preferD = /[0-9]/;
const preferPlusQuantifier = /a{1,}/;
const preferPredefinedAssertion = /(?<![\s\S])/;
const preferQuestionQuantifier = /a{0,1}/;
const preferRange = /[0123456789]/;
const preferSetOperation = /(?=a)./v;
const preferStarQuantifier = /a{0,}/;
const preferUnicodeCodepointEscapes = /\uD83D\uDE00/u;
const preferW = /[A-Za-z0-9_]/;
const simplifySetOperations = /[[^a]&&[^b]]/v;
const sortFlags = /abc/ig;
const strict = /\u0041/u;
const useIgnoreCase = /[A-Z]/i;
`;
}
