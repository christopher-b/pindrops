<script lang="ts">
	import { Menubar } from 'bits-ui';
	import SignoutSvg from '$lib/assets/signout.svg.svelte';
	import UserSvg from '$lib/assets/user.svg.svelte';
	import QuestionSvg from '$lib/assets/question.svg.svelte';
	import pinAreaSvg from '$lib/assets/pin-area.svg';
	import { handle, did, logout } from '$lib/stores/auth.ts';
	import Card from '$lib/components/ui/Card.svelte';

	function onclick() {
		logout();
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
						<Menubar.Item>
							<SignoutSvg />
							<button {onclick} class="label"> Logout </button>
						</Menubar.Item>
					</Menubar.Group>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	</Card>
</nav>

<style>
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
</style>
