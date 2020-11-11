const DataSource = jest.requireActual('./../dataSource');

class SamplesDatasource extends DataSource {
  async writeSample(samples) {}
  async writeSamples(samples) {}
}

module.exports = SamplesDatasource;
