class MetricsCollector {
  constructor() {
    this.metrics = new Map();
  }

  increment(metric, value = 1, tags = {}) {
    const key = `${metric}:${JSON.stringify(tags)}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + value);
  }

  gauge(metric, value, tags = {}) {
    const key = `${metric}:${JSON.stringify(tags)}`;
    this.metrics.set(key, value);
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}
export const metrics = new MetricsCollector();