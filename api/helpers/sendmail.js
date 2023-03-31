const nodemailer = require("nodemailer");

module.exports = {


  friendlyName: 'Sendmail',


  description: 'Sendmail something.',


  inputs: {
    email : {
      type : 'string'
    },
    userName :{
      type : 'string'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "1cdc869c523074",
        pass: "00f22468556082"
      }
    });
    const info = {
      from: '"bhagyashree"<bhagyashreec@zignuts.com>', // sender address
      to: inputs.email, 
      subject: "Hello ✔", 
      text: "Hello world?",
      html: "<b>Hello world?</b>", 
    };
    transport.sendMail(info) ;
   
  }
  


};

