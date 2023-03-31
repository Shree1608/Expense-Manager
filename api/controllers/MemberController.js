module.exports ={
    addMember : async(req,res)=>{
        const { email , accId}= req.body;
        const userId = req.userData.id ;
        const owner = await Accounts.find({id : userId});
         const result = await User.findOne({email : email })
         if(!result){
          res.status(404).json({message : "user is not in user table"})
         }
         else{
          const doc = await Accounts.findOne({id: accId})
          if(!doc){
            res.status(403).json({message : "accountId not exist"})
          }
         else{
          const member = await Member.findOne({memberId : result.id,accountsId : doc.id})
          if(member){
            res.status(404).json({message : "Member already added"})
          }else{
            const newUser = await User.addToCollection( result.id,'accounts', doc.id)
              res.status(200).json({message :"Member added"}) 
          }
         }
         }   
      },
}