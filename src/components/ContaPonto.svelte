<div class="conta-ponto">
  <TimeInput
    label="Duração da jornada"
    id="base-journey-input"
    bind:value={baseJourney.value}
    on:timeChange={({ detail }) => setJourney(detail)}
  />
  <div class="input-container">
    {#each turns as _, i}
      <div class="turn-container">
        <TimeInput
          label={`${i+1}ª entrada`}
          id={`journey-enter-${i}`}
          bind:value={turns[i].enter.value}
          on:timeChange={({ detail }) => setTurn(detail, i, 'enter')}
        />
        <TimeInput
          label={`${i+1}ª saida`}
          id={`journey-leave-${i}`}
          bind:value={turns[i].leave.value}
          on:timeChange={({ detail }) => setTurn(detail, i, 'leave')}
        />
      </div>
    {/each}
  </div>
  {#if !timesAreSequential()}
    <span data-testid="error-times-are-not-sequential" class="error">horários invalidos</span>
  {/if}
  <div class="actions-container">
    <button data-testid="add-turn" on:click={addTurn}>adicionar turno</button>
    <button data-testid="remove-turn" on:click={removeTurn}>remover turno</button>
  </div>
  <p class="time-balance">
    saldo:
    {#if timeBalance()}
      <span data-testid="time-balance">{timeBalance()}</span>
    {/if}
  </p>
</div>

<script lang="ts">
  import { parse, isValid, getUnixTime, format, addSeconds, isBefore } from 'date-fns';
  import TimeInput from './TimeInput.svelte'
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
    seconds: parseSeconds(parseToDate('08:00') as Date)
  }

  let turns: turnType[] = [
    { enter: empityField, leave: empityField },
    { enter: empityField, leave: empityField },
  ];

  const setTurn = (value: iPontoTime, index, key) => {
    turns[index][key] = value;
  }

  const setJourney = (value: iPontoTime) => {
    baseJourney = value;
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

  $: timeBalance = () => {
    if (timesAreSequential() && timesAreFilled) {
      const turnTimes = turns.map(({leave, enter}) => leave.seconds - enter.seconds);
      const journeySeconds = turnTimes.reduce((time, acc) => time + acc, 0);
      if (baseJourney.seconds <= journeySeconds) {
        return `+${format(addSeconds(referenceDate, journeySeconds - baseJourney.seconds), 'HH:mm')}`;
      } else {
        return `-${format(addSeconds(referenceDate, baseJourney.seconds - journeySeconds), 'HH:mm')}`;
      }
    }
    return '';
  }

</script>


<style lang="scss">
  .conta-ponto {
    .time-balance {
      font-size: 1.25rem;
      font-weight: 500;
    }

    .input-container {
      padding: 1rem;

      .turn-container {
        margin: 0.5rem;
      }
    }

    .actions-container {
      padding: 0.5rem;
    }
  }
</style>