import humanizeDuration from "humanize-duration"

export default humanizeDuration.humanizer({
  language: "de",
  conjunction: " und dann noch mal ",
  serialComma: false,
  maxDecimalPoints: 0,
})