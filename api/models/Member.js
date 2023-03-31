module.exports = {
    attributes:  {
        memberId : {
            model : 'User'
        },
        accountsId : {
            model : 'Accounts'
        } ,
        isDelete : {
            type :'boolean',
            defaultsTo: false
           },
    },
}