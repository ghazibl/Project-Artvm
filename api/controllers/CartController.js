import Cart from "../models/CartModel.js";

export const getCardbyUser = async (req, res) => {
  try {
    const user = req.user;
  console.log(user);
    const productCart = await Cart.findOne({ user: user.userId }).populate({
      path: "productCart",
      populate: { path: "product" },
    });

    res.status(200).json(productCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { cartId, productCardId } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const index = cart.productCart.indexOf(productCardId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Product card not found in the cart" });
    }

    cart.productCart.splice(index, 1);

    await cart.save();
    return res
      .status(200)
      .json({ message: "Product removed from cart successfully", cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCart = async(req,res) => {
  try {
    const user = req.user;
    const cart = new Cart({
      user: user.userId,
     
      productCart: [],
    });
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}