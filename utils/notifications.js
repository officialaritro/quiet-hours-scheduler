export class NotificationService {
  constructor() {
    this.providers = [];
  }

  addProvider(provider) {
    this.providers.push(provider);
  }

  async send(notification) {
    const results = [];

    for (const provider of this.providers) {
      try {
        const result = await provider.send(notification);
        results.push({ provider: provider.name, success: true, result });
      } catch (error) {
        results.push({ 
          provider: provider.name, 
          success: false, 
          error: error.message 
        });
      }
    }

    return results;
  }
}

export class EmailProvider {
  constructor(transporter) {
    this.name = 'email';
    this.transporter = transporter;
  }

  async send(notification) {
    const emailContent = {
      from: process.env.FROM_EMAIL,
      to: notification.recipient,
      subject: notification.subject,
      html: notification.html || notification.text
    };

    return await this.transporter.sendMail(emailContent);
  }
}
