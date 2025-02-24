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
		isEnabled: false,
	},
	eslint: {
		isEnabled: false,
	},
	gitignore: {
		isEnabled: false,
	},
	ide: {
		isEnabled: false,
	},
	license: {
		isEnabled: false,
	},
	"lint-staged": {
		isEnabled: false,
	},
	prettier: {
		isEnabled: false,
	},
	"semantic-release": {
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
