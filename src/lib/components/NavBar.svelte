<script lang="ts">
	import { Menubar } from 'bits-ui';
	import { goto } from '$app/navigation';
	import SignoutSvg from '$lib/assets/signout.svg.svelte';
	import UserSvg from '$lib/assets/user.svg.svelte';
	import QuestionSvg from '$lib/assets/question.svg.svelte';
	import pinAreaSvg from '$lib/assets/pin-area.svg';
	import { handle, did, logout } from '$lib/stores/auth.ts';
	import Card from '$lib/components/ui/Card.svelte';

	let showViewInput = $state(false);
	let viewHandle = $state('');

	function onclick() {
		logout();
	}

	function onViewUser() {
		showViewInput = !showViewInput;
	}

	function onViewSubmit(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = viewHandle.trim().replace(/^@/, '');
		if (!trimmed) return;

		showViewInput = false;
		viewHandle = '';
		goto(`/view/${encodeURIComponent(trimmed)}`);
	}

	function onViewKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			showViewInput = false;
			viewHandle = '';
		}
	}
</script>

<nav>
	<Card>
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>
					<img src={pinAreaSvg} alt="Menu" />
				</Menubar.Trigger>
				<Menubar.Content class="menu-content" align="end" sideOffset={11} alignOffset={-5}>
					<Menubar.Group>
						<Menubar.Item disabled>
							<UserSvg />
							{#if $handle}
								<strong title={$did}>{$handle}</strong>
							{:else}
								<em>Loading...</em>
							{/if}
						</Menubar.Item>
						<Menubar.Item onSelect={onViewUser}>
							<QuestionSvg />
							<span class="label">View User</span>
						</Menubar.Item>
						<Menubar.Item>
							<SignoutSvg />
							<button {onclick} class="label"> Logout </button>
						</Menubar.Item>
					</Menubar.Group>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	</Card>

	{#if showViewInput}
		<Card>
			<form class="view-form" onsubmit={onViewSubmit}>
				<input
					type="text"
					class="view-input"
					bind:value={viewHandle}
					onkeydown={onViewKeydown}
					placeholder="user.bsky.social"
				/>
				<button type="submit" class="btn-go" disabled={!viewHandle.trim()}>Go</button>
			</form>
		</Card>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		align-items: flex-end;
	}

	:global([data-menubar-root]) {
		display: flex;
		flex-direction: row;
		gap: var(--s-2);
	}

	:global([data-menubar-trigger]) {
		background-color: transparent;
		cursor: pointer;
		border: none;
		padding: 2px;
		border-radius: 6px;
		transition: var(--btn-transition);
		display: flex;
		align-items: center;
	}

	:global([data-menubar-trigger]:hover) {
		background-color: oklch(0.9 0.01 60 / 50%);
	}

	:global([data-menubar-content]) {
		display: flex;
		flex-direction: column;
		gap: 4px;
		z-index: 50;
	}

	:global(.menu-content) {
		background-color: var(--surface-bg);
		backdrop-filter: blur(var(--surface-blur));
		-webkit-backdrop-filter: blur(var(--surface-blur));
		color: var(--color-text);
		border-radius: var(--surface-radius);
		border: 1.5px solid var(--surface-border);
		box-shadow: var(--surface-shadow);
		padding-block: var(--s-3);
		padding-inline: var(--s-3);
		width: fit-content;
		min-width: 180px;
	}

	:global([data-menubar-item]) {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-3) var(--s-2);
		border-radius: 6px;
		line-height: 20px;
		font-weight: 500;
		font-size: var(--font-sm);
		cursor: default;
		transition: var(--btn-transition);

		&:not([data-disabled]) {
			cursor: pointer;
			&:hover {
				background-color: oklch(0.9 0.02 155 / 30%);
			}
		}

		&[data-disabled] {
			opacity: 0.7;
		}

		button {
			background-color: transparent;
			color: inherit;
			padding: 0;
			border: 0;
			font-weight: 500;
			cursor: pointer;
		}
	}

	.view-form {
		display: flex;
		gap: var(--s-4);
		padding: var(--s-4) var(--s-3);
	}

	.view-input {
		flex: 1;
		padding: var(--s-4) var(--s-3);
		border: 1.5px solid var(--color-border);
		border-radius: var(--btn-radius);
		font-size: var(--font-xs);
		font-family: var(--font-body);
		color: var(--color-text);
		background: white;
		outline: none;
		min-width: 160px;
	}

	.view-input:focus {
		border-color: var(--color-accent-med-light);
		box-shadow: 0 0 0 2px oklch(from var(--color-accent-light) l c h / 40%);
	}

	.view-input::placeholder {
		color: var(--color-neutral-400);
	}

	.btn-go {
		padding: var(--s-4) var(--s-2);
		background: var(--color-accent-med);
		color: var(--color-accent-light);
		border: none;
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 600;
		font-size: var(--font-xs);
		transition: var(--btn-transition);
	}

	.btn-go:hover:not(:disabled) {
		background: var(--color-accent-dark);
	}

	.btn-go:disabled {
		background: var(--color-neutral-300);
		color: var(--color-neutral-500);
		cursor: not-allowed;
	}
</style>
