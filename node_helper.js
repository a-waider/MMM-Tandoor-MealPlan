import { getMealPlan } from "./tandoorApi"
const NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_TANDOOR_MEALPLAN") {
      this.sendSocketNotification("TANDOOR_MEALPLAN", getMealPlan(payload.url, payload.token))
    }
  },
})
