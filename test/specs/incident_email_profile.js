/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Incident Email profile is a template used to format the presentation of outgoing email messages of Incidents.
  @class
  @alias IncidentEmailProfile
  @property {String} name [Is the document key, idAttributed, required] (Enter a name that should be unique from the other incident email profiles.)
  @property {String} description (This field brief description about the email profile.)
  @property {String} from (This field is email-id from which the email should be sent.)
  @property {String} replyTo (List of email-ids to be entered to which the receiptant can reply directly.)
  @property {String} to  (List of email-ids to be populated in the email template TO field.)
  @property {String} cc (List of email-ids to be populated in the email template CC field.)
  @property {String} bcc (List of email-ids to be populated in the email template BCC field.)
  @property {String} subject (This is a text field with subject of the email template.)
  @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Incident Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  **/

  var spec = {
      recordType: "XM.IncidentEmailProfile",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: true,
      collectionType: "XM.IncidentEmailProfileCollection",
      listKind: "XV.IncidentEmailProfileList",
      instanceOf: "XM.Document",
      attributes: ["id", "name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
      requiredAttributes: ["name"],
      /**
        @member Settings
        @memberof IncidentEmailProfile
        @description The ID attribute is "name", which will be automatically uppercased.
      */
      idAttribute: "name",
      /**
        @member Settings
        @memberof IncidentEmailProfile
        @description Used in the CRM module
      */
      extensions: ["crm"],
      /**
        @member Setup
        @memberof IncidentEmailProfile
        @description Incident Email Profiles are not  lockable.
      */
      isLockable: false,
      cacheName: null,
      /**
        @member Privileges
        @memberof IncidentEmailProfile
        @description Incident Email Profiles can be read, created, updated,
          or deleted by users with the "MaintainEmailProfiles" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainEmailProfiles",
        read: true
      },
      updatableField: "description"
    };

  var additionalTests =  function () {
    
      /**
      @member Navigation
      @memberof IncidentEmailProfile
      @description An Action gear exists in the 'Incident Email' work space  with following options: 'Delete' option where there is no Incident category linked to it and the user has MaintainEmailProfiles privilege
     */
      it.skip("Action gear should exist in the Incident Email work space with 'Delete' option if" +
      "there is no Incident category linked to it and if the user has" +
      "'MaintainEmailProfiles privilege'", function () {
      });
      /**
      @member Navigation
      @memberof IncidentEmailProfile
      @description An Action gear exists in the 'Incident Email' work space with no 'Delete' option if the selected Email Profile has incident category linked to it
     */
      it.skip("Action gear should exist in the Incident Email work space without 'Delete' option" +
      "if there is a incident category linked to the selected EmailProfile", function () {
      });
     
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
