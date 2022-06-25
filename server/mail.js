exports.send = send
exports.sendEmail=sendEmail
exports.sendEmailWithAttachment=sendEmailWithAttachment

var nodemailer = require('nodemailer')
var settings = require('../configs/settings.js').get()
var debug = require('debug')('meanstackjs:mail')
var transporter = nodemailer.createTransport(settings.email.connect)

function send (message, cb) {
  let from = (message.from!=null)?message.from:settings.email.from;
  var mailOptions = {
    to: message.to,
    from: from,
    subject: message.subject,
    text: message.text
  }

  debug('mailOptions', mailOptions)
  transporter.sendMail(mailOptions, function (error) {
    if (error) debug('mail error:', error)
    cb(error)
  })
}



function sendEmail( emailBody, emailSubj,recepientEmail) {

  var mailOptions = {
    to: recepientEmail,
    from: settings.email.from,
    subject: emailSubj,
    html:  emailBody
  } 

  transporter.sendMail(mailOptions, function (error) {
    console.log('transporter mail')
    if (error)
      console.log(error)
      return error
  })

}

function sendEmailWithAttachment( emailBody, emailSubj, recepientEmail, attachments) {
  const fs = require('fs');
  var mailOptions = {
    to: recepientEmail,
    from: settings.email.from,
    subject: emailSubj,
    html:  emailBody,
    attachments: attachments
  } 

  transporter.sendMail(mailOptions, function (error) {
    console.log('transporter mail')
    if (error) {
      console.log(error);
      return error;
    }
    attachments.forEach(attachment => {
      fs.unlink(attachment.path, function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
      });
    });
  })

}

