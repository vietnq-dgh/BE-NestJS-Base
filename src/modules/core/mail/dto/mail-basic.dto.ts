interface IMailBasicDto {
  from?: string,
  to: string,
  subject: string,
  text?: string,
  html: string,
}

export class MailBasicDto {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
  constructor(fields: IMailBasicDto) {
    this.from = fields.from;
    this.to = fields.to;
    this.subject = fields.subject;
    this.text = fields.text;
    this.html = fields.html;
  }
}