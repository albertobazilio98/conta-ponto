<main>
  <div class="continer">
    <MaskInput alwaysShowMask class="time-input" maskChar="_" mask="00:00" on:change={(value) => handleChange(value, 0)} />
    <MaskInput alwaysShowMask class="time-input" maskChar="_" mask="00:00" on:change={(value) => handleChange(value, 1)} />
    <MaskInput alwaysShowMask class="time-input" maskChar="_" mask="00:00" on:change={(value) => handleChange(value, 2)} />
    <MaskInput alwaysShowMask class="time-input" maskChar="_" mask="00:00" on:change={(value) => handleChange(value, 3)} />
    {time()}
  </div>
</main>

<script lang="ts">
  import MaskInput from "svelte-input-mask/MaskInput.svelte";
  import { parse, isValid, getUnixTime, fromUnixTime, format, addSeconds } from 'date-fns'

  const handleChange = ({ detail }, index) => {
    times[index] = detail.inputState.maskedValue
  };

  let times = [
    '',
    '',
    '',
    '',
  ]

  $: time = () => {
    const dates = times.map((time) => parse(time, 'HH:mm', new Date()))
    if (dates.every((date) => isValid(date))) {
      const timestamps = dates.map((date) => getUnixTime(date))
      const difference = - timestamps[0] + timestamps[1] + (- timestamps[2] + timestamps[3])
      return format(addSeconds(new Date(2022, 0, 6), difference), 'HH:mm')
    }
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