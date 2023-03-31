/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */








module.exports.routes = {
  
    'POST /signup':'UserController.singup',
    'POST /login': 'UserController.login',
    'POST /logout': 'UserController.logout',
    'POST /accounts/add': 'AccountsController.CreateAccount',
    'GET /accounts' : 'AccountsController.ListOfAllAccounts',
    'DELETE /accounts/delete' : 'AccountsController.DeleteAccountByName',
    'PATCH /accounts/edit': 'AccountsController.EditAccountByName',
    'POST /accounts/addmember': 'MemberController.addMember',
    'POST /accounts/addTransaction' : 'TransactionController.Add_Transaction',
    'POST /accounts/allTransaction': 'TransactionController.List_Transaction',
    'DELETE /transaction/delete/:id': 'TransactionController.Delete_TransactionById',
    'PATCH /transaction/update':'TransactionController.Update_Transaction'
};
