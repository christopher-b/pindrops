<script lang="ts">
	import { page } from '$app/stores';
	import { Agent } from '@atproto/api';
	import { CUSTOM_NSID, type CustomPost } from '$lib/atproto/schema';
	import { onMount } from 'svelte';

	let posts: CustomPost[] = [];
	let loading = true;
	let error = '';

	$: did = $page.params.did;

	async function loadPublicPosts() {
		loading = true;
		error = '';

		try {
			// Create agent without authentication for public data
			const agent = new Agent({ service: 'https://bsky.social' });

			const response = await agent.com.atproto.repo.listRecords({
				repo: did,
				collection: CUSTOM_NSID,
				limit: 50
			});

			posts = response.data.records.map(r => r.value as CustomPost);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load posts';
			console.error('Load public posts error:', e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadPublicPosts();
	});
</script>

<div class="profile">
	<h1>Public Profile</h1>
	<p>DID: {did}</p>

	{#if loading}
		<p>Loading posts...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<div class="posts">
			<h2>Posts</h2>
			{#each posts as post}
				<div class="post">
					<p>{post.text}</p>
					<small>{new Date(post.createdAt).toLocaleString()}</small>
				</div>
			{:else}
				<p>No posts found</p>
			{/each}
		</div>
	{/if}
</div>

<style>
	.profile {
		max-width: 800px;
		margin: 0 auto;
	}

	.posts {
		margin-top: 2rem;
	}

	.post {
		padding: 1rem;
		margin: 1rem 0;
		border: 1px solid #eee;
		border-radius: 4px;
	}

	.error {
		color: red;
	}
</style>
