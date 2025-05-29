
interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export class WhatsAppService {
  private accessToken: string;
  private phoneNumberId: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
  }

  async sendTextMessage(to: string, message: string): Promise<WhatsAppResponse> {
    const messageData: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: to.replace(/\D/g, ''), // Remove non-digit characters
      type: 'text',
      text: {
        body: message,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendPaymentReminder(
    to: string,
    clientName: string,
    amount: string,
    endDate: string,
    upiId?: string,
    razorpayLink?: string,
    qrCodeUrl?: string
  ): Promise<WhatsAppResponse> {
    let message = `Hello! 👋 Your payment of ₹${amount} is now due.\n\n💳 You can pay using:`;
    
    if (upiId) {
      message += `\n• UPI: ${upiId}`;
    }
    
    if (razorpayLink) {
      message += `\n• Pay via Razorpay: ${razorpayLink}`;
    }
    
    if (qrCodeUrl) {
      message += `\n• View QR Code: ${qrCodeUrl}`;
    }
    
    message += `\n\nPlease complete payment by ${endDate} to avoid disruption.`;
    
    return this.sendTextMessage(to, message);
  }

  async scheduleMessage(
    to: string,
    message: string,
    sendAt: Date
  ): Promise<{ scheduled: boolean; scheduledId: string }> {
    // This would typically integrate with a job queue system like Bull/Redis
    // For now, we'll simulate scheduling
    const delay = sendAt.getTime() - Date.now();
    
    if (delay <= 0) {
      // Send immediately if scheduled time is in the past
      await this.sendTextMessage(to, message);
      return { scheduled: true, scheduledId: `immediate_${Date.now()}` };
    }
    
    // In a real implementation, you would:
    // 1. Store the message in a queue (Redis, database, etc.)
    // 2. Use a job scheduler (cron, Bull Queue, etc.)
    // 3. Return a unique job ID for tracking
    
    console.log(`Message scheduled for ${sendAt.toISOString()}:`, message);
    
    // Simulate scheduling with setTimeout (not recommended for production)
    setTimeout(async () => {
      try {
        await this.sendTextMessage(to, message);
        console.log('Scheduled message sent successfully');
      } catch (error) {
        console.error('Error sending scheduled message:', error);
      }
    }, Math.min(delay, 2147483647)); // Max setTimeout delay
    
    return { scheduled: true, scheduledId: `scheduled_${Date.now()}` };
  }

  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Handle Indian numbers
    if (digits.startsWith('91') && digits.length === 12) {
      return digits; // Already has country code
    } else if (digits.length === 10) {
      return '91' + digits; // Add India country code
    }
    
    return digits;
  }
}

export const createWhatsAppService = (accessToken: string, phoneNumberId: string) => {
  return new WhatsAppService(accessToken, phoneNumberId);
};
