/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Customer Email profile is a template used to format the presentation of outgoing email messages of sales orders and invoices to that customer.
  @class
  @alias CustomerEmailProfile
  @property {String} name [is the document key, idAttributed, required] (Enter a name that should be unique from the other Customer email profiles )
  @property {String} description (This field brief description about the email profile)
  @property {String} from (This field is email-id from which the email should be sent)
  @property {String} replyTo (List of email-ids to be entered to which the receiptant can reply directly )
  @property {String} to (List of email-ids to be populated in the email template TO field)
  @property {String} cc	(List of email-ids to be populated in the email template CC field)
  @property {String} bcc (List of email-ids to be populated in the email template BCC field)
  @property {String} subject (This is a text field with subject of the email template)
  @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Customer Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  */
  
  var spec = {
      recordType: "XM.CustomerEmailProfile",
      enforceUpperKey: false,
      collectionType: "XM.CustomerEmailProfileCollection",
      listKind: "XV.CustomerEmailProfileList",
      instanceOf: "XM.Model",
      attributes: ["id", "name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
      requiredAttributes: ["name"],
      skipCrud: true,
      skipSmoke: true,
        /**
        @member Settings
        @memberof CustomerEmailProfile
        @description The ID attribute is "name", which will not be automatically uppercased.
      */
      idAttribute: "name",
      /**
        @member Settings
        @memberof CustomerEmailProfile
        @description Used in the Sales module
      */
      extensions: ["sales"],
      /**
        @member Setup
        @memberof CustomerEmailProfile
        @description Customer Email Profiles are not  lockable.
      */
      isLockable: false,
      cacheName: null,
      /**
        @member Privileges
        @memberof CustomerEmailProfile
        @description Customer Email Profiles can be read, created, updated,
          or deleted by users with the "MaintainCustomerEmailProfiles" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainCustomerEmailProfiles",
        read: true
      },
      updatableField: "description"
    };

  var additionalTests =  function () {
    
      /**
      @member Navigation
      @memberof CustomerEmailProfile
      @description An Action gear exists in the 'Customer Email' work space  with following options: Delete' option where there is no Customer linked to it and the user has MaintainCustomerEmailProfiles privilege
     */
      it.skip("Action gear should exist in the Customer Email work space with 'Delete' option if" +
      "there is no Customer linked to it and if the user has" +
      "'MaintainCustomerEmailProfiles privilege'", function () {
      });
      /**
      @member Navigation
      @memberof CustomerEmailProfile
      @description An Action gear exists in the 'Customer Email' work space with no 'Delete' option
      if the selected Email Profile has Customer linked to it
     */
      it.skip("Action gear should exist in the Customer Email work space without 'Delete' option if" +
      "there is a Customer linked to the selected EmailProfile", function () {
      });
     
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
