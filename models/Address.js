import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  localAddress: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);

export default Address;

