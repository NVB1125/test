var router = require('express').Router();

// router.use('/',  function(req, res) {
//     res.send('Hello Sir')
// })

router.use('/api', require('./api'));
router.use('/authgoogle', require('./authgoogle'));
router.use('/authfacebook', require('./authfacebook'));
module.exports = router;
