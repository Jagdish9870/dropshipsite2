import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import crypto from 'crypto';

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

const placeOrderPayU = async (req, res) => {
  try {
    const {
      userId,
      items,
      amount,
      discount,
      delivery_fee,
      final_amount,
      address,
      paymentMethod
    } = req.body;

    const origin = req.headers.origin || "http://localhost:5173";
    console.log("origin", origin);
    console.log("req.body", req.body);

    // Prepare order data
    const orderData = {
      userId,
      items,
      address,
      amount,
      discount,
      delivery_fee,
      final_amount,
      paymentMethod,
      payment: false,
      date: Date.now()
    };

    // Save order to get ID
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const txnid = newOrder._id.toString(); // Use actual order ID as txnid
    const productinfo = "Order Payment";
    const firstname = address.firstName || "Customer";
    const email = address.email || "customer@example.com";
    const phone = address.phone || "0000000000";
    const amountStr = Number(final_amount).toFixed(2); // e.g. "1418.40"

    const surl = `${origin}/verify?success=true&orderId=${txnid}`;
    const furl = `${origin}/verify?success=false&orderId=${txnid}`;

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    // Hash format: key|txnid|amount|productinfo|firstname|email|||||||||||salt
    const hashString = `${key}|${txnid}|${amountStr}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    console.log("Hash String Used:", hashString);
    console.log("PayU Hash:", hash);

    // Params to send to frontend
    const payuParams = {
      key,
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      service_provider: "payu_paisa"
    };

    res.json({
      success: true,
      action: "https://secure.payu.in/_payment",
      params: payuParams
    });

  } catch (error) {
    console.error("PayU Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



  
  // const verifyPayU = async (req, res) => {
  //   const { mihpayid, txnid, status } = req.body;
  
  //   try {
  //     const orderId = txnid;
  
  //     if (status === "success") {
  //       await orderModel.findByIdAndUpdate(orderId, { payment: true });
  //       res.redirect(`/verify?success=true&orderId=${orderId}`);
  //     } else {
  //       await orderModel.findByIdAndDelete(orderId);
  //       res.redirect(`/verify?success=false&orderId=${orderId}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.redirect(
  //       `/verify?success=false&error=${encodeURIComponent(error.message)}`
  //     );
  //   }
  // };

  const verifyPayU = async (req, res) => {
    const { txnid, status } = req.body;
  
    try {
      // Find order using txnid (assuming txnid was saved as a field in your order)
      const order = await orderModel.findOne({ _id : Object(txnid) });
  
      console.log("hello", order);
      
      if (!order) {
        return res.redirect(`http://localhost:5173/verify?success=false&orderId=${txnid}`);
      }
  
      const orderId = order._id;
  
      if (status === "success") {
        order.payment = true;
        await order.save();
        // res.redirect(`http://localhost:5173/verify?success=true&orderId=${orderId}`);
        res.json({ success: true, orderId });
      } else {
        // await orderModel.findByIdAndDelete(orderId);
        // res.redirect(`http://localhost:5173/verify?success=false&orderId=${orderId}`);
        res.json({ success: false, orderId });
      }
    } catch (error) {
      console.log("Payment Verification Error:", error);
      // res.redirect(
      //   `http://localhost:5173/verify?success=false&error=${encodeURIComponent(error.message)}`
      // );
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
  updateStatus,
  verifyPayU,
  placeOrderPayU
};
