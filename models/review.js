const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type : Number,
        min:1,
        max:5
    },
    createdAt :{
        type: Data,
        default:Date.now()
    }

});
module.exorts = mongoose.model("Review", reviewSchema);