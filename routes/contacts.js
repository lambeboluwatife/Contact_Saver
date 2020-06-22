const express = require('express');
const router = express.Router();
const Contact = require("../models/Contact");
const middleware = require('../config/auth');
// const { ensureAuthenticated } = require('../config/auth');


// READ - Show all Contacts
router.get('/', middleware.ensureAuthenticated, (req, res) => {
  // Get all contacts from DB
  Contact.find({
    author: {
        id: req.user._id,
        username: req.user.username
    }
  }, (err, allContacts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('contacts/contacts', { contacts: allContacts, username: req.user.username });
    }
  });
});

//NEW - Show form to create new campground
router.get("/new", middleware.ensureAuthenticated, (req, res) => {
  res.render("contacts/new");
});

// CREATE - Create new contact
router.post('/', middleware.ensureAuthenticated, (req, res) => {
  // Get data from form and add to contacts array
  let name = req.body.name;
  let address = req.body.address;
  let tel = req.body.tel;
  let contactType = req.body.contactType;
  let email = req.body.email;
  let author = {
    id: req.user._id,
    username: req.user.username
  }

  let errors = [];

  // Check required fields
  if (!name || !address || !contactType || !tel || !email) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('contacts/new', {
      errors,
      name,
      address,
      contactType,
      tel,
      email
    });
  } else {
    let newContact = {name: name, address: address, contactType: contactType, tel: tel, email: email, author: author};

    // Create a new contact and save to DB
    Contact.create(newContact, (err, newlyCreated) => {
      if (err) {
        console.log(err);
      } else {
        // redirect back to contacts
        res.redirect('/contacts');
        console.log(newContact);
      }
    });
  }

});

// EDIT - Edit Contact
router.get('/:id/edit', middleware.ensureAuthenticated, (req, res) => {
  Contact.findById(req.params.id, (err, foundContact) => {
      res.render('contacts/edit', { contact: foundContact });
  });
});

// UPDATE = Update Contact
router.put('/:id', middleware.ensureAuthenticated, (req, res) => {
  // find and update the correct contact
  Contact.findByIdAndUpdate(req.params.id, req.body.contact, (err, updatedContact) => {
    if (err) {
      res.redirect('/contacts');
    } else {
      console.log(res);
      res.redirect('/contacts');
    }
  });
});

// DESTROY - Delete Contact
router.delete('/:id', middleware.ensureAuthenticated, (req, res) => {
  Contact.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/contacts');
      console.log(err);
    } else {
      res.redirect('/contacts');
    }
  })
});
module.exports = router;
