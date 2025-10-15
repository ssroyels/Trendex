import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id, updates } = req.body;

      // Validation check
      if (!id || !updates || typeof updates !== "object") {
        return res.status(400).json({ error: "Product ID and valid updates are required." });
      }

      // Update product in MongoDB
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
        new: true, // Return the updated document
        runValidators: true, // Ensure schema validation
      });

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed. Use PUT instead." });
  }
};

export default connectDb(handler);
