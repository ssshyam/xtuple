/* Delete previously misnamed record */
delete from xt.js where js_context='xtuple' and js_type = 'item_site';

select xt.install_js('XM','ItemSite','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.ItemSite) { XM.ItemSite = {}; }

  XM.ItemSite.isDispatchable = true;

  /**
    Return the current cost for a particular item site.
  */
  XM.ItemSite.cost = function (itemsiteId) {
    if (!XT.Data.checkPrivilege('ViewCosts')) { return null; }
    return plv8.execute('select itemcost(itemsite_id) as cost from itemsite where obj_uuid = $1;', [itemsiteId])[0].cost;
  };

  /** @private */
  var _fetch = function (recordType, backingType, query, idColumn) {
    query = query || {};
    idColumn = idColumn || 'itemsite_id';

    var data = Object.create(XT.Data),
      nameSpace = recordType.beforeDot(),
      type = recordType.afterDot(),
      tableNamespace = backingType.beforeDot(),
      table = backingType.afterDot(),
      orm = data.fetchOrm(nameSpace, type),
      keyColumn = XT.Orm.primaryKey(orm, true),
      customerId = null,
      accountId = -1,
      shiptoId,
      effectiveDate = new Date(),
      vendorId = null,
      limit = query.rowLimit ? 'limit ' + Number(query.rowLimit) : '',
      offset = query.rowOffset ? 'offset ' + Number(query.rowOffset) : '',
      clause,
      ret = {
        nameSpace: nameSpace,
        type: type
      },
      itemJoinMatches,
      itemJoinTable,
      keySearch = false,
      extra = "",
      qry,
      counter = 1,
      ids = [],
      idParams = [],
      sqlCount,
      sql1 = 'select t1.%3$I as id ' +
            'from %1$I.%2$I t1 {joins} ' +
            'where {conditions} {extra}',
      sql2 = 'select * from %1$I.%2$I where id in ({ids}) {orderBy}';

    /* Handle special parameters */
    if (query.parameters) {
      query.parameters = query.parameters.filter(function (param) {
        var result = false;

        /* Over-ride usual search behavior */
        if (param.keySearch) {
          keySearch = param.value;
          sql1 += ' and itemsite_item_id in (select item_id from item where item_number ~^ ${p1} or item_upccode ~^ ${p1}) ' +
            'union ' +
            'select t1.%3$I ' +
            'from %1$I.%2$I t1 {joins} ' +
            ' join itemalias on itemsite_item_id=itemalias_item_id ' +
            '   and itemalias_crmacct_id is null ' +
            'where {conditions} {extra} ' +
            ' and (itemalias_number ~^ ${p1}) ' +
            'union ' +
            'select t1.%3$I ' +
            'from %1$I.%2$I t1 {joins} ' +
            ' join itemalias on itemsite_item_id=itemalias_item_id ' +
            '   and itemalias_crmacct_id={accountId} ' +
            'where {conditions} {extra} ' +
            ' and (itemalias_number ~^ ${p1}) ';
          return false;
        }

        switch (param.attribute)
        {
        case "customer":
          customerNumber = param.value;
          customerId = data.getId(data.fetchOrm('XM', 'CustomerProspectRelation'), param.value);
          accountId = data.getId(data.fetchOrm('XM', 'AccountRelation'), param.value);
          break;
        case "shipto":
          shiptoId = data.getId(data.fetchOrm('XM', 'CustomerShipto'), param.value);
          break;
        case "effectiveDate":
          effectiveDate = param.value;
          break;
        case "vendor":
          vendorId = data.getId(data.fetchOrm('XM', 'VendorRelation'), param.value);
          break;
        default:
          result = true;
        }
        return result;
      });
    }

    clause = data.buildClause(nameSpace, type, query.parameters, query.orderByColumns);

    /* Check if public.item is already joined through clause.joins. */
    if (clause.joins && clause.joins.length) {
      itemJoinMatches = clause.joins.match(/(.item )(jt\d+)/g);

      if (itemJoinMatches && itemJoinMatches.length) {
        itemJoinTable = itemJoinMatches[0].match(/(jt\d+)/g);
      }
    }

    if (!itemJoinTable) {
      /* public.item is not already joined. Set the default name. */
      itemJoinTable = 'sidejoin';
    }

    /* If customer passed, restrict results to item sites allowed to be sold to that customer */
    if (customerId) {
      extra += ' and ' + itemJoinTable + '.item_id in (' +
             'select item_id from item where item_sold and not item_exclusive ' +
             'union ' +
             'select item_id from xt.custitem where cust_id=${p2} ' +
             '  and ${p4}::date between effective and (expires - 1) ';

      if (shiptoId) {
        extra += 'union ' +
               'select item_id from xt.shiptoitem where shipto_id=${p3}::integer ' +
               '  and ${p4}::date between effective and (expires - 1) ';
      }

      extra += ") ";

      if (!clause.joins) {
        clause.joins = '';
      }

      /* public.item is not already joined. Add it here. */
      if (itemJoinTable === 'sidejoin') {
        clause.joins = clause.joins + ' left join item ' + itemJoinTable + ' on t1.itemsite_item_id = ' + itemJoinTable + '.item_id ';
      }
    }

    /* If vendor passed, and vendor can only supply against defined item sources, then restrict results */
    if (vendorId) {
      extra +=  ' and ' + itemJoinTable + '.item_id in (' +
              '  select itemsrc_item_id ' +
              '  from itemsrc ' +
              '  where itemsrc_active ' +
              '    and itemsrc_vend_id=' + vendorId + ')';

      if (!clause.joins) {
        clause.joins = '';
      }

      /* public.item is not already joined. Add it here. */
      if (itemJoinTable === 'sidejoin') {
        clause.joins = clause.joins + ' left join item ' + itemJoinTable + ' on t1.itemsite_item_id = ' + itemJoinTable + '.item_id ';
      }
    }

    if (query.count) {
      /* Just get the count of rows that match the conditions */
      sqlCount = 'select count(distinct t1.%3$I) as count from %1$I.%2$I t1 {joins} where {conditions} {extra};';
      sqlCount = XT.format(sqlCount, [tableNamespace.decamelize(), table.decamelize(), idColumn]);
      sqlCount = sqlCount.replace(/{conditions}/g, clause.conditions)
                         .replace(/{extra}/g, extra)
                         .replace('{joins}', clause.joins)
                         .replace(/{p2}/g, clause.parameters.length + 1)
                         .replace(/{p3}/g, clause.parameters.length + 2)
                         .replace(/{p4}/g, clause.parameters.length + 3);

      if (customerId) {
        clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
      }

      if (DEBUG) {
        XT.debug('ItemSiteListItem sqlCount = ', sqlCount);
        XT.debug('ItemSiteListItem values = ', clause.parameters);
      }

      ret.data = plv8.execute(sqlCount, clause.parameters);

      return ret;
    }

    sql1 = XT.format(
      sql1 += '{orderBy} %4$s %5$s;',
      [tableNamespace, table, idColumn, limit, offset]
    );

    /* Query the model */
    sql1 = sql1.replace(/{conditions}/g, clause.conditions)
             .replace(/{extra}/g, extra)
             .replace(/{joins}/g, clause.joins)
             .replace('{orderBy}', clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace('{accountId}', accountId)
             .replace(/{p1}/g, clause.parameters.length + 1)
             .replace(/{p2}/g, clause.parameters.length + (keySearch ? 2 : 1))
             .replace(/{p3}/g, clause.parameters.length + (keySearch ? 3 : 2))
             .replace(/{p4}/g, clause.parameters.length + (keySearch ? 4 : 3));

    if (keySearch) {
      clause.parameters.push(keySearch);
    }
    if (customerId) {
      clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
    }
    if (DEBUG) {
      XT.debug('ItemSiteListItem sql1 = ', sql1.slice(0,500));
      XT.debug(sql1.slice(500, 1000));
      XT.debug(sql1.slice(1000, 1500));
      XT.debug(sql1.slice(1500, 2000));
      XT.debug(sql1.slice(2000, 2500));
      XT.debug('ItemSiteListItem parameters = ', clause.parameters);
    }
    qry = plv8.execute(sql1, clause.parameters);

    if (!qry.length) {
      ret.data = [];
      return ret;
    }

    qry.forEach(function (row) {
      ids.push(row.id);
      idParams.push("$" + counter);
      counter++;
    });

    sql2 = XT.format(sql2, [nameSpace.decamelize(), type.decamelize()]);
    sql2 = sql2.replace(/{orderBy}/g, clause.orderBy)
               .replace('{ids}', idParams.join());

    if (DEBUG) {
      XT.debug('fetch sql2 = ', sql2);
      XT.debug('fetch values = ', JSON.stringify(ids));
    }

    ret.data = plv8.execute(sql2, ids);

    return ret;
  };

  if (!XM.ItemSiteListItem) { XM.ItemSiteListItem = {}; }

  XM.ItemSiteListItem.isDispatchable = true;

  /**
    Returns item site list items using usual query means with additional special support for:
      * Attributes `customer`,`shipto`, and `effectiveDate` for exclusive item rules.
      * Attribute `vendor` to filter on only items with associated item sources.
      * Cross check on `alias` and `barcode` attributes for item numbers.

    @param {String} Record type. Must have `itemsite` or related view as its orm source table.
    @param {Object} Additional query filter (Optional)
    @returns {Array}
  */
  XM.ItemSiteListItem.fetch = function (query) {
    var result = _fetch("XM.ItemSiteListItem", "public.itemsite", query);
    return result.data;
  };

  /**
   Wrapper for XM.ItemSiteListItem.fetch with support for REST query formatting.
   Sample usage:
    select xt.post('{
      "nameSpace":"XM",
      "type":"ItemSiteListItem",
      "dispatch":{
        "functionName":"restFetch",
        "parameters":[
          {
            "query":[
              {"customer":{"EQUALS":"TTOYS"}},
              {"shipto":{"EQUALS":"1d103cb0-dac6-11e3-9c1a-0800200c9a66"}},
              {"effectiveDate":{"EQUALS":"2014-05-01"}}
            ]
          }
        ]
      },
      "username":"admin",
      "encryptionKey":"hm6gnf3xsov9rudi"
    }');

   @param {Object} options: query
   @returns Object
  */
  XM.ItemSiteListItem.restFetch = function (options) {
    options = options || {};

    var items = {},
      query = {},
      result = {};

    if (options) {
      /* Convert from rest_query to XM.Model.query structure. */
      query = XM.Model.restQueryFormat(options);

      /* Perform the query. */
      return  _fetch("XM.ItemSiteListItem", "public.itemsite", query);
    } else {
      throw new handleError("Bad Request", 400);
    }
  };
  XM.ItemSiteListItem.restFetch.description = "Returns ItemSiteListItems with additional special support for exclusive item rules, to filter on only items with associated item sources and Cross check on `alias` and `barcode` attributes for item numbers.";
  XM.ItemSiteListItem.restFetch.request = {
    "$ref": "ItemSiteListItemQuery"
  };
  XM.ItemSiteListItem.restFetch.parameterOrder = ["options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.ItemSiteListItem.restFetch.schema = {
    ItemSiteListItemQuery: {
      properties: {
        attributes: {
          title: "ItemSiteListItem Service request attributes",
          description: "An array of attributes needed to perform a ItemSiteListItem query.",
          type: "array",
          items: [
            {
              title: "Options",
              type: "object",
              "$ref": "ItemSiteListItemOptions"
            }
          ],
          "minItems": 1,
          "maxItems": 1,
          required: true
        }
      }
    },
    ItemSiteListItemOptions: {
      properties: {
        query: {
          title: "query",
          description: "The query to perform.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ],
          "minItems": 1
        },
        orderby: {
          title: "Order By",
          description: "The query order by.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ]
        },
        rowlimit: {
          title: "Row Limit",
          description: "The query for paged results.",
          type: "integer"
        },
        maxresults: {
          title: "Max Results",
          description: "The query limit for total results.",
          type: "integer"
        },
        pagetoken: {
          title: "Page Token",
          description: "The query offset page token.",
          type: "integer"
        },
        count: {
          title: "Count",
          description: "Set to true to return only the count of results for this query.",
          type: "boolean"
        }
      }
    }
  };

  if (!XM.ItemSiteRelation) { XM.ItemSiteRelation = {}; }

  XM.ItemSiteRelation.isDispatchable = true;

  /**
    Returns item site relatinos using usual query means with additional special support for:
      * Attributes `customer`,`shipto`, and `effectiveDate` for exclusive item rules.
      * Attribute `vendor` to filter on only items with associated item sources.
      * Cross check on `alias` and `barcode` attributes for item numbers.

    @param {String} Record type. Must have `itemsite` or related view as its orm source table.
    @param {Object} Additional query filter (Optional)
    @returns {Array}
  */
  XM.ItemSiteRelation.fetch = function (query) {
    var result = _fetch("XM.ItemSiteRelation", "xt.itemsiteinfo", query);
    return result.data;
  };

}());

$$ );
