import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { processWalletTransaction, createTransactionRecord } from '@/lib/supabaseDB';

const key_secret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount, // Amount in ₹ or paise
    } = body;

    // Check missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay verification fields' },
        { status: 400 }
      );
    }

    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: 'Razorpay Key Secret missing on server' },
        { status: 500 }
      );
    }

    // Verify signature using HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    let newBalance = null;

    // If userId and amount provided, process wallet top-up directly
    if (userId && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        try {
          const walletRes = await processWalletTransaction({
            userId,
            type: 'credit',
            amount: numAmount,
            description: `Razorpay Online Auto Deposit (${razorpay_payment_id})`,
            referenceId: razorpay_payment_id,
          });
          newBalance = walletRes.newBalance;

          // Record transaction record
          try {
            await createTransactionRecord({
              txn_id: `RZP${Date.now().toString().slice(-8)}`,
              user_id: userId,
              service_type: 'Wallet Load (Razorpay)',
              amount: numAmount,
              commission: 0,
              status: 'success',
              reference_no: razorpay_payment_id,
            });
          } catch (tErr) {
            console.warn('Transaction record save notice:', tErr.message);
          }
        } catch (wErr) {
          console.error('Error processing wallet credit:', wErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully!',
      razorpay_order_id,
      razorpay_payment_id,
      newBalance,
    });
  } catch (error) {
    console.error('Error in /api/verify-payment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during payment verification' },
      { status: 500 }
    );
  }
}
