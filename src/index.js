import open from "open"
import yargs from "yargs"
import execa from "execa"

const url = "https://twitch.tv/dashboard"

const job = ({kiosk}) => {
  if (kiosk) {
    execa("chrome", ["--app", url], {
      cleanup: false,
    })
  } else {
    open(url)
  }
}

const builder = {
  kiosk: {
    type: "boolean",
    default: false,
    description: "Opens Chrome in kiosk mode",
  },
}

yargs
  .scriptName(_PKG_NAME)
  .version(_PKG_VERSION)
  .command("$0", "Opens twitch.tv/dashboard in a browser", builder, job).argv