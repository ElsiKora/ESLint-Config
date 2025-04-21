export default {
	"branch-lint": {
		isEnabled: true,
	},
	ci: {
		isEnabled: true,
		isNpmPackage: true,
		moduleProperties: {
			dependabot: {
				devBranchName: "dev",
			},
			"release-npm": {
				isPrerelease: true,
				mainBranch: "main",
				preReleaseBranch: "dev",
			},
		},
		modules: ["codecommit-sync", "dependabot", "qodana", "release-npm", "snyk"],
		provider: "GitHub",
	},
	commitlint: {
		isEnabled: true,
	},
	eslint: {
		features: ["prettier", "packageJson", "checkFile", "yaml", "json", "javascript", "typescript", "perfectionist", "unicorn", "sonar", "stylistic", "regexp", "node"],
		isEnabled: true,
	},
	gitignore: {
		isEnabled: true,
	},
	ide: {
		ides: ["intellij-idea"],
		isEnabled: true,
	},
	license: {
		author: "ElsiKora",
		isEnabled: true,
		license: "MIT",
		year: 2025,
	},
	"lint-staged": {
		features: ["eslint", "prettier"],
		isEnabled: true,
	},
	prettier: {
		isEnabled: true,
	},
	"semantic-release": {
		developBranch: "dev",
		isBackmergeEnabled: true,
		isEnabled: true,
		isPrereleaseEnabled: true,
		mainBranch: "main",
		preReleaseBranch: "dev",
		preReleaseChannel: "beta",
		repositoryUrl: "https://github.com/ElsiKora/ESLint-Config",
	},
	stylelint: {
		isEnabled: false,
	},
};
