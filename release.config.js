export default {
	branches: [
		"main",
		{
			channel: "beta",
			name: "dev",
			prerelease: true,
		},
	],
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
			"semantic-release-github-pullrequest",
			{
				assets: ["docs", "package.json"],
				baseRef: "dev",
				branch: "release-pr-${nextRelease.version}",
				pullrequestTitle: "chore(release): update release ${nextRelease.version}",
				labels: ["release"]
			},
		],
	],
	repositoryUrl: "https://github.com/ElsiKora/ESLint-Config",
};
