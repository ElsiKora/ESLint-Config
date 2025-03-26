import { useQuery } from "@tanstack/react-query";

export function UserProfile({ userId }) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}
			return response.json();
		},
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h1>{data.name}</h1>
			<p>Email: {data.email}</p>
		</div>
	);
}
