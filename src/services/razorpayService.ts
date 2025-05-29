
interface RazorpayLinkData {
  amount: number;
  currency: string;
  customer: {
    name: string;
    contact: string;
    email?: string;
  };
  notify: {
    sms: boolean;
    email: boolean;
  };
  reminder_enable: boolean;
  notes: Record<string, string>;
  callback_url?: string;
  callback_method?: string;
}

interface RazorpayLinkResponse {
  id: string;
  short_url: string;
  status: string;
  amount: number;
  currency: string;
}

export class RazorpayService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async createPaymentLink(data: RazorpayLinkData): Promise<RazorpayLinkResponse> {
    const auth = btoa(`${this.apiKey}:${this.apiSecret}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/payment_links`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          accept_partial: false,
          first_min_partial_amount: 100,
          description: `Payment for ${data.customer.name}`,
          customer: data.customer,
          notify: data.notify,
          reminder_enable: data.reminder_enable,
          notes: data.notes,
          callback_url: data.callback_url,
          callback_method: data.callback_method || 'get',
        }),
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Razorpay payment link:', error);
      throw error;
    }
  }

  async getPaymentLink(linkId: string): Promise<RazorpayLinkResponse> {
    const auth = btoa(`${this.apiKey}:${this.apiSecret}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/payment_links/${linkId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Razorpay payment link:', error);
      throw error;
    }
  }

  async cancelPaymentLink(linkId: string): Promise<void> {
    const auth = btoa(`${this.apiKey}:${this.apiSecret}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/payment_links/${linkId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Razorpay API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error cancelling Razorpay payment link:', error);
      throw error;
    }
  }

  verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    return expectedSignature === signature;
  }
}

export const createRazorpayService = (apiKey: string, apiSecret: string) => {
  return new RazorpayService(apiKey, apiSecret);
};
