export default class InvalidRequestError {
    constructor(message, description) {
      this.status = 400
      this.message = message
      this.description = description
    }
  }