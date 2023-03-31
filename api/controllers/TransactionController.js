/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var validate = require('sails-hook-validation-ev/lib/validate');


module.exports = {
  
    Add_Transaction: async(req,res)=>{
    validate(req)
    const errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        const {amount,description,date,Is_typeof,accId}=req.body
        const user= await req.userData.id;
        const userId = await User.findOne({id : user})
        let findAc = await Accounts.findOne({id:accId , owner:user,isDelete:false})
        console.log(findAc);
                if(!findAc){
                    const findmember = await Member.findOne({accountsId : accId , memberId:user,isDelete:false})
                    if(findmember){
                         findAc = await Accounts.findOne({id : accId,isDelete:false})
                    }else{
                      return  res.status(404).json({message:"account not found"})
                    }
                }
        const newDate = await Transaction.CheckDate(date)
                
               
                if(newDate.mesg == 'date is correct'){
                    if(Is_typeof == 'i'){
                        const addTransaction = await Transaction.create({createdBy:user,createdAt:new Date().getTime(),
                            amount:amount,
                            description:description,
                            date:date,
                            Is_typeof:Is_typeof,
                            accId:accId}).fetch()
                        res.status(200).json({transactions :addTransaction})
                        const balance = findAc.balance + addTransaction.amount
                        const add = await Accounts.updateOne({id : accId},{balance : balance},{isDelete:false})
                       
                    }
                    else{
                       
                        if(findAc.balance >= amount){
                            const addTransaction = await Transaction.create({createdBy:user,createdAt:new Date().getTime(),
                                amount:amount,
                                description:description,
                                date:date,
                                Is_typeof:Is_typeof,
                                accId:accId}).fetch()
                            res.status(200).json({transactions :addTransaction})
                            const balance = findAc.balance - addTransaction.amount
                           const expense = await Accounts.updateOne({id:accId},{balance : balance},{isDelete:false})
                           
                        }
                        else{
                            res.status(500).json({message: "balance low"})
                        }
                    }
                }else{
                    res.status(500).json({message : "date is incorrect"})
                }
                
    },
    List_Transaction: async(req,res)=>{
       const {accId} = req.body
       const user = await req.userData.id
    
       let findAc = await Accounts.findOne({id:accId , owner:user,isDelete:false})
       if(!findAc){
        const findmember = await Member.findOne({accountsId : accId , memberId:user,isDelete:false})
        if(findmember){
             findAc = await Accounts.findOne({id : accId,isDelete:false})
        }else{
          return  res.status(404).json({message:"account not found"})
        }
        }else{
          const Transactions = await Transaction.find({accId:accId,isDelete:false})
            if(Transactions){
                res.status(200).json({
                    Account:accId,
                    count : Transactions.length,
                    Transactions:Transactions
                })
            }
        
       }
    },
    Update_Transaction: async(req,res)=>{
    const { TransId , newamount,descrition}= req.body
    const oldTransId = await Transaction.findOne({ id:TransId,isDelete:false})
    if(!oldTransId){
         res.status(404).json({message : 'Transaction id not found'})
    }else{
        const user = await req.userData.id
       
        let findAc = await Accounts.findOne({id:oldTransId.accId , owner:user,isDelete:false})
       
        if(!findAc){
         const findmember = await Member.findOne({accountsId : oldTransId.accId , memberId:user})
            if(findmember){
                findAc = await Accounts.findOne({id : oldTransId.accId,isDelete:false})

            }else{
            return  res.status(404).json({message:"account not found"})
            }
           
        }
            if(oldTransId.Is_typeof == 'i'){
                const updateAmount = newamount-oldTransId.amount
                const newbalance =findAc.balance+updateAmount
                if(newbalance<0){
                    res.status(500).json({message : 'insufficient balance'})
                }else{
                    const transaction = await Transaction.updateOne({id:TransId,},{amount:newamount,updatedBy:user,updatedAt:new Date().getTime()})
                    res.status(200).json({message :'ok',Transaction:transaction})
                    const updateBalance = await Accounts.updateOne({id:oldTransId.accId},{balance:newbalance})
                    
                }
            
            }else{
                if(oldTransId.Is_typeof == 'e'){
                    const updateAmount = oldTransId.amount -newamount 
                    const newbalance =findAc.balance+updateAmount
                    if(newbalance<0){
                        res.status(500).json({message : 'insufficient balance'}) 
                    }else{
                        const transaction = await Transaction.updateOne({id:TransId},{amount:newamount,updatedBy:user,updatedAt:new Date().getTime()})
                        res.status(200).json({message :'ok',Transaction:transaction})
                        const updateBalance = await Accounts.updateOne({id:oldTransId.accId},{balance:newbalance})   
                    }
                }
            
        }
    }
    
    },



    Delete_TransactionById: async(req,res)=>{
        const TransactionId = req.params.id
            const oldTransId = await Transaction.findOne({ id:TransactionId,isDelete:false})
            if(!oldTransId){
                 res.status(404).json({message : 'Transaction id not found'})
            }
            else{
                if(oldTransId.isDelete == true){
                    res.status(403).json({message : 'already deleted'})
                }else{
                    const user= await req.userData.id;
                    const userId = await User.findOne({id : user})
                    let findAc = await Accounts.findOne({id:oldTransId.accId , owner:user,isDelete:false})
                            if(!findAc){
                                const findmember = await Member.findOne({accountsId : oldTransId.accId , memberId:user,isDelete:false})
                                if(findmember){
                                     findAc = await Accounts.findOne({id : oldTransId.accId,isDelete:false})
                                }else{
                                  return  res.status(404).json({message:"account not found"})
                                }
                            }
                    if(oldTransId.Is_typeof == 'e'){
                        const Delettransiction = await Transaction.updateOne(TransactionId,{deletedBy:user,
                            deletedAt : new Date().getTime(),isDelete : true})
                        const balance = findAc.balance + Delettransiction.amount
                        const addAmount = await Accounts.updateOne({id :oldTransId.accId},{balance:balance})
                        
                        res.status(200).json({Delettransiction})
                    }   else{
                        if(oldTransId.Is_typeof == 'i'){
                            const Delettransiction = await Transaction.updateOne(TransactionId,{deletedBy:user,
                          deletedAt :  Date.now(),isDelete : true})
                            const balance = findAc.balance - Delettransiction.amount
                            const removeAmmount = await Accounts.updateOne({id :oldTransId.accId},{balance:balance})
                            res.status(200).json({removeAmmount}) 
                        }
                    }   
                    

                }
               
                
            }
            

            
           
    
            
     
                
            
        },
};

