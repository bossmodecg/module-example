import Module from '@bossmodecg/module';

const DEFAULT_CONFIG =
  {
    countInterval: 1000
  };

export default class ExampleModule extends Module {
  constructor(config = {}) {
    super("example", config);

    this.on("internal.registerServer", (server) => {
      this.logger.debug("Registering server callbacks.");

      server.on('internal.beforeRun', () => {
        this.logger.info(`Setting up example counter every ${this.config.countInterval}ms.`);

        setInterval(() => {
          const newCount = (this._state.count || 0) + 1;
          this.setState({ count: newCount });
          this.logger.trace(`Updating count to ${newCount}.`);

          this.emit('count', { count: newCount });
        }, this.config.countInterval);
      });
    });

    this.on("internal.registerHttp", (http) => {
      http.post("/reset", () => {
        this.logger.info("Resetting via synchronous command.");
        this.setState({ count: 0 });
      });
    });

    this.on('reset', () => {
      this.logger.info("Restting via socket.io event.");
      this.setState({ count: 0 });
    });
  }

  /* eslint-disable class-methods-use-this */
  get defaultConfig() { return DEFAULT_CONFIG; }
  /* eslint-enable class-methods-use-this */
}
