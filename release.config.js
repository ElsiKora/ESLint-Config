export default {
	branches: ["main"],
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				parserOpts: {
					noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
				},
				preset: "conventionalcommits",
				releaseRules: [
					{ release: "minor", type: "feat" },
					{ release: "patch", type: "fix" },
					{ release: "patch", type: "docs" },
					{ release: "patch", type: "style" },
					{ release: "patch", type: "refactor" },
					{ release: "patch", type: "perf" },
					{ release: "patch", type: "test" },
					{ release: "patch", type: "build" },
					{ release: "patch", type: "ci" },
					{ release: "patch", type: "chore" },
					{ release: "patch", type: "revert" },
					{ release: "patch", type: "wip" },
				],
			},
		],
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{
				changelogFile: "docs/CHANGELOG.md",
			},
		],
		"@semantic-release/github",
		[
			"@semantic-release/npm",
			{
				access: "public",
			},
		],
		[
			"@semantic-release/git",
			{
				assets: ["docs", "package.json"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
			},
		],
	],
	repositoryUrl: "https://github.com/ElsiKora/ESLint-Config",
};
