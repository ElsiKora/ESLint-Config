import { useInfiniteQuery } from "@tanstack/react-query";

export function InfinitePostsList() {
	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		queryKey: ["posts"],
		initialPageParam: 0,
		queryFn: async ({ pageParam }) => {
			const res = await fetch(`/api/posts?cursor=${pageParam}`);
			return res.json();
		},
	});

	return (
		<div>
			<h1>Posts</h1>
			{status === "pending" ? (
				<p>Loading...</p>
			) : status === "error" ? (
				<p>Error loading posts</p>
			) : (
				<>
					{data.pages.map((page, i) => (
						<div key={i}>
							{page.posts.map((post) => (
								<div key={post.id}>{post.title}</div>
							))}
						</div>
					))}
					<button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
						{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
					</button>
					<div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
				</>
			)}
		</div>
	);
}
