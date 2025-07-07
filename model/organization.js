import {Schema,model} from "mongoose"
const organizationSchema = new Schema({
  company_name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",  
    required: true,
  },
  productInfo: {
    type: String,  // <-- Will store extracted text from PDF/Doc
    default: "",   // optional
  },
  isDeleted: {
    type: Boolean,
    default: false,  // <-- ✅ This is for soft delete
  },
}, { timestamps: true });

// Create the model
const Organization = model("Organization", organizationSchema);

export {Organization}
