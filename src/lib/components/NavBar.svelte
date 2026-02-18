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
					<img src={pinAreaSvg} alt="Pin Icon" />
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
						<!-- <Menubar.Item> -->
						<!-- 	<QuestionSvg /> -->
						<!-- 	What is this? -->
						<!-- </Menubar.Item> -->
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
	/* Navbar container */
	:global([data-menubar-root]) {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
	:global([data-menubar-trigger]) {
		background-color: inherit;
		cursor: pointer;
		border: none;
		padding: 0;
	}
	:global([data-menubar-content]) {
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 50;
	}

	/* Replicate card styles for the dropdown content since we can't easily wrap it */
	:global(.menu-content) {
		background-color: oklch(1 0 0 / 80%);
		color: oklch(0.482 0.0275 277.42);
		border-radius: 10px;
		border: 2px solid oklch(86.9% 0.005 56.366);
		box-shadow: 0 1px 2px oklch(0.9132 0.0224 87.15);
		padding-block: 6px;
		padding-inline: 4px;
		width: fit-content;
	}

	:global([data-menubar-item]) {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 4px 7px;
		border-radius: 3px;
		line-height: 20px;
		font-weight: 600;
		cursor: default;
		transition: all 0.3s ease-out;

		&:not([data-disabled]) {
			cursor: pointer;
			&:hover {
				background-color: oklch(92.3% 0.003 48.717);
			}
		}

		/* svg {
			width: 20px;
			height: 20px;
			transition: all 0.3s ease-out;
		} */

		button {
			background-color: inherit;
			color: inherit;
			padding: 0;
			border: 0;
			font-weight: 600;
			cursor: pointer;
		}
	}
</style>
