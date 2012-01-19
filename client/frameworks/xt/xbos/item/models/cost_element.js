// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */
/** @class

  Element for Cost.

  @extends XM.Record
*/
XM.CostElement = XM.Record.extend(
/** @scope XM.CostElement.prototype */ {

  className: 'XM.CostElement',

  /**
  @type String
  */
  elementName: SC.Record.attr(String),

  /**
  @type Boolean 
  */
  isActive: SC.Record.attr(Boolean),
  
  /**
  @type Boolean 
  */
  isSystem: SC.Record.attr(Boolean),
  
   /**
  @type Boolean 
  */
  isVoucherDistribution: SC.Record.attr(Boolean),
  
   /**
  @type XM.CostItem
  */
  costItem: SC.Record.toOne('XM.CostItem', {
    inverse: 'costElements',
    isMaster: NO,
  }),
  
 });
