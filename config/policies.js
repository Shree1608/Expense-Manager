/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  
UserController : {
  logout : "check-auth",
},
AccountsController : {
  '*' : 'check-auth',
},
MemberController :{
  '*' : 'check-auth',
},
TransactionController : {
  '*' : 'check-auth',
},
  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

};
