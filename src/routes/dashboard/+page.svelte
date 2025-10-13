<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { getOAuthClient } from '$lib/atproto/client';
	import { goto } from '$app/navigation';
	import { CUSTOM_NSID, type CustomPost } from '$lib/atproto/schema';
	import { Agent } from '@atproto/api';

	let postText = '';
	let posts: CustomPost[] = [];
	let isSubmitting = false;
	let error = '';

	// $: if (!$authStore.session) {
	// 	goto('/login');
	// }

	// async function createPost() {
	// 	if (!postText.trim() || !$authStore.session) return;
	//
	// 	isSubmitting = true;
	// 	error = '';
	//
	// 	try {
	// 		const agent = new Agent($authStore.session);
	//
	// 		const record: CustomPost = {
	// 			text: postText,
	// 			createdAt: new Date().toISOString(),
	// 			tags: []
	// 		};
	//
	// 		await agent.com.atproto.repo.createRecord({
	// 			repo: $authStore.session.did,
	// 			collection: CUSTOM_NSID,
	// 			record
	// 		});
	//
	// 		postText = '';
	// 		await loadPosts();
	// 	} catch (e) {
	// 		error = e instanceof Error ? e.message : 'Failed to create post';
	// 		console.error('Create post error:', e);
	// 	} finally {
	// 		isSubmitting = false;
	// 	}
	// }
	//
	// async function loadPosts() {
	// 	if (!$authStore.session) return;
	//
	// 	try {
	// 		const agent = new Agent($authStore.session);
	//
	// 		const response = await agent.com.atproto.repo.listRecords({
	// 			repo: $authStore.session.did,
	// 			collection: CUSTOM_NSID,
	// 			limit: 50
	// 		});
	//
	// 		posts = response.data.records.map(r => r.value as CustomPost);
	// 	} catch (e) {
	// 		console.error('Load posts error:', e);
	// 	}
	// }
	//
	async function handleLogout() {
		const client = getOAuthClient();
		if (client && $authStore.session) {
			await client.revoke($authStore.session.did);
		}
		authStore.logout();
		goto('/');
	}

	// loadPosts();
</script>

<div class="dashboard">
	<div class="header">
		<h1>Dashboard</h1>
		<button on:click={handleLogout}>Logout</button>
	</div>

	{#if $authStore.session}
		<p>Logged in as: <strong>{$authStore.session.did}</strong></p>

		<div class="create-post">
			<h2>Create Post</h2>
			<textarea
				bind:value={postText}
				placeholder="What's on your mind?"
				disabled={isSubmitting}
      >
			</textarea>
			<button on:click={createPost} disabled={isSubmitting || !postText.trim()}>
				{isSubmitting ? 'Posting...' : 'Post'}
			</button>
			{#if error}
				<p class="error">{error}</p>
			{/if}
		</div>

		<div class="posts">
			<h2>Your Posts</h2>
			{#each posts as post}
				<div class="post">
					<p>{post.text}</p>
					<small>{new Date(post.createdAt).toLocaleString()}</small>
				</div>
			{:else}
				<p>No posts yet</p>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dashboard {
		max-width: 800px;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.create-post {
		margin: 2rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	textarea {
		width: 100%;
		min-height: 100px;
		padding: 0.5rem;
		margin: 1rem 0;
		border: 1px solid #ccc;
		border-radius: 4px;
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
		margin-top: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: #0085ff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}
</style>
