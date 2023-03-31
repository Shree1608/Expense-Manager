/**
 * AccountsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */





var validate = require('sails-hook-validation-ev/lib/validate');



module.exports = {
    CreateAccount : async(req,res)=>{  
      validate(req)
      const errors = await req.getValidationResult();
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        try{
            const user= await req.userData.id;
              const result = req.body;
              
              const userId = await User.findOne({id : user})
              
              if(userId){
                if(userId.id == user){
                    const {accountName}  = req.body ;
                    const account = await Accounts.findOne({accountName,owner:user,isDelete:false});
                    if(account){
                      res.status(401).json({
                          message1 :"account name already exits"
                      })
                    }else{
                      const newaccount = await Accounts.create({accountName ,owner:user,createdAt:new Date().getTime()})
                      res.status(200).json({
                          message2: " account created"
                      })
                    }
                }
              }else{
                res.status(401).json({
                    message : "user not found"
                })
              }
              
        }catch(error){
            res.status(500).json({message3 : error.message})
        }
    },

    DeleteAccountByName : async(req,res)=>{
             const { accountName} = req.body
             const userId = await req.userData.id;
             const user = await Accounts.find({id : userId,isDelete:false});
             if(user){
                try{
                    const findAc = await Accounts.findOne({accountName:accountName ,owner :userId,isDelete:false});
                    if(!findAc){
                      return res.status(401).json({message: 'Account not exists'})
                      }else{
                      const deleteAc = await Accounts.updateOne({ 
                        accountName:accountName},{
                        owner:userId,
                        isDelete:false}).set({isDelete:true,deletedAt : new Date().getTime()})
                        const deleteMember = await Member.updateOne({accountsId :findAc.id},
                          {deletedBy:userId,
                          deletedAt : new Date().getTime(),
                          isDelete:true})
                        const deleteTransactions = await Transaction.updateOne({accId:findAc.id},
                          {deletedBy:userId,
                          deletedAt : new Date().getTime(),
                          isDelete:true})
                      return res.status(200).json({message : "Account deleted"})
                   }
                   }catch(error){
                      return res.serverError(error) 
                   }
             }else{
                res.json({messg: 'user not found'})
             }
             
    },
    EditAccountByName: async(req,res)=>{
      const { oldaccountName , newaccountName} = req.body;
      const userId = req.userData.id ; 
      const user = await Accounts.find({owner:userId})
      const AccName = await Accounts.find({accountName : oldaccountName})
     
      if(!AccName){
        res.status(401).json({ message : "account not exits"})
      }else{
        const result = await Accounts.findOne({accountName : newaccountName , owner:userId})
        if(result){
          res.status(403).json({message : "accountname alredy exits"})
        }     
       else{
        const update = await Accounts.updateOne({accountName :oldaccountName,owner:userId}).set({accountName : newaccountName,updatedAt:new Date().getTime()})
        if(!update){
          res.status(203).json({message: "Only owner can update!!!"})
        }
        else{
          res.status(200).json({message : "updated"});
        }
      }
       }
        
     
    },
    
    ListOfAllAccounts : async(req ,res)=>{
      try{
          const user= await req.userData.id;
          const doc = await Accounts.find({owner:user,isDelete:false})
         
         if(!doc){
          res.status(404).json({message:"user not found"})
        }else{
          const result = await User.findOne({id:user}).populate('accounts')
          if(result.accounts.length == 0){
            res.status(200).json({
              count : doc.length + result.accounts.length ,
              As_Member_In_Another_Account: 'No membership in any account',
              owner:doc[0].accountName,
              account:doc
          })
          }else{
            res.status(200).json({
            count : doc.length + result.accounts.length ,
            owner:doc[0].accountName,
            account:doc,
            As_Member_In_Another_Account: result.accounts,
           
            
          })
          }
        }
          
         
          
      }catch(error){
          res.status(500).json({message3 : error.message})
      }
  },
 
};


6