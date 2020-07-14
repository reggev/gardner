class Err extends Error {
  constructor(type, description, status = 500) {
    super();
    this.type = type;
    this.status = status;
    this.description = description;
  }

  static isErr(e) {
    return e instanceof Err;
  }
}

module.exports = Err;
