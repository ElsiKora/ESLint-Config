export default {
	branches: {
		bugfix: { description: "🆕 Integration of new functionality", title: "Feature" },
		feature: { description: "🐞 Fixing issues in existing functionality", title: "Bugfix" },
		hotfix: { description: "🚑 Critical fixes for urgent issues", title: "Hotfix" },
		release: { description: "📦 Preparing a new release version", title: "Release" },
		support: { description: "🛠️ Support and maintenance tasks", title: "Support" },
	},
	ignore: ["dev"],
	rules: {
		"branch-max-length": 50,
		"branch-min-length": 5,
		"branch-pattern": ":type/:name",
		"branch-prohibited": ["main", "master", "release"],
		"branch-subject-pattern": "[a-z0-9-]+",
	},
};
