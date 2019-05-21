import afkManager from "lib/afkManager"

export default {
  permission: "mod",
  async handle() {
    if (!afkManager.isAfk()) {
      return "Jaidchen ist doch gar nicht weg. PunOko"
    }
    await afkManager.deactivate()
  },
}