const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


router.post('/register', (req, res)=>{
    console.log(req.body)
    res.send('Dang ki thanh cong')
});

router.get('/get', async (req, res)=>{
   const specificCollection = await mongoose.connection.db.collection('restaurants');
   const result = await specificCollection.find().toArray();
   console.log(result)

   res.send(result)
});

module.exports = router;

