const express = require('express');
const router = express.Router();


router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling Get requests to /orders'
    })
})

router.post('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling Post requests to /orders'
    })
})


module.exports = router;