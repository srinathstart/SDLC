import mongoose from 'mongoose';

const quoteModel = new mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductInfo",
        required: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quoteprice: {
        type: Number,
        required: true,
    },
    
}, {
    timestamps: true,
});

export const Quote = mongoose.model('Quote', quoteModel);