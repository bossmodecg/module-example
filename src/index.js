import _ from 'lodash';

import BossmodeCG from '@bossmodecg/core';

const DEFAULT_CONFIG =
  {
    countInterval: 1000
  };

export default class ExampleModule extends BossmodeCG.BModule {
  constructor(config) {
    super("example", _.merge({}, DEFAULT_CONFIG, config));
  }

  async _doRegister(server, http) {
    this.server.on('beforeRun', () => {
      this.logger.debug("beforeRun hit.");
    });

    this.on('reset', () => {
      this.logger.info("Restting via socket.io event.");
      this.setState({ count: 0 });
    });

    http.post("/reset", () => {
      this.logger.info("Resetting via synchronous command.");
      this.setState({ count: 0 });
    });


    this.logger.info(`Setting up example counter every ${this.config.countInterval}ms.`);
    setInterval(() => {
      const newCount = (this._state.count || 0) + 1;
      this.setState({ count: newCount });
      this.logger.trace(`Updating count to ${newCount}.`);

      this.emit('count', { count: newCount });
    }, this.config.countInterval);
  }
}
