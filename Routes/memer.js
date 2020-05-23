const app = require('express');
var ber = require('./../db');
const router = app.Router();
router.get('/', (req, res) => { res.json(ber) });

router.get('/:id', (req, res) => {
    // res.send('<h3>ID is : ' + req.params.id + '</h3>');
    res.json(ber.filter(member => member.id === parseInt(req.params.id)));
})
module.exports = router;