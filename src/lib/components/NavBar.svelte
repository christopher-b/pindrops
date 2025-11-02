<script lang="ts">
	import { Menubar } from 'bits-ui';
	import SignoutSvg from '$lib/assets/signout.svg.svelte';
	import UserSvg from '$lib/assets/user.svg.svelte';
	import QuestionSvg from '$lib/assets/question.svg.svelte';
	import pinAreaSvg from '$lib/assets/pin-area.svg';
	import { handle, did, logout } from '$lib/stores/auth.ts';
	function onclick() {
		logout();
	}
</script>

<nav>
	<Menubar.Root class="card">
		<Menubar.Menu>
			<Menubar.Trigger>
				<img src={pinAreaSvg} alt="Pin Icon" />
			</Menubar.Trigger>
			<Menubar.Content class="card" align="end" sideOffset={11} alignOffset={-5}>
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
</nav>
