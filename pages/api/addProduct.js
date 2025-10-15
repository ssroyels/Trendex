import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      console.log(req.body);

      // multiple products ek sath insert karne ke liye
      for (let i = 0; i < req.body.length; i++) {
        let p = new Product({
          title: req.body[i].title,
          slug: req.body[i].slug,
          desc: req.body[i].desc,
          img: req.body[i].img,
          category: req.body[i].category,
          size: req.body[i].size,   // ✅ schema me ab [String] hoga
          color: req.body[i].color, // ✅ schema me ab [String] hoga
          price: req.body[i].price,
          availableQty: req.body[i].availableQty,
        });
        await p.save();
      }

      return res.status(200).json({ msg: "Products successfully added" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add products" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
