document.addEventListener("alpine:init", () => {
  Alpine.data("dashboard", () => {
    let charts = {
      dailyViews: {
        type: "line",
        labels: [],
        items: [],
      },
      mostViewedPathnames: {
        type: "bar",
        labels: [],
        items: [],
      }
    }

    let setupChart = () => {
      Chart.defaults.animation = false
      Chart.defaults.maintainAspectRatio = false
      Chart.defaults.plugins.legend.display = false
    }

    const THIS_DAY = 1
    const THIS_WEEK = 2
    const THIS_MONTH = 3
    const DATE_RANGE = 4

    return {
      db: null,
      projectId: "",
      publicApiKey: "",
      viewData: [],
      uniqueHostnames: [],
      mostViewedPathnames: [],
      currentHostname: "",
      viewCount: 0,
      currentDateRange: [],
      dailyViews: [],
      charts,

      init() {
        setupChart()
        this.db = supabase.createClient(
          `https://${this.projectId}.supabase.co`,
          this.publicApiKey,
        );
        this.signInUser("", "");
        this.getUniqueHostnames();
        Alpine.effect(async () => {
          if (!this.currentHostname) {
            return
          }
          this.viewData = await this.getViewData(this.currentHostname);
          this.viewCount = await this.getTotalViewCount(
            this.currentHostname,
          );
          this.mostViewedPathnames = await this.getMostViewedPaths(
            this.currentHostname,
          );
          this.charts.mostViewedPathnames.labels = this.mostViewedPathnames.map((i) => i.pathname)
          this.charts.mostViewedPathnames.items = this.mostViewedPathnames.map((i) => i.views)
          this.dailyViews = await this.getDailyViews(this.currentHostname)
          this.charts.dailyViews.labels = this.dailyViews.map((i) => i.date)
          this.charts.dailyViews.items = this.dailyViews.map((i) => i.views)
        });
      },
      async signInUser(email, password) {
        const { data, error } = await this.db.auth.signInWithPassword({
          email,
          password,
        });
      },
      addDateRangeToQuery(query, column) {
        if (this.currentDateRange[0]) {
          query = query.gte(column, this.currentDateRange[0]);
        }
        if (this.currentDateRange[1]) {
          query = query.lte(column, this.currentDateRange[1]);
        }
      },
      async getUniqueHostnames() {
        const { data, error } = await this.db.from("unique_hostnames").select();
        this.uniqueHostnames = data;
      },
      async getViewData(hostname) {
        let query = this.db
          .from("simple_analytics")
          .select()
          .eq("hostname", hostname);

        this.addDateRangeToQuery(query, "timestamp")

        const { data, error } = await query;

        return data;
      },
      async getTotalViewCount(hostname) {
        let query = this.db
          .from("simple_analytics")
          .select("*", { count: "exact", head: true })
          .eq("hostname", hostname);

        const { count, error } = await query

        return count;
      },
      async getMostViewedPaths(hostname) {
        let query = this.db
          .from("most_viewed_pathnames")
          .select()
          .eq("hostname", hostname);

        const { data, error } = await query

        return data;
      },
      async getDailyViews(hostname) {
        let query = this.db
          .from("daily_views_for_hostname")
          .select()
          .eq("hostname", hostname)

        this.addDateRangeToQuery(query, "date")

        const { data, error } = await query

        return data
      }
    };
  });
});
