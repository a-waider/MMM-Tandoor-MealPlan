const NodeHelper = require("node_helper")

const getAllDays = (fromDate, toDate) => {
  const allDays = []
  const dateIterator = new Date(fromDate)
  while (dateIterator <= new Date(toDate)) {
    allDays.push(dateIterator.toISOString().split("T")[0])
    dateIterator.setDate(dateIterator.getDate() + 1)
  }
  return allDays
}

const parseMealPlan = (mealplan) => {
  return mealplan
    .results
    .map(({
      title,
      note,
      recipe_name: recipe,
      meal_type_name: mealType,
      servings,
      servings_text: servingsText,
      from_date: fromDate,
      to_date: toDate
    }) => ({
      title,
      note,
      recipe,
      mealType,
      servings,
      servingsText,
      fromDate,
      toDate
    }))
    .reduce((prev, mealPlanEntry) => {
      getAllDays(mealPlanEntry.fromDate, mealPlanEntry.toDate)
        .forEach((day) => {
          if (!prev[day]) {
            prev[day] = []
          }
          prev[day].push({
            title: mealPlanEntry.title,
            recipe: mealPlanEntry.recipe,
            note: mealPlanEntry.note,
            mealType: mealPlanEntry.mealType,
            servings: mealPlanEntry.servings,
            servingsText: mealPlanEntry.servingsText,
          })
        })
      return prev
    }, {})
}

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_TANDOOR_MEALPLAN") {
      const params = new URLSearchParams()
      const fromDate = new Date(Date.now()).toISOString().split("T")[0]
      params.append("from_date", fromDate)
      const toDate = new Date(fromDate)
      toDate.setDate(toDate.getDate() + 7)
      params.append("to_date", toDate.toISOString().split("T")[0])
      const mealPlanRequest = `${payload.url}/api/meal-plan?${params}`
      console.debug("Fetching mealplan at", mealPlanRequest)
      try {
        const response = await fetch(mealPlanRequest, { headers: { Authorization: payload.token } })
        const mealplan = parseMealPlan(response.json())
        console.debug("Got mealplan from Tandoor", mealplan)
        this.sendSocketNotification("TANDOOR_MEALPLAN", mealplan)
      } catch (error) {
        console.error("Failed to fetch Tandoor mealplan", error)
      }
    }
  },
})
