import { PublicModules } from "src/common/PublicModules";

export class SendCodeTemplate {
  static newInstance() { return new SendCodeTemplate() }

  public getTemplate(
    userName: string,
    email: string,
    code: string,
    action: string,
    logo: string,
    ipAddress: string = null,
    isSendCodeToEmail: boolean = false,
    browserName: string,
    platform: string,
  ) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
    </head>

    <body>
      <div>Your Code: </div>
    </body>

    </html>
    `
  }
}