import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function UserProfile({ userId }) {
	const query = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}
			return response.json();
		},
	});

	useEffect(() => {
		console.log("User data changed:", query.data);
	}, [query]);

	if (query.isLoading) return <div>Loading...</div>;
	if (query.error) return <div>Error: {query.error.message}</div>;

	return (
		<div>
			<h1>{query.data.name}</h1>
			<p>Email: {query.data.email}</p>
		</div>
	);
}
