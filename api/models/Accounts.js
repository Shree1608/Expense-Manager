/**
 * Accounts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    accountName :{
      type : 'string',
      required : true 
  },
    balance:{
      type: 'number',
     defaultsTo : 0.0,
     columnType: 'FLOAT'
    },
     owner : {
     model : 'User',
    required: true 
  },
  
  
  isDelete : {
   type :'boolean',
   defaultsTo: false
  },
  
   
  
 

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    user:{
      collection:'user',
      via:'accountsId',
      through:'member'
    }
  }, validate :(req)=>{
    req.check('accountName').exists().withMessage('please enter accountName');
  },

};

