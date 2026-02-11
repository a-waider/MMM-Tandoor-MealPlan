Module.register("MMM-Tandoor-MealPlan", {
  defaults: {
    url: "https://app.tandoor.dev",
    token: undefined,
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["tandoor-mealplan.css"]
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.url = this.config.url
    this.token = this.config.token

    if (this.token === undefined) {
      console.error("Token is required to access to Tandoor API. No requests are made.")
    } else {
      console.info("Started MMM-Tandoor-MealPlan for", this.url)
      this.getTandoorMealplan()
      // set timeout for mealplan update
      setInterval(() => this.getTandoorMealplan(), 60000)
    }
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data`returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "TANDOOR_MEALPLAN") {
      console.debug("Received mealplan from node_helper", payload.mealplan)
      this.mealplan = payload.mealplan
      this.updateDom()
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement("div")
    wrapper.appendChild(document.createElement("b", { innerText: "Tandoor MealPlan" }))
    if (this.mealplan) {
      const table = document.createElement("table")
      for (const day in this.mealplan) {
        const tableRow = document.createElement("tr")
        const localizedDay = new Intl.DateTimeFormat([Intl.DateTimeFormat().resolvedOptions().locale, "en"], { weekday: "long" }).format(new Date(day))
        tableRow.appendChild(document.createElement("td", { innerText: localizedDay }))
        const text = [
          this.mealplan[day].title,
          this.mealplan[day].note,
          this.mealplan[day].recipe,
          this.mealplan[day].mealType,
          this.mealplan[day].servings ? `${this.mealplan[day].servings} ${this.mealplan[day].servingsText ? this.mealplan[day].servingsText : "Servings"}` : undefined,
        ].filter(e => !!e).join("<br>")
        tableRow.appendChild(document.createElement("td", { innerText: text }))
      }
      wrapper.appendChild(table)
    } else {
      wrapper.appendChild(document.createElement("p", { innerText: "Mealplan is not available" }))
    }
    return wrapper
  },

  getTandoorMealplan() {
    this.sendSocketNotification("GET_TANDOOR_MEALPLAN", { url: this.config.url, token: this.config.token })
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(_notification, _payload) {
  },
})
