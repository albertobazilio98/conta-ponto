<main>
  <div class="input-container">
    {#each turns as _, i}
      <div>
        <span>{i+1}ª entrada</span>
        <MaskInput alwaysShowMask maskChar="_" mask="00:00" on:change={(value) => handleChange(value, i, 'enter')} />
        <span>{i+1}ª saida</span>
        <MaskInput alwaysShowMask maskChar="_" mask="00:00" on:change={(value) => handleChange(value, i, 'leave')} />
      </div>
    {/each}
    <button on:click={addTurn}>adicionar turno</button>
    <button on:click={removeTurn}>remover turno</button>
    <div>
      {time()}
    </div>
  </div>
</main>

<script lang="ts">
  import MaskInput from "svelte-input-mask/MaskInput.svelte";
  import { parse, isValid, getUnixTime, format, addSeconds } from 'date-fns'

  const handleChange = ({ detail }, index, key) => {
    turns[index][key] = detail.inputState.maskedValue;
  };

  const addTurn = () => {
    turns = [...turns, { enter: '', leave: '' }];
  }

  const removeTurn = () => {
    turns.pop();
    turns = turns;
  }

  let turns = [
    { enter: '', leave: '' },
    { enter: '', leave: '' },
  ];

  const parseToDate = (time) => (parse(time, 'HH:mm', new Date()));

  const countTurn = ({ enter, leave }) => {
    if (isValid(enter) && isValid(leave)) {
      return getUnixTime(leave) - getUnixTime(enter);
    }
  };

  $: time = () => {
    const turnDates = turns.map(({ enter, leave }) => ({ enter: parseToDate(enter), leave: parseToDate(leave) }));
    const turnTimes = turnDates.map(countTurn);
    if (turnTimes.every((time) => time)) {
      const difference = turnTimes.reduce((time, acc) => time + acc, 0)
      return format(addSeconds(new Date(2022, 0, 6), difference), 'HH:mm')
    }
    // if (dates.every((date) => isValid(date))) {
    //   const timestamps = dates.map((date) => getUnixTime(date));
    //   const difference = - timestamps[0] + timestamps[1] + (- timestamps[2] + timestamps[3]);
    //   return format(addSeconds(new Date(2022, 0, 6), difference), 'HH:mm');
    // }
  }
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