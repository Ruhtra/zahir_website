export class InternalServerError extends Error {
    constructor(message) {
      super()
      this.message = message;
      this.name = "InternalServerError"; // (different names for different built-in error classes)
    }
}