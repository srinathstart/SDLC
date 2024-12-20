import mongoose from 'mongoose';

const imageModel = new mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductInfo",
        required: true,
    },
    image: {
        type: Buffer,
        required: true
    },
}, {
    timestamps: true,
});

export const Image = mongoose.model('Image', imageModel);