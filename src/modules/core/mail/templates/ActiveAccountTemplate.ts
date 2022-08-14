interface IActiveAccountTemplate {
  activeLink?: string,
}

export class ActiveAccountTemplate {
  static newInstance() { return new ActiveAccountTemplate() }

  public getTemplate(fields: IActiveAccountTemplate) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
    </head>

    <body>
      <div>Active Your Account Link: ${fields.activeLink}</div>
    </body>

    </html>
    `
  }
}