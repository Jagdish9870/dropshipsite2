import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, color } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (cartData[itemId][color]) {
      cartData[itemId][color] += 1;
    } else {
      cartData[itemId][color] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" ,cartData});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, color, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId] && cartData[itemId][color]) {
      cartData[itemId][color] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart Updated" ,cartData});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const deleteFromCart = async (req, res) => {
  try {
    const { userId, itemId, color } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    // If item and color exist in cartData
    if (cartData[itemId] && cartData[itemId][color]) {
      delete cartData[itemId][color];

      // If no more colors left for that itemId, delete the itemId too
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      // Save updated cartData
      await userModel.findByIdAndUpdate(userId, { cartData });

      return res.json({ success: true, message: "Item removed from cart", cartData });
    }

    res.json({ success: false, message: "Item not found in cart" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart ,deleteFromCart};
