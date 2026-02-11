const NodeHelper = require("node_helper")

const getAllDays = (fromDate, toDate) => {
  const allDays = []
  const dateIterator = new Date(fromDate)
  while (dateIterator <= toDate) {
    allDays.push(dateIterator.toISOString().split("T")[0])
    dateIterator.setDate(dateIterator.getDate() + 1)
  }
  return allDays
}

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_TANDOOR_MEALPLAN") {
      const params = new URLSearchParams()
      const fromDate = new Date(Date.now()).toISOString().split("T")[0]
      params.append("from_date", fromDate)
      const toDate = new Date(fromDate)
      toDate.setDate(toDate.getDate() + 7)
      params.append("to_date", toDate)
      const mealplan = fetch(`${payload.url}?${params}`, { headers: { Authorization: payload.token } })
        .results
        .map(({
          title,
          note,
          recipe_name: recipe,
          meal_type_name: mealType,
          servings,
          from_date: fromDate,
          to_date: toDate
        }) => ({
          title,
          note,
          recipe,
          mealType,
          servings,
          fromDate,
          toDate
        }))
        .reduce((prev, mealPlanEntry) => ({
          ...prev,
          ...getAllDays(mealPlanEntry.fromDate, mealPlanEntry.toDate)
            .reduce((prev, day) => {
              prev[day] = {
                title: mealPlanEntry.title,
                recipe: mealPlanEntry.recipe,
                note: mealPlanEntry.note,
                mealType: mealPlanEntry.mealType,
                servings: mealPlanEntry.servings,
              }
            }, {})
        }), {})
      console.debug("Got mealplan from Tandoor", mealplan)
      this.sendSocketNotification("TANDOOR_MEALPLAN", mealplan)
    }
  },
})
