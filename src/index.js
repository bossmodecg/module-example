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

  async _doRegister() {
    this.server.on('beforeRun', () => {
      this.logger.debug("beforeRun hit.");
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
