import mongoose from "mongoose";
import mongooseCurrency from "mongoose-currency";
const Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
var currencyTypes = mongooseCurrency.loadType(mongoose);
var Currency = mongoose.Types.currencyTypes;

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    cost: {
      type: currencyTypes,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
