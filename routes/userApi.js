const express = require('express');
const router = express.Router();
const models = require('../models')
const resGen = require('../utils/response-generator')

/* APi to get my account */
router.get('/myAccount', async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: {
        email: req.user.email,
      },
    })

    if (!user) {
      throw new Error('No user found!')
    }
    res.render('aadhar-detail', {
      userDetails: user,
    })
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})


module.exports = router;
