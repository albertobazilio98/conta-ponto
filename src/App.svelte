<main>
  <h1>Conta ponto</h1>
  <ContaPonto />
</main>

<script lang="ts">
  import ContaPonto from './components/ContaPonto.svelte';
</script>


<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
    
    & :global(.time-input) {
      width: 4rem;
    }

  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>