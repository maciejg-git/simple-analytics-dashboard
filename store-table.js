document.addEventListener("alpine:init", () => {
  Alpine.store("table", {
    definition: [
      {
        key: "url",
        sortable: true,
      },
      {
        key: "hostname",
        sortable: true,
      },
      {
        key: "pathname",
        sortable: true,
      },
      {
        key: "timestamp",
        sortable: true,
      },
      {
        key: "referrer",
        sortable: true,
      },
      {
        key: "user_agent",
        sortable: true,
      },
      {
        key: "detail",
      },
    ]
  })
})
