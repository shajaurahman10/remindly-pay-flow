
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PaymentUpdate {
  clientId: string;
  status: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  amount?: number;
  paidAt?: string;
}

export const usePaymentTracking = () => {
  const [paymentUpdates, setPaymentUpdates] = useState<PaymentUpdate[]>([]);

  useEffect(() => {
    // Set up WebSocket connection for real-time payment updates
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/payments`;
    
    let ws: WebSocket;
    
    const connectWebSocket = () => {
      try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Payment tracking WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          try {
            const paymentUpdate: PaymentUpdate = JSON.parse(event.data);
            
            setPaymentUpdates(prev => [...prev, paymentUpdate]);
            
            // Show toast notification for payment updates
            if (paymentUpdate.status === 'paid') {
              toast.success(`Payment received for client ${paymentUpdate.clientId}!`);
            } else if (paymentUpdate.status === 'failed') {
              toast.error(`Payment failed for client ${paymentUpdate.clientId}`);
            }
          } catch (error) {
            console.error('Error parsing payment update:', error);
          }
        };
        
        ws.onclose = () => {
          console.log('Payment tracking WebSocket disconnected, attempting to reconnect...');
          setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
        };
        
        ws.onerror = (error) => {
          console.error('Payment tracking WebSocket error:', error);
        };
      } catch (error) {
        console.error('Error connecting to payment tracking WebSocket:', error);
      }
    };
    
    // Only connect if we're in a browser environment
    if (typeof window !== 'undefined') {
      connectWebSocket();
    }
    
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const processRazorpayWebhook = async (payload: any) => {
    try {
      const { event, payload: webhookPayload } = payload;
      
      switch (event) {
        case 'payment_link.paid':
        case 'payment.captured':
          const paymentUpdate: PaymentUpdate = {
            clientId: webhookPayload.notes?.client_id || '',
            status: 'paid',
            paymentId: webhookPayload.id,
            amount: webhookPayload.amount / 100, // Convert from paise to rupees
            paidAt: new Date().toISOString(),
          };
          
          // Update client status in database
          await updateClientPaymentStatus(paymentUpdate);
          
          // Add to local state for real-time UI updates
          setPaymentUpdates(prev => [...prev, paymentUpdate]);
          
          toast.success('Payment received successfully!');
          break;
          
        case 'payment.failed':
          const failedUpdate: PaymentUpdate = {
            clientId: webhookPayload.notes?.client_id || '',
            status: 'failed',
            paymentId: webhookPayload.id,
          };
          
          setPaymentUpdates(prev => [...prev, failedUpdate]);
          
          toast.error('Payment failed');
          break;
          
        default:
          console.log('Unhandled webhook event:', event);
      }
    } catch (error) {
      console.error('Error processing Razorpay webhook:', error);
      toast.error('Error processing payment update');
    }
  };

  const updateClientPaymentStatus = async (paymentUpdate: PaymentUpdate) => {
    try {
      const response = await fetch('/api/clients/payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentUpdate),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update client payment status');
      }
      
      console.log('Client payment status updated successfully');
    } catch (error) {
      console.error('Error updating client payment status:', error);
      throw error;
    }
  };

  const getLatestPaymentUpdate = (clientId: string): PaymentUpdate | undefined => {
    return paymentUpdates
      .filter(update => update.clientId === clientId)
      .sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())[0];
  };

  return {
    paymentUpdates,
    processRazorpayWebhook,
    updateClientPaymentStatus,
    getLatestPaymentUpdate,
  };
};
