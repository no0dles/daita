<script>
	export let name;
</script>

<main>
	<div class="header">
	</div>
	<div class="title">
		<img src="terminal.svg" class="terminal">

	</div>
	<div class="section">
		<h2>Getting data right</h2>
		<p>
			Lorem ipsum dolor sit amet, consectetur
			adipiscing elit, sed do eiusmod tempor incididunt
			ut labore et dolore magna aliqua. Ut enim ad
			minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat.
		</p>

		<div class="spacer"></div>
		<h2>Getting data right</h2>
		<p>
			Lorem ipsum dolor sit amet, consectetur
			adipiscing elit, sed do eiusmod tempor incididunt
			ut labore et dolore magna aliqua. Ut enim ad
			minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat.
		</p>
	</div>
	<div class="alternate-section">

	</div>
</main>

<style>
	.header {
		width: 100%;
		height: 60px;
		background: #2E3440;
	}
	.section {

	}
	.terminal {
		margin-top: 80px;
	}
	.section {
		background-image: url("/weave.svg");
		background-position-y: -1px;
		background-repeat: no-repeat;
		background-position-x: center;
		background-size: contain;
		width: 100%;
		height: 380px;
		text-align: left;
		padding: 180px 0 0 0;
	}
	.section h2 {
		margin: 0;
		padding: 0 20px;
		margin-bottom: 8px;
		font-weight: 300;
	}
	.section p {
		margin: 0;
		padding: 0 20px;
		font-weight: 100;
	}
	.spacer {
		height: 60px;
	}
	.alternate-section {
		background-color: #ECEFF4;
		background-image: url("/weave-white.svg");
		background-position-y: -1px;
		background-repeat: no-repeat;
		background-position-x: center;
		background-size: contain;
		width: 100%;
		height: 400px;
	}
	.title {
		background: #88C0D0;
		width: 100%;
		height: 200px;
	}
	main {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>