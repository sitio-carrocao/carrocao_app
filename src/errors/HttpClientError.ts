class HttpClientError extends Error {
  public body: unknown

  public response: unknown
  constructor({
    body,
    message,
    response,
  }: {
    body: unknown
    message: string
    response: unknown
  }) {
    super(message)
    this.body = body
    this.name = 'HttpClientError'
    this.response = response
  }
}

export default HttpClientError
