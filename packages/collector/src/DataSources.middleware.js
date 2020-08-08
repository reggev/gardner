module.exports =
  /** @param {Object<string, any>} mapping */
  mapping => (req, res, next) => {
    req.dataSources = {};
    Object.entries(mapping).forEach(
      ([entry, datasource]) => (req.dataSources[entry] = datasource)
    );
    next();
  };
