import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
	loader: async ({ params }) => {
		const { userId } = params;
		const user = await fetchUser(userId);
		return { user };
	},
	component: UserComponent,
	validateSearch: (search) => {
		return {
			tab: search?.tab || "profile",
		};
	},
});

function UserComponent() {
	return <div>User Component</div>;
}

async function fetchUser(userId) {
	return { id: userId, name: "John Doe" };
}
