<main>
  <div class="input-container">
    <span>Duração da jornada</span>
    <input type="time" bind:value={baseJourney}>
    {#each turns as _, i}
      <div>
        <span>{i+1}ª entrada</span>
        <input type="time" bind:value={turns[i].enter} >
        <span>{i+1}ª saida</span>
        <input type="time" bind:value={turns[i].leave} >
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

  const referenceDate = new Date(2022, 0, 6);

  interface turnType {
    enter: string;
    leave: string;
  }
  interface turnDateType {
    enter: Date | false;
    leave: Date | false;
  }

  let baseJourney = '08:00';

  const addTurn = () => {
    turns = [...turns, { enter: '', leave: '' }];
  };

  const removeTurn = () => {
    turns.pop();
    turns = turns;
  };

  let turns: turnType[] = [
    { enter: '', leave: '' },
    { enter: '', leave: '' },
  ];

  const parseToDate = (time: string): Date | false => {
    const date = parse(time, 'HH:mm', referenceDate);
    return isValid(date) && date;
  };

  const parseSeconds = (date: Date) => (getUnixTime(date) - getUnixTime(referenceDate))

  const countTurn = ({ enter, leave }) => {
    if (isValid(enter) && isValid(leave)) {
      return parseSeconds(leave) - parseSeconds(enter);
    }
  };

  const timesAreFilled = (turns: turnDateType[]) => turns.every(({ enter, leave }) => (enter && leave));

  const isBeforeTime = (first: Date | false, last: Date | false) => {
    if (first && last) {
      return isBefore(first, last);
    }
    return true;
  };

  $: timesAreSequential = () => {
    let last: Date | false = false;
    return turnDates.every(({ enter, leave }) => {
      if (isBeforeTime(last, enter) && isBeforeTime(enter, leave) && isBeforeTime(last, leave)) {
        last = leave || enter;
        return true;
      }
    })
  }
  
  $: turnDates = turns.map(({ enter, leave }) => ({ enter: parseToDate(enter), leave: parseToDate(leave) }));

  $: baseJourneyDate = parseToDate(baseJourney);

  $: resultTime = () => {
    if (timesAreSequential() && timesAreFilled(turnDates)) {
      const turnTimes = turnDates.map(countTurn);
      const baseJourneySeconds = baseJourneyDate && parseSeconds(baseJourneyDate)
      const journeySeconds = turnTimes.reduce((time, acc) => time + acc, 0);
      if (baseJourneySeconds <= journeySeconds) {
        return `+${format(addSeconds(referenceDate, journeySeconds - baseJourneySeconds), 'HH:mm')}`;
      } else {
        return `-${format(addSeconds(referenceDate, baseJourneySeconds - journeySeconds), 'HH:mm')}`;
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
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>