const express = require('express');
const router = express.Router();
const saltRounds = 10
const bcrypt = require('bcrypt')

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
    res.render('admin-account', {
      user: req.user,
      userDetails: user,
    })
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

// API to get list of all users
router.get('/list-addhar', async (req, res) => {
  try {
    const users = await models.User.findAll({})
    res.send(users)
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

// API to get details of individual user
router.get('/aadhar', async (req, res) => {
  try {
    if (!req.query.email) {
      throw new Error('Please enter an email address')
    }
    const user = await models.User.findByPk(req.query.email)
    if (!user) {
      throw new Error('User not found')
    }
    res.send(user)
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

// API to create new aadhar details of user
router.post('/aadhar', async (req, res) => {
  try {
    if (!req.body.email) {
      throw new Error('Please enter an email address')
    }
    const user = await models.User.findByPk(req.body.email)
    if (!user) {
      throw new Error('User already exist')
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    req.body.password = hashedPassword

    const newUser = await models.User.create(req.body)
    res.send(newUser)
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

// API to update basic aadhar details of user 
router.put('/aadhar', async (req, res) => {
  try {
    if (!req.body.email) {
      throw new Error('Please enter an email address')
    }
    const user = await models.User.findByPk(req.body.email)
    if (!user) {
      throw new Error('User not found')
    }
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.phoneNo = req.body.phoneNo
    user.countryCode = req.body.countryCode
    user.country = req.body.country
    user.gender = req.body.gender
    user.age = req.body.age
    await user.save()
    res.send(user)
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

// API to delete a user account
router.delete('/aadhar', async (req, res) => {
  try {
    if (!req.query.email) {
      throw new Error('Please enter an email address')
    }
    const user = await models.User.findByPk(req.query.email)
    if (!user) {
      throw new Error('User not found')
    }
    await user.destroy()
    res.send(resGen.getObj('User account deleted succesfully!'))
  } catch (err) {
    res.status(501).send(resGen.getObj(err.message))
  }
})

module.exports = router;
