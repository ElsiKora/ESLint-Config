import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<UserList />
		</QueryClientProvider>
	);
}

function UserList() {
	return <div>User List Component</div>;
}
