document.addEventListener("alpine:init", () => {
  Alpine.data("chart", () => {
    let canvas = null
    let chart = null
    let config = {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
          }
        ]
      },
      options: {},
    }

    return {
      init() {
        canvas = this.$el.querySelector("canvas")
        this.$nextTick(() => {
          Alpine.effect(() => {
            config.type = Alpine.bound(this.$el, "data-type") ?? config.type
            chart?.destroy()
            this.createChart()
          })
          Alpine.effect(() => {
            config.data.labels = Alpine.bound(this.$el, "data-labels")
            config.data.datasets[0].data = Alpine.bound(this.$el, "data-items")
            chart.update()
          })
          Alpine.effect(() => {
            config.options = Alpine.bound(this.$el, "data-options")
            chart.update()
          })
        })
      },
      createChart() {
        chart = new Chart(
          canvas,
          config,
        )
      }
    }
  })
})
