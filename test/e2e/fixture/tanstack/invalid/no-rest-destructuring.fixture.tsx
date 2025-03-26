import { useQuery } from "@tanstack/react-query";

export function UserProfile({ userId }) {
	const { data, isLoading, ...rest } = useQuery({
		queryKey: ["user", userId],
		queryFn: async () => {
			const response = await fetch(`/api/users/${userId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}
			return response.json();
		},
	});

	return (
		<div>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<h1>{data.name}</h1>
					<p>Status: {rest.status}</p>
				</>
			)}
		</div>
	);
}
