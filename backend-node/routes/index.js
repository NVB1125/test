var router = require('express').Router();

// router.use('/',  function(req, res) {
//     res.send('Hello Sir')
// })

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));

module.exports = router;
