export default class FileError {
    constructor(message, description) {
      this.status = 500
      this.message = message
      this.description = description
    }
  }