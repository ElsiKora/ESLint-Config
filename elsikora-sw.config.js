export default {
	ci: {
		isEnabled: true,
		isNpmPackage: true,
		moduleProperties: {
			dependabot: {
				devBranchName: "dev",
			},
		},
		modules: ["codecommit-sync", "dependabot", "qodana", "release-npm", "snyk"],
		provider: "GitHub",
	},
	commitlint: {
		isEnabled: true,
	},
	eslint: {
		isEnabled: false,
	},
	gitignore: {
		isEnabled: true,
	},
	ide: {
		isEnabled: false,
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
		isEnabled: false,
	},
	"semantic-release": {
		isEnabled: true,
		isPrereleaseEnabled: false,
		mainBranch: "main",
		repositoryUrl: "https://github.com/ElsiKora/ESLint-Config",
	},
	stylelint: {
		isEnabled: false,
	},
};
