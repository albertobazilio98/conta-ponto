<div class="input-container">
  <MaskInput alwaysShowMask maskChar="_" class="time-input" bind:value={value} mask="00:00" on:change={({ detail }) => setDate(detail)} />
</div>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

  import { parse, isValid, getUnixTime } from 'date-fns';
  import MaskInput from "svelte-input-mask";
  
	const dispatch = createEventDispatcher<{ change: iPontoTime }>();

  interface iMaskInputDetail {
    element: EventTarget & HTMLInputElement;
    inputState: {
      maskedValue: string;
      unmaskedValue: string;
      visibleValue: string;
    };
  }

  export let value: string = '';

  const referenceDate = new Date(2022, 0, 6);

  const setDate = (detail: iMaskInputDetail) => {
    const value = detail.inputState.maskedValue;
    const date = parseToDate(value);
    if (date) {
      dispatch('change', {
        milisseconds: parseSeconds(date),
        value,
        date,
      })
    } else {
      dispatch('change', {
        date: false,
        value,
      })
    }
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
    & :global(.time-input) {
      width: 4rem;
    }
  }
</style>