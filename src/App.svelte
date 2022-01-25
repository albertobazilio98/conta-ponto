<main>
  <h1>Conta ponto</h1>
  <p>preencha os horarios para calcular qual o seu saldo diário com base na duração da jornada</p>
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

  }
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>