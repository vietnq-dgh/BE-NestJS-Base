interface IRecoverAccountTemplate {
  activeLink?: string,
}

export class ResetPasswordTemplate {
  static newInstance() { return new ResetPasswordTemplate() }

  public getTemplate(fields: IRecoverAccountTemplate) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
    </head>

    <body>
      <div>Reset Your Account Link: ${fields.activeLink}</div>
    </body>

    </html>
    `
  }
}