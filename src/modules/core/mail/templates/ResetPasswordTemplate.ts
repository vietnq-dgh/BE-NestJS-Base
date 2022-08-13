export class ResetPasswordTemplate {
  static newInstance() { return new ResetPasswordTemplate() }

  public getTemplate(
    logo: string = '',
    resetLink: string = 'active link',
    userName: string = '',
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
    </head>

    <body>
      <div>Reset Your Account</div>
    </body>

    </html>
    `
  }
}