import express from "express";
import { Quote } from "../models/quotePriceModel.js";

const router = express.Router();


router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const quoteprices = await Quote.find({ productid: id });

        if (quoteprices.length === 0) {
            return res.status(404).json({ message: 'No quotes found for this product' });
        }

        const formattedQuote = quoteprices.map((quote) => ({
            _id: quote._id,
            productid: quote.productid,
            userid: quote.userid,
            quoteprice: quote.quoteprice,
        }));

        res.status(200).json(formattedQuote);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id: productid } = req.params;
        const { userid } = req.query;

        const existingQuote = await Quote.findOne({ productid, userid });

        if (existingQuote) {
            // Update the existing quote if it exists
            return res.status(200).json({ quoteprice: existingQuote.quoteprice });
        }

        res.status(404);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a new quote or update an existing one
router.post('/add/:id', async (req, res) => {
    try {
        const { id: productid } = req.params;
        const { userid } = req.query;
        const { quoteprice } = req.body;

        const existingQuote = await Quote.findOne({ productid, userid });

        if (existingQuote) {
            // Update the existing quote if it exists
            existingQuote.quoteprice = quoteprice;
            await existingQuote.save();
            return res.status(200).json({ message: 'Quote updated successfully!', quote: existingQuote });
        }

        // Create a new quote if it doesn't exist
        const newQuote = new Quote({
            productid,
            userid,
            quoteprice,
        });

        const savedQuote = await newQuote.save();

        res.status(200).json({ message: 'Quote uploaded successfully!', savedQuote });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const { id: userid } = req.params;

        const existingQuotes = await Quote.find({ userid: userid });

        if (existingQuotes) {
            // Update the existing quote if it exists
            return res.status(200).json({ existingQuotes });
        }

        res.status(404);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//   deleteby id
router.delete('/deletebyid/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const quote = await Quote.findById(id);
        if (quote) {

            await Quote.findByIdAndDelete(id);
        }
        else{
            res.status(404).json({ message: 'Quote Not Found' });
        }

        res.status(200).json({ message: 'Quote Deleted' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

//   deleteby productid
router.delete('/deletebyproduct/:id', async (req, res) => {
    try {
        const  id  = req.params.id;
        const quotes = await Quote.find({ productid: id });
        if (quotes) {
            await Quote.deleteMany({ productid: id });
        }
        res.status(200).json({ message: 'Quotes Deleted' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});



export default router;