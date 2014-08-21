/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";
 /**
    A Quote is a statement issued to a Customer or Prospect indicating pricing and sales Terms for specified quantities of sold Items. Quotes are often precursors to Sales Orders

    @class
    @alias Quote
    @property {String} id
    @property {String} number [is the idAttribute, required] Next available Quote Number will automatically display, unless your system requires you to enter Quote Numbers manually. Default values and input parameters for Quote Numbers are configurable at the system level.
    @property {Customer} customer [required] (Enter the Item Number of the Purchase Item you want to create a Purchase Order for.)
    @property {String} customerPurchaseOrderNumber  (Enter the Vendor Number of the Vendor who is the source for the specified Item.)
    @property {Date} qutoeDate [required] (Displays current day's date.)
    @property {Date} packDate (The pack date is the same date as the ship date. Because the field can be edited, you have the ability to change the pack date and make it different from the ship date. This field can be viewed by selecting the MORE button.)
    @property {Date} scheduleDate (Displays the Order's earliest scheduled date. The scheduled date corresponds to the earliest scheduled date for an included Quote Item. If there are no existing Line Items, the date entered here will become the default schedule date for the first one. If Line Items do exist and the date is changed, you will be asked whether you want all editable lines to change. If the change affects pricing, you will be asked whether you want Prices to be updated as well. If hidden, this field can be viewed by selecting the MORE button.)
    @property {Terms} terms [required] (Specify the billing Terms associated with the Order. By default, the Customer's standard billing Terms will appear in the field.)
    @property {SalesRep} saleRep [required] (Specify the Sales Representative associated with the Order. Sales Representatives are linked to a Customer on the Customer master—either by a default setting or through the assignment of Ship-To Addresses. Each Ship-To Address may have a different Sales Representative associated with it. Consequently, the name of the sales Representative appearing on the Quote header will be the same as specified for the Ship-To Address being used.)
    @Property {Money} commission (By default, the commission percentage recorded on the Customer master will be automatically entered in this field. If for some reason you select a non-default Sales Representative at Order entry, the commission rate will not change. To adjust the commission rate, you must make the change manually. This field can be viewed by selecting the MORE button.)
    @property {TaxZone} taxZone (Specify the Tax Zone associated with the Quote. The Tax Zone for the specified Ship- To Address will be entered here by default. Otherwise, the primary Tax Zone for the Customer will be entered. This field can be viewed upon selecting the MORE button.)
    @property {Site} site (Specify the shipping Site associated with the Quote. The Site selected here acts as the default free on board (FOB) location. A Site may be designated as a shipping Site on the Site master. This field can be viewed upon selecting the MORE button.)
    @property {SaleType} saleType
    @property {String} status (Displays the current status of the Quote. There are two possible values: open and converted. Quotes get the converted status after they have been converted to Sales Orders. If your Sales module is configured to show Quotes after they have been converted, you may view historical Quotes from the Customer Workbench. Converted Quotes will not be visible on the list of open Quotes.)
    @property {Date} expireDate (Enter the date when the Quote expires, if any.)
    @property {String} billtoName (Displays the Customer's Bill-To name.)
    @property {String} billtoAddress1 (Displays the Customer's Bill-To Address Line 1. You may edit the displayed Address information in the fields below—or use the lookup feature to select another Address. If a new Address is manually entered here, that Address will be added automatically to the master list of Addresses.)
    @property {String} billtoAddress2 (Displays the Customer's Bill-To Address Line 2. You may edit the displayed Address information in the fields below—or use the lookup feature to select another Address. If a new Address is manually entered here, that Address will be added automatically to the master list of Addresses.)
    @property {String} billtoAddress3 (Displays the Customer's Bill-To Address Line 3. You may edit the displayed Address information in the fields below—or use the lookup feature to select another Address. If a new Address is manually entered here, that Address will be added automatically to the master list of Addresses.)
    @property {String} billtoCity (Displays the Customer's Bill-To City.)
	@property {String} billtoState (Displays the Customer's Bill-To State. )
    @property {String} billtoCountry (Displays the Customer's Bill-To Country.)
    @property {String} billtoPostalCode (Displays the Customer's Bill-To Postal Code.)
    @property {String} billtoContact (Displays the Customer's Bill-To Contact.)
    @property {String} billtoContactHonorific (Displays the Customer's Bill-To Contact Honorific.)
    @property {String} billtoContactFirstName (Displays the Customer's Bill-To Contact First Name. )
	@property {String} billtoContactMiddleName (Displays the Customer's Bill-To Contact Middle Name.)
	@property {String} billtoContactLastName (Displays the Customer's Bill-To Contact Last Name.)
	@property {String} billtoContactSuffix (Displays the Customer's Bill-To Contact Suffix.)
	@property {String} billtoContactPhone (Displays the Customer's Bill-To Contact Phone.)
	@property {String} billtoContactTitle (Displays the Customer's Bill-To Contact Title.)
	@property {String} billtoContactFax (Displays the Customer's Bill-To Contact Fax.)
	@property {String} billtoContactEmail (Displays the Customer's Bill-To Contact Email.)
	@property {String} shipto (Enter the number of the preferred Ship-To Address. Customers may maintain multiple Ship-To Addresses. If the Customer master for the specified Customer indicates that free-form Ship-To's are allowed, then any address may be entered. If free-form Ship-To's are not allowed, then the Ship-To Address must be entered using the browse button located to the right of the field.)
	@property {String} shiptoName (Displays the name for the specified Ship-To.)
	@property {String} shiptoAddress1 (Displays the specified Ship-To Address Line 1. You may manually override the displayed Address information in the fields below—or use the lookup feature to select another Address. If a new Address is manually entered here, that Address will be added automatically to the master list of Addresses.)
	@property {String} shiptoAddress2 (Displays the specified Ship-To Address Line 2.)
	@property {String} shiptoAddress3 (Displays the specified Ship-To Address Line 3.)
	@property {String} shiptoCity (Displays the specified Ship-To City.)
	@property {String} shiptoState (Displays the specified Ship-To State.)
	@property {String} shiptoCountry (Displays the specified Ship-To County.)
	@property {String} shiptoPostalCode (Displays the specified Ship-To PostalCode.)
	@property {String} shiptoContact (Displays the specified Ship-ToContact.)
	@property {String} shiptoContactHonorific (Displays the specified Ship-To Contact Honorific.)
	@property {String} shiptoContactFirstName (Displays the specified Ship-To Contact First Name. Use the lookup feature to select another Contact.)
	@property {String} shiptoContactMiddleName (Displays the specified Ship-To Contact Middle Name. Use the lookup feature to select another Contact.)
	@property {String} shiptoContactLastName (Displays the specified Ship-To Contact Last Name. Use the lookup feature to select another Contact.)
	@property {String} shiptoContactSuffix (Displays the specified Ship-To Contact Last Name. Use the lookup feature to select another Contact.)
	@property {String} shiptoContactPhone (Displays the specified Ship-To Contact Phone.)
	@property {String} shiptoContactTitle (Displays the specified Ship-To Contact Title.)
	@property {String} shiptoContactFax (Displays the specified Ship-To Contact Fax.)
	@property {String} shiptoContactEmail (Displays the specified Ship-To Contact Email.)
	@property {String} orderNotes (This is a scrolling text field with word-wrapping for entering general Notes related to the Quote. These Notes are for internal use only.)
	@property {String} shipNotes (This is a scrolling text field with word-wrapping for entering shipping Notes related to the Quote. These Notes are for internal use only.)
	@property {String} fob (Enter free on board (FOB) Terms for the Order. By default, FOB. Terms entered on the Shipping Site master will appear in this field. The default Terms may be changed during Order entry—and also at later stages during the billing cycle.)
	@property {ShipVia} shipVia (The preferred Ship Via method for the Customer will appear in the field. You may change the default Ship Via using the list. You may also enter a free-form Ship Via simply by typing the name of the Ship Via into the field. Tip:- The system supports up-to-date shipment tracking with links to the websites of many leading shipping companies (i.e., "Ship Vias").)
	@property {Money} currency
	@property {Money} calculateFreight [required] (Enter the amount of freight charge to be added to the specified Order. Freight charges may be entered during the creation or modification of a Quote—or at the time of shipment.)
	@property {ShipZone} shipZone
	@property {Money} margin (Displays the total profit margin for the Quote. The profit margin is based on the following formula: Quote Subtotal - Total Standard Costs for all Line Items)
	@property {Money} freightWeight
	@property {Money} subtotal (Displays the subtotal for the Quote Line Items.)
	@property {Money} taxTotal (Displays the amount of Tax that will be added to the Sales Order, as defined by the specified Tax Code. To get a detailed view of the Tax calculation, click on the Tax link using your mouse.)
	@property {Money} miscCharge (Enter the amount of any miscellaneous charge. Examples of miscellaneous charges include palletization costs, co-op refund, etc. Before entering a miscellaneous charge amount, you must first assign the charge to a Sales Account and also enter a description of the charge. Tip:-If you do not use Miscellaneous Charges at your site, you can hide these fields so they are not visible when entering Sales Orders. To do so, simply select the "Hide Misc. Charges" option in the system-level configuration.)
	@property {Money} freight (Enter the amount of freight charge to be added to the specified Order. Freight charges may be entered during the creation or modification of a Quote—or at the time of shipment.)
	@property {Money} total (Displays the total amount of the Quote.)
	@property {String} lineItems (To create new line items, navigate to this tab)
	@property {String} comments (To add/view Comments related to a Quote, select the "Comments" tab)
	@property {File} files (To associate documents with a Quote, select the "Documents" tab)
	@property {Account} accounts
	@property {Contact} contacts
	@property {String} urls
	@property {Item} items
	@property {Opportunity} opportunities
	@property {Incident} incidents
	@property {ToDo} toDos
	@property {Project} project
	@property {project} projects
	@property {Customer} customers
	@property {Opportunity} opportunity
	*/
  var spec = {
      recordType: "XM.Quote",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: true,
    /**
      @member Other
      @memberof Quote
      @description The Quote Collection is not cached.
    */
      collectionType: "XM.QuoteListItemCollection",
      listKind: "XV.QuoteList",
      instanceOf: "XM.Document",
      cacheName: null,
    /**
      @member Settings
      @memberof Quote
      @description Quote is lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof Quote
      @description The ID attribute is "number"
    */
      attributes: ["id", "number", "customer", "customerPurchaseOrderNumber", "quoteDate",
      "packDate", "scheduleDate", "terms", "salesRep", "commission", "taxZone", "site", "saleType",
      "status", "expireDate", "billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3",
      "billtoCity", "billtoState", "billtoCountry", "billtoPostalCode", "billtoContact",
      "billtoContactHonorific", "billtoContactFirstName", "billtoContactMiddleName",
      "billtoContactLastName", "billtoContactSuffix", "billtoContactPhone", "billtoContactTitle",
      "billtoContactFax", "billtoContactEmail", "shipto", "shiptoName", "shiptoAddress1",
      "shiptoAddress2", "shiptoAddress3", "shiptoCity", "shiptoState", "shiptoCountry",
      "shiptoPostalCode", "shiptoContact", "shiptoContactHonorific", "shiptoContactFirstName",
      "shiptoContactMiddleName", "shiptoContactLastName", "shiptoContactSuffix",
      "shiptoContactPhone", "shiptoContactTitle", "shiptoContactFax", "shiptoContactEmail",
      "orderNotes", "shipNotes", "fob", "shipVia", "currency", "calculateFreight", "shipZone",
      "margin", "freightWeight", "subtotal", "taxTotal", "miscCharge", "freight", "total",
      "lineItems", "comments", "files", "accounts", "contacts", "urls", "items", "opportunities",
      "incidents", "toDos", "project", "projects", "customers", "opportunity"],
      requiredAttributes: ["quoteDate", "calculateFreight", "customer", "terms", "salesRep",
      "number"],
      idAttribute: "number",
    /**
      @member Setup
      @memberof Quote
      @description Used in sales module
    */
      extensions: ["sales"],
       /**
      @member Privileges
      @memberof Quote
      @description Users can create, update, and delete Quote if they have the
      'MaintainQuotes' privilege.
    */
      privileges: {
        createUpdateDelete: ["MaintainQuotes", "ViewQuotes"],
        read: true
      }
      
    };
  var additionalTests =  function () {
    /**
      @member Buttons
      @memberof Quote
      @description Overview panel should exist to display the order details of Customer/Prospect and its properties
     */
      it.skip("Overview panel should exist to display the order details of the selected" +
      "Customer/Prospect and its properties", function () {
      });
      /**
      @member Buttons
      @memberof Quote
      @description Line Items panel should exist to display the line items of the Quote
     */
      it.skip("Line Items panel should exist to display the line items of the Quote", function () {
      });
    /**
      @member Buttons
      @memberof Quote
      @description Settings panel should exist to display the settings of the Quote created for the respective Customer/Prospect
     */
      it.skip("Settings panel should exist to display the settings of the Quote created for the" +
      "respective Customer/Prospect", function () {
      });
      /**
      @member Buttons
      @memberof Quote
      @description Comments panel should exist to create or review the comments of the Quote
     */
      it.skip("Comments panel should exist to create or review the comments of the" +
      "Quote", function () {
      });
      /**
      @member Buttons
      @memberof Quote
      @description Documents panel should exist to create/attach a document to the Quote
     */
      it.skip("Documents panel should exist to create/attach a document to the Quote", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Bill-To contact and Ship-To Contact folder options should be in-active, if no Customer is selected in the Overview panel
     */
      it.skip("Bill-To contact and Ship-To Contact folder options should be in-active, if no" +
      "Customer is selected in the Overview panel", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Schedule Date in the Overview panel should set to least Schedule Date of the Quote's Line Items
     */
      it.skip("Schedule Date in the Overview panel should change according to the least Schedule" +
      "Date of the Quote's Line Items", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description User should not allow to create a Quote without assigning Terms to the Order
     */
      it.skip("User should not allow to create a Quote without assigning Terms to the" +
      "order", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Clearing the Customer/Prospect should clear the related values
     */
      it.skip("Clearing the Customer/Prospect should clear the related values", function () {
      });
	 
      /**
      @member Settings
      @memberof Quote
      @description User should not allow to create a Quote without entering quoteDate under overview widget
     */
      it.skip("User should not allow to create a Quote without entering quoteDate under overview" +
      "widget", function () {
      });
     /**
      @member Settings
      @memberof Quote
      @description User should not allow to create a Quote without assigning sales rep to the order
     */
      it.skip("User should not allow to create a Quote without assigning sales rep to the order", function () {
      });
     /**
      @member Settings
      @memberof Quote
      @description User should not allow to create a Quote without entering quote number when 'Number Policy' under sales configuration screen is set to 'Manual'
     */
      it.skip("User should not allow to create a Quote without entering quote number when" +
      "'Number Policy' under sales configuration screen is set to 'Manual'", function () {
      });
     /**
      @member Buttons
      @memberof Quote
      @description Export button under line-item panel should export the quote details into csv report
     */
      it.skip("Export button under line-item panel should export the quote details into csv report", function () {
      });
      /**
      @member Buttons
      @memberof Quote
      @description User should not allow to save a Quote without at least one line item
     */
      it.skip("User should not allow to save a Quote without at least one line item", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description New button under line items widget should be inactive till customer is entered under overview widget
     */
      it.skip("New button under line items widget should be inactive till customer is entered" +
      "under overview widget", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Default ship-to address should get populate automatically on selecting the customer under Overview widget
     */
      it.skip("Default ship-to address should get populate automatically on selecting the customer" +
      "under Overview widget", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Shuffling between ship-to address should display address details correctly
     */
      it.skip("Shuffling ship-to address should display address details correctly", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Configuring Number Policy as 'Manual' in sales configure screen should allow user to enter quote number manually
     */
      it.skip("Configuring Number Policy as 'Manual' in sales configure screen should allow user" +
      "to enter quote number manually", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Configuring Number Policy as 'Automatic' in sales configure screen should generate quote number correctly
     */
      it.skip("Configuring Number Policy as 'Automatic' in sales configure screen should generate" +
      "quote number correctly", function () {
      });
     /**
      @member Settings
      @memberof Quote
      @description Configuring Number Policy as 'Override Allowed' in sales configure screen should generate quote number correctly and allow use to edit the quote number
     */
      it.skip("Configuring Number Policy as 'Override Allowed' in sales configure screen should" +
      "generate quote number correctly and allow use to edit the quote number", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Schedule date displayed under line item should be similar with the schedule date under overview widget
     */
      it.skip("Schedule date displayed under line item should be similar with the schedule date" +
      "under overview widget", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Schedule date displayed under line item should be similar with the schedule date under overview widget
     */
      it.skip("Schedule date displayed under line item should be similar with the schedule date" +
      "under overview widget", function () {
      });
      /**
        @member -
        @memberof SalesOrder
        @description Selecting to change the quote line item quantity should display a confirmation dialog asking whether to update the price or not.Selecting 'Yes', should update the price, selecting 'No' should remain the prices unchanged
      */
      it.skip("Selecting to change the quote line item quantity should display a confirmation" +
      "dialog asking whether to update the price or not.Selecting 'Yes', should update the price" +
      "selecting 'No' should remain the prices unchanged", function () {
      });
      /**
      @member Settings
      @memberof Quote
      @description Converting a Quote which has Prospect as the customer should convert Prospect to Customer
     */
      it.skip("Converting a Quote which has Prospect as the customer should convert Prospect to" +
      "Customer", function () {
      });
      /**
      @member Navigation
      @memberof Quote
      @description Selecting 'Convert' option from the Actions menu on a quote, should convert quote to a sales order with same Quote number
      */
      it.skip("Selecting 'Convert' option from the Actions menu of a quote, should convert quote" +
      "to a sales order with same Quote number", function () {
      });
      /**
      @member Button
      @memberof Quote
      @description Selecting 'Delete' option from the Actions menu of a quote, should delete the selected quote from quotes list
     */
      it.skip("Selecting 'Delete' option from the Actions menu of a quote, should delete the" +
      "selected quote from quotes list", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
    
