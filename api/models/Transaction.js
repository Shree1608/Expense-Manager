/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */



module.exports = {

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    amount :{
      type: 'number',
      columnType: 'FLOAT'
     },
     description:{
      type:'string'
     },
     Is_typeof : {
      type:'string',
      isIn:['i','e']
     },
    accId:{
      model : 'Accounts'
    },
     isDelete : {
      type :'boolean',
      defaultsTo:false
     }
   
  },
  CheckDate: async function(attribute){
    let newDate = Date.parse(attribute)
    let currentDate = new Date().getTime()
    let mesg
    if(isNaN(newDate)){
     return mesg= 'date is invalid'
    }else{
      if(newDate > currentDate){
       mesg = 'date should not be future date'
      }else{
        mesg = 'date is correct'
      }
    }
    let data = {
      date : newDate,
      mesg : mesg
    }
    return data
  },
  validate :(req)=>{
    req.check('amount').exists().withMessage('amount is require');
    req.check('amount').exists().isFloat(true).withMessage('must be in number');
    req.check('description').exists().withMessage('require'); 
    req.check('Is_typeof').exists().withMessage('require');
    req.check('Is_typeof').exists().isIn(['i','e']).withMessage('invalide type');
    req.check('accId').exists().withMessage('it is require')
  }

};

