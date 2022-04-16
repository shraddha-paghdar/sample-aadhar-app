const express = require('express');
const router = express.Router();

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
    res.render('account', {
      user: req.user,
      userDetails: user,
    })
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})


module.exports = router;
