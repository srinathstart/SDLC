import mongoose from 'mongoose';

const productModel = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    previmage: {
        type: Buffer,
        required: true
    },
    category : {
        type : String,
        required : true

    },
}, {
    timestamps: true,
});

export const ProductInfo = mongoose.model('ProductInfo', productModel);