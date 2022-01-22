<main>
  <div class="input-container">
    <span>Duração da jornada</span>
    <MaskInput class="time-input" value="08:00" mask="00:00" on:change={({ detail }) => setJourney(detail)} />
    {#each turns as _, i}
      <div>
        <span>{i+1}ª entrada</span>
        <MaskInput class="time-input" bind:value={turnValues[i].enter} mask="00:00" on:change={({ detail }) => setTurn(detail, i, 'enter')} />
        <span>{i+1}ª saida</span>
        <MaskInput class="time-input" bind:value={turnValues[i].leave} mask="00:00" on:change={({ detail }) => setTurn(detail, i, 'leave')} />
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
  import MaskInput from "svelte-input-mask";

  interface iMaskInputDetail {
    element: EventTarget & HTMLInputElement;
    inputState: {
      maskedValue: string;
      unmaskedValue: string;
      visibleValue: string;
    };
  }

  const referenceDate = new Date(2022, 0, 6);

  interface turnType {
    enter: Date | false;
    leave: Date | false;
  }

  let baseJourney: Date | false;

  let turns: turnType[] = [
    { enter: false, leave: false },
    { enter: false, leave: false },
  ];

  let turnValues = [
    { enter: '', leave: '' },
    { enter: '', leave: '' },
  ]

  const setTurn = (detail: iMaskInputDetail, index, key) => {
    turns[index][key] = parseToDate(detail.inputState.maskedValue);
  }

  const setJourney = (detail: iMaskInputDetail) => {
    baseJourney = parseToDate(detail.inputState.maskedValue);
  }

  $: timesAreFilled = turns.every(({ enter, leave }) => (enter && leave));

  $: timesAreSequential = () => {
    let last: Date | false = false;
    return turns.every(({ enter, leave }) => {
      if (isBeforeTime(last, enter) && isBeforeTime(enter, leave) && isBeforeTime(last, leave)) {
        last = leave || enter;
        return true;
      }
    })
  }

  $: resultTime = () => {
    if (timesAreSequential() && timesAreFilled) {
      const turnTimes = turns.map(countTurn);
      const baseJourneySeconds = baseJourney && parseSeconds(baseJourney)
      const journeySeconds = turnTimes.reduce((time, acc) => time + acc, 0);
      if (baseJourneySeconds <= journeySeconds) {
        return `+${format(addSeconds(referenceDate, journeySeconds - baseJourneySeconds), 'HH:mm')}`;
      } else {
        return `-${format(addSeconds(referenceDate, baseJourneySeconds - journeySeconds), 'HH:mm')}`;
      }
    }
    return '';
  }

  const addTurn = () => {
    turns = [...turns, { enter: false, leave: false }];
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

  const countTurn = ({ enter, leave }) => {
    if (isValid(enter) && isValid(leave)) {
      return parseSeconds(leave) - parseSeconds(enter);
    }
  };

  const isBeforeTime = (first: Date | false, last: Date | false) => {
    if (first && last) {
      return isBefore(first, last);
    }
    return true;
  };

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