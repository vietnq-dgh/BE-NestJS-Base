export class ActiveAccountTemplate {
  static newInstance() { return new ActiveAccountTemplate() }

  public getTemplate(
    email: string = 'replace@gmail.com',
    activeLink: string = 'active link',
    homeLink: string = 'home link',
    userName: string = 'user-name',
    logo: string = '',
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
    </head>

    <body>
      <div>Active Your Account</div>
    </body>

    </html>
    `
  }
}