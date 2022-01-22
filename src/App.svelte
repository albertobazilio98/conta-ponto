<main>
  <div class="input-container">
    <span>Duração da jornada</span>
    <TimeInput value="08:00" on:change={({ detail }) => setJourney(detail)} />
    {#each turns as _, i}
      <div>
        <span>{i+1}ª entrada</span>
        <TimeInput bind:value={turns[i].enter.value} on:change={({ detail }) => setTurn(detail, i, 'enter')} />
        <span>{i+1}ª saida</span>
        <TimeInput bind:value={turns[i].leave.value} on:change={({ detail }) => setTurn(detail, i, 'leave')} />
      </div>
    {/each}
    {#if !timesAreSequential()}
      <span class="error">horários invalidos</span>
    {/if}
    <div>
      <button on:click={addTurn}>adicionar turno</button>
      <button on:click={removeTurn}>remover turno</button>
    </div>
    <div>
      {resultTime()}
    </div>
  </div>
</main>

<script lang="ts">
  import { parse, isValid, getUnixTime, format, addSeconds, isBefore } from 'date-fns';
  import TimeInput from './components/TimeInput.svelte'
  interface turnType {
    enter: iPontoTime;
    leave: iPontoTime;
  }

  const referenceDate = new Date(2022, 0, 6);

  const empityField: iPontoTime = {
    value: '',
    date: false,
  };


  const addTurn = () => {
    turns = [...turns, { enter: empityField, leave: empityField }];
  };

  const removeTurn = () => {
    turns.pop();
    turns = turns;
  };

  const parseToDate = (time: string): Date | false => {
    const date = parse(time, 'HH:mm', referenceDate);
    return isValid(date) && date;
  };

  const parseSeconds = (date: Date) => (getUnixTime(date) - getUnixTime(referenceDate))

  const isBeforeTime = (first: iPontoTime, last: iPontoTime) => {
    if (first.date && last.date) {
      return isBefore(first.date, last.date);
    }
    return true;
  };

  let baseJourney: iPontoTime = {
    date: parseToDate('08:00'),
    value: '08:00',
    milisseconds: parseSeconds(parseToDate('08:00') as Date)
  }

  let turns: turnType[] = [
    { enter: empityField, leave: empityField },
    { enter: empityField, leave: empityField },
  ];

  const setTurn = (value: iPontoTime, index, key) => {
    turns[index][key] = value
  }

  const setJourney = (value: iPontoTime) => {
    baseJourney = value
  }

  $: timesAreFilled = turns.every(({ enter, leave }) => (enter.date && leave.date));

  $: timesAreSequential = () => {
    let last: iPontoTime = empityField;
    return turns.every(({ enter, leave }) => {
      if (isBeforeTime(last, enter) && isBeforeTime(enter, leave) && isBeforeTime(last, leave)) {
        last = leave.date? leave : enter;
        return true;
      }
    })
  }

  $: resultTime = () => {
    if (timesAreSequential() && timesAreFilled) {
      const turnTimes = turns.map(({leave, enter}) => leave.milisseconds - enter.milisseconds);
      const journeySeconds = turnTimes.reduce((time, acc) => time + acc, 0);
      if (baseJourney.milisseconds <= journeySeconds) {
        return `+${format(addSeconds(referenceDate, journeySeconds - baseJourney.milisseconds), 'HH:mm')}`;
      } else {
        return `-${format(addSeconds(referenceDate, baseJourney.milisseconds - journeySeconds), 'HH:mm')}`;
      }
    }
    return '';
  }

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