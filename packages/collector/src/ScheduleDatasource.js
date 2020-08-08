const fs = require('fs');
const path = require('path');

const defaultSettingsFileUrl = path.resolve(__dirname, '..', '.settings.json');

const scheduleEverySync = Symbol('scheduleEverySync');
const save = Symbol('save');

class ScheduleDatasource {
  constructor(settingsFileUrl = defaultSettingsFileUrl) {
    this.settingsFileUrl = settingsFileUrl;
    this.setEvery = this.setEvery.bind(this);
    this.fetch = this.fetch.bind(this);
    this.set = this.set.bind(this);
    this[save] = this[save].bind(this);
    this[scheduleEverySync] = this[scheduleEverySync].bind(this);
    if (!fs.existsSync(settingsFileUrl)) {
      this[scheduleEverySync](2);
    }
  }

  /** @returns {Promise<number[]>} */
  fetch() {
    return new Promise((res, rej) => {
      fs.readFile(this.settingsFileUrl, { encoding: 'utf-8' }, (err, data) => {
        if (err) return rej(err);
        return res(JSON.parse(data));
      });
    });
  }

  /**
   * @private
   * @param {number[]} data
   */
  [save](data) {
    const samples = data.map(Math.floor);
    const contentString = JSON.stringify(samples);
    return fs.writeFile(
      this.settingsFileUrl,
      contentString,
      {
        encoding: 'utf-8',
      },
      null
    );
  }

  /**
   * Divide the day into {n} sections. Completely overrides the current schedule!
   *
   * @param {number} n An integer
   */
  setEvery(n) {
    const samples = new Array(24 / n).fill(0).map((_, ii) => ii * 2);
    return this[save](samples);
  }

  /**
   * Same as scheduleEvery but sync, for bootstrapping no file was found
   *
   * @private
   * @param {number} n An integer
   */
  [scheduleEverySync](n) {
    const samples = new Array(24 / n).fill(0).map((_, ii) => ii * 2);
    fs.writeFileSync(this.settingsFileUrl, JSON.stringify(samples), {
      encoding: 'utf-8',
    });
  }
  /**
   * Set sampling hours. Completely overrides the current schedule!
   *
   * @param {number[]} samples
   */
  set(samples) {
    return this[save](samples);
  }
}

module.exports = ScheduleDatasource;
