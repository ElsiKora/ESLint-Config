export default {
	ci: {
		isEnabled: false,
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
		features: ["eslint", "prettier"],
		isEnabled: true,
	},
	prettier: {
		isEnabled: false,
	},
	"semantic-release": {
		isEnabled: false,
	},
	stylelint: {
		isEnabled: false,
	},
};
