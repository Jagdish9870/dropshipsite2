import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const currency = 'inr';
const deliveryCharge = 100;
const discountRate = 0.2;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// COD Order Placement
const placeOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    const processedItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      discountedPrice: item.discountedPrice || item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color
    }));

    const subtotal = processedItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
    const discountAmount = subtotal * discountRate;
    const finalAmount = subtotal - discountAmount + deliveryCharge;

    const orderData = {
      userId,
      items: processedItems,
      address,
      subtotal,
      discountAmount,
      deliveryCharge,
      finalAmount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe Order Placement
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    const processedItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      discountedPrice: item.discountedPrice || item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color
    }));

    const subtotal = processedItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
    const discountAmount = subtotal * discountRate;
    const finalAmount = subtotal - discountAmount + deliveryCharge;

    const orderData = {
      userId,
      items: processedItems,
      address,
      subtotal,
      discountAmount,
      deliveryCharge,
      finalAmount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = processedItems.map(item => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(item.discountedPrice * 100)
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment"
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Get All Orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User: Get My Orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin: Update Order Status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  allOrders,
  userOrders,
  updateStatus
};
