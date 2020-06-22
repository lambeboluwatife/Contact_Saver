// module.exports = {
//   ensureAuthenticated: function(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     req.flash('error_msg', 'You need to be logged in to do this');
//     res.redirect('/users/login');
//   }
// }

const Contact = require('../models/Contact');

// All Middleware goes here
const middlewareObj = {};

middlewareObj.checkContactOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Contact.findById(req.params.id, (err, foundContact) => {
      if (err) {
        req.flash('error_msg', 'Contact not found');
        res.redirect('back');
      } else {
        // does user own the Contact?
        if (foundContact.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error_msg', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error_msg', 'You need to be logged in to do that');
    res.redirect('back');
  }
}

middlewareObj.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'You need to be logged in to do that');
  res.redirect('/users/login');
}

module.exports = middlewareObj;
