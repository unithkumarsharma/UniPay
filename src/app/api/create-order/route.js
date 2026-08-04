import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    if (!key_id || !key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay API keys missing in server environment' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    const numAmount = parseInt(amount, 10);

    if (isNaN(numAmount) || numAmount < 100) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: numAmount, // amount in paise
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
