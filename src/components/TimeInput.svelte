<div class="input-container">
  <label class="input-label" for={id}>{label}</label>
  <MaskInput id={id} alwaysShowMask maskChar="_" class="time-input" bind:value={value} mask="00:00" on:change={({ detail }) => setDate(detail)} />
</div>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

  import { parse, isValid, getUnixTime } from 'date-fns';
  import MaskInput from "svelte-input-mask";
  
	const dispatch = createEventDispatcher<{ timeChange: iPontoTime }>();

  interface iMaskInputDetail {
    element: EventTarget & HTMLInputElement;
    inputState: {
      maskedValue: string;
      unmaskedValue: string;
      visibleValue: string;
    };
  }

  export let value: string = '';
  export let id: string;
  export let label: string = '';

  let ponto: iPontoTime = {
    date: false,
    value,
  };

  const referenceDate = new Date(2022, 0, 6);

  const setDate = (detail: iMaskInputDetail) => {
    console.log('chamo aqui')
    const value = detail.inputState.maskedValue;
    const date = parseToDate(value);
    ponto = {
      milisseconds: date && parseSeconds(date),
      value,
      date,
    }
    dispatch('timeChange', ponto)
  }

  const parseToDate = (time: string): Date | false => {
    const date = parse(time, 'HH:mm', referenceDate);
    return isValid(date) && date;
  };

  const parseSeconds = (date: Date) => (getUnixTime(date) - getUnixTime(referenceDate))

</script>


<style lang="scss">
  .input-container {
    display: inline-block;

    .input-label {
      display: inline-block;
    }

    & :global(.time-input) {
      width: 4rem;
    }
  }
</style>