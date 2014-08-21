/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  /**
  Project Email profile is a template used to format the presentation of outgoing email messages related to a project type. This template includes email ids, subject and body contents to be auto populated.
  @class
  @alias ProjectEmailProfile
  @property {String} id
  @property {String} name [Is the idAttribute] (Enter a name that should be unique from the other Project email profiles.)
  @property {String} description (This field brief description about the email profile.)
  @property {String} from (This field is email-id from which the email should be sent.)
  @property {String} replyTo (List of email-ids to be entered to which the recipient can reply directly.)
  @property {String} to (List of email-ids to be populated in the email template TO field.)
  @property {String} cc (List of email-ids to be populated in the email template CC field.)
  @property {String} bcc (List of email-ids to be populated in the email template BCC field.)
  @property {String} subject (This is a text field with subject of the email template.)
  @property {String} body (This is a scrolling text field with word-wrapping for entering Notes related to the Project Email Profile. Notes entered on this screen will follow the Email Profile through the Emailing process.)
  **/

  var spec = {
      recordType: "XM.ProjectEmailProfile",
      collectionType: "XM.ProjectEmailProfileCollection",
      SkipSmoke: true,
      SkipCrud: true,

      /**
        @member Other
        @memberof ProjectEmailProfile
        @description The Project Email Profile Collection is not cached.
      */
      cacheName: null,
      listKind: "XV.ProjectEmailProfileList",
      instanceOf: "XM.Document",

      /**
        @member Settings
        @memberof ProjectEmailProfile
        @description The ID attribute is "name", which will be automatically uppercased.
      */
      idAttribute: "name",
      enforceUpperKey: true,
      attributes: ["id", "name", "description", "from", "replyTo", "to", "cc", "bcc", "subject", "body"],
      requiredAttributes: ["name"],

      /**
        @member Settings
        @memberof ProjectEmailProfile
        @description Used in the project module
      */
      extensions: ["project"],

      /**
        @member Setup
        @memberof ProjectEmailProfile
        @description Project Email Profiles are not  lockable.
      */
      isLockable: false,

      /**
        @member Privileges
        @memberof ProjectEmailProfile
        @description Project Email Profiles can be read, created, updated,
          or deleted by users with the "MaintainProjectEmailProfiles" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainProjectEmailProfiles",
        read: true
      },
      updatableField: "description"
    };

  var additionalTests =  function () {
    
      /**
      @member Navigation
      @memberof ProjectEmailProfile
      @description An Action gear exists in the 'Project Email' work space  with following options: 'Delete' option where there is no 'Project Type' linked to it and the user has MaintainProjectEmailProfiles privilege
     */
      it.skip("Action gear should exist in the Project Email work space with 'Delete' option if" +
      "there is no 'Project Type' linked to it and if the user has" +
      "'MaintainProjectEmailProfiles privilege'", function () {
      });

      /**
      @member Navigation
      @memberof ProjectEmailProfile
      @description An Action gear exists in the 'Project Email' work space with no 'Delete' option if the selected Email Profile has 'Project Type' linked to it
     */
      it.skip("Action gear should exist in the Project Email work space without 'Delete' option " +
      "if there is a 'Project Type' linked to the selected EmailProfile", function () {
      });

     /**
      @member Settings
      @memberof ProjectEmailProfile
      @description Email Profile should not be saved without entering name field
     */
      it.skip("User should not able to save email profile unless name is entered", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
