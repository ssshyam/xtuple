// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================

/**
  @json

 An ORM is an Object Relational Mapping that defines the relationship between object oriented type
 definitions and relational tables or views in a database. This implementation is currently designed 
 to apply specifically to a PostgreSQL database, but theoretically could be applied to any database 
 for which an ORM API is defined to process these definitions.
 
 In the xTuple PostgreSQL implmentation the installation of ORM files triggers views to be created 
 whose structures and rules conform to the definition of the ORM. The ORMs use camel and class case
 conventions when referencing object attributes and snake case conventions when referencing database 
 attributes. Because ORMs generates views, these views can in turn be referenced by other ORMs to manage 
 a class hierachy. To determine the name of a view created by an ORM simply convert the name space 
 qualified type of the object to a snake case schema and view name like so:
 
 Object Name      Datbase Name
 --------------   ----------------
 XM.Contact       xm.contact
 XM.ToDo          xm.to_do
 XM.ToDoComment   xm.to_do_comment
 
 ORMs are specifically designed to be extensible so that a database table can be virtually expanded
 without changing the original table definition, while presenting the new data through the ORM API 
 as though it were all one unit. This effectively ensures that "core" database definitions
 and custom or 3rd party data extensions are effectively encapuslated from one another. In addition
 ORMs can be activated and deactivated in the xt.orm table so extensions can be "turned off" at
 any time.
 
 The initial ORM is referred to as the "base" ORM. Additional ORMs can be defined against the 
 original base using the same name space and type but giving them a different context name and 
 setting the isExtension flag to true. Typically the table on an ORM extension should reside in a 
 different database schema where you would create a table with colums that contain data you want to 
 "add" to a table in the original schema. The new table should contain a column relation to associate 
 with the original (which may also be the primary key for it as well.) When you create an ORM
 extension the new table will be left joined on the original. Any inserts, updates or delete 
 actions will propagate results to both the original and the new table automatically.
 
 Extensions can be created as both completely independent ORM definitions or added to an 
 extension array on a base or extension ORM.
 
*/
{
  /** 
  A container identifier that correlates with an object name space.

  Required.

  @type {String}
  */
  
  "nameSpace": "XM",
  
  /** 
  A specific type name that correlates with an object type.
     
  Required.

  @type {String}
  */
  "type": "ProjectTask",
  
  /** 
  Context is a sub container for name space that allows extending the same 
  name space and type in different contexts. The name space, type and context 
  must be unique. When you extend an ORM outside the original definition, you 
  should create a new context for each extension.

  Required.

  @type {String}
  */
  "context": "xtuple",
  
  /** 
  The source table or view from which you are drawing data. Schema qualifications
  should be included when referencing views created by other ORMs. Only one table
  may be defined per root ORM. Use extensions to relate additional tables.
     
  Required.

  @type {String}
  */
  "table": "prjtask",
  
  /** 
  Indicates this ORM is an extension to another ORM. A join will be created between
  the two tables to represent them as one in the corresponding view.

  @type {Boolean}
  @default false
  */
  "isExtension": false, 
  
  /** 
  This value only applies to extensions and indicates the query should perform a join
  instead of a left join to improve performance. It should only be used in cases where
  a related record on the extension's table is always guaranteed to exist.
  
  @type {Boolean}
  @default false
  */
  "isChild": false,   
  
  /** 
  The table sequence to use when generating the next unique record id. Necessary 
  for any objects for which new records can be created.

  @type {String}    
  */
  "idSequenceName": "prjtask_prjtask_id_seq",
  
  /** 
  Text describing the purpose of the ORM which will be appended to the associated 
  view.

  @type {String}
  */
  "comment": "Project Task Map",
  
  /** 
  Designates that data for this type can only be accessed in the context of a parent. Any attempts 
  by a client to query or update this record directly, regardless of privilege settings, will fail.
    
  @type {Boolean}
  @default false
  */   
  "isNestedOnly": false,
  
  /** 
  Used to describe document access. If absent no access will be granted to this type.

  Required.
   
  @type {Object}
  */
  "privileges": {
    /** 
    Describes privileges that allow a user to have access to all records of this 
    object type. The same privilege can be set to control multiple or all of the create, read, 
    update and delete (aka. crud) access methods. Privilege settings can be a boolean that indicates
    universal access or lack thereof, or a string that refereces a specific privilege name that
    allows access if the user has been granted the privilege.
     
    Required.
     
    @type {Hash}
    */
    "all": {
      /** 
      The create privilege for this object.
      
      @type {String}
      */
      "create": "MaintainAllProjects",
      
      /** 
      The read privilege for this object. 
      
      @type {String}
      */
      "read": "ViewAllProjects",
      
      /** 
      The update privilege for this object. This 
      privilege also implicitly enables read access if
      the privilege for read is not explicitly granted.
    
      @type {String}
      
      */
      "update": "MaintainAllProjects",
      
      /** The delete privilege for this object.
      
         @type {String}
      */
      "delete": "MaintainAllProjects"
    },
    
    /**
    Describes privileges that allow a user to have access only to specific records 
    of this object type as defined by a specific relationship between the user and the 
    record as determined by matching logged in user account name to the value of the 
    fields listed in the "properties" array.

    @type {Hash}
    */
    "personal": {
      /** 
      The personal create privilege for this object.
      
      @type {String}
      */
      "create": "MaintainPersonalProjects",
      
      /** 
      The personal read privilege for this object.
      
      @type {String}
      */
      "read": "ViewPersonalProjects",
      
      /** 
      The personal update privilege for this object. This privilege also implicitly 
      enables read access if the privilege for read is not explicitly granted.
      
      @type {String}
      */
      "update": "MaintainPersonalProjects",
      
      /** 
      The personal delete privilege for this object.
      
      @type {String}
      */
      "delete": "MaintainPersonalProjects",
      
      /** 
      An array properties on the object on which to compare the logged in user 
      account name to determine access.
      
      @type {Array}
      */
      "properties": [
        "owner",
        "assignedTo",
        "projectOwner",
        "projectAssignedTo"
       ]
    }
  },
  /** 
  The array of client object properties that maps to table columns. Each hash listed 
  should have one and only one of the following properties: attr, toOne or toMany, 
  the purposes of which are described below.
  
  Required.
  
  @type {Array}
  */
  "properties": [
    {
      /** 
      The property name.
       
      Required.
         
      @type {String}
      */
      "name": "guid",
      
      /** 
      Indicates this property is an attribute that maps directly to table column.
         
      @type {Hash}
      */
      "attr": {
        /** 
        The expected type of the property. Can be any of the following: 
          * String
          * Date
          * Boolean
          * Number
          * Money
          * Quantity
          * QuantityPer
          * Cost
          * SalesPrice
          * PurchasePrice
          * ExtendedPrice
          * UnitRatio
          * Percent
          * Weight
           
        @type {String}
        */
        "type": "Number",
        
        /** 
        The mapped database column associated with this property.
           
        @type {String}
        */        
        "column": "prjtask_id",
        
        /**
        Indicates this column is the relation to be used qualifying updates and deletions.

        The current implementation requires one and only one property to be defined as 
        the primary key per map.

        @type {Boolean}
        @default false
        */   
        "isPrimaryKey": true,
        
        /**
        Use to indicate a mandatory property.
        */
        "isRequired": true,
        
        /** 
        Indicates a fixed value on which to filter all table reads and set as default on 
        new inserts. It can not be updated. 
        
        Useful for tables that store data of mixed types where one column holds
        a source code string that designates the type as part of compound key. It forces 
        queries to return and affect only records with values that match the one
        defined here.
           
        @type {Any}
        @default false
        */   
        "value": "TA",
        
        /** 
        Flags whether the proprety should be visible on query results or not. 
        
        Useful when used in conjunction with "value" where there is no need to see the 
        fixed value in a result set.
           
        @type {Boolean}
        @default {true}
        */
        "isVisible": false,
        
        /** 
        Flags whether the property must be encrypted. When true, the data source must pass
        an encryption key in with the payload to encrypte the data. If one is not found
        the commit will fail.
           
        @type {Boolean}
        @default {true}
        */
        "isEncrypted": false,
        
        /**
        Default value specifies initial value you want populated in the property. Can be a 
        string, number or boolean. 
        
        There is also support for special keywords: 
          * "currentDate", 
          * "currentUser"
          * "baseCurrency" 
          
        Each of these will generate correct default value functions
        on client side generated code using the xTuple datasource model generator.
        */
        "defaultValue": "O"        
        
        /**
        SC.RecordAttribute property. Indicates whether a "Date" type will use the ISO8601
        format.

        Even though it defaults to true in the Client, the xTuple datasource model generator
        will override this condition if not explicitly expressed.
           
        @type {Boolean}
        @default {false}
        */
        "useIsoDate": true,
        
      },
      
      /** 
      Indicates this property will return the entire row to which this column is related.
         
      @type {Hash}
      */
      "toOne": {
        
        /** 
        The non-name space qualified type name of the object to which this property is 
        related. This ORM will be dependent on the definition of this object already existing 
        and will not install unless it does.

        Required.
        */
        "type": "UserAccountInfo",
        
        /** 
        If true the returned value will contain the complete row for each matching record, otherwise 
        the value will return exactly like a regular attribute.

        @type {Boolean}
        @default false
        */
        "isNested": true,
        
        /** 
        The table column to map to. It should be a foreign key relation to the corresponding type.
           
        Required.

        @type {String}
        */
        "column": "prjtask_username",
        
        /**
        The property relation of the type on which to join. Will accept camel case or snake case 
        mappings, but camel case is recommended. 
           
        Required.

        @type {String}
        @default guid
        */
        "inverse": "username",
        
        /** 
        If true a join will be performed on the table instead of a left join to improve performance.
        This should only be done if this property is required and is always guaranteed to have
        a value.

        @type {Boolean}
        @default false
        */
        "isChild": false,
      },
      
      /** 
      Indicates this property will return an array of all records to which it is related.
         
      @type {Hash}
      */
      "toMany": {
      
        /** 
        The type name of the objects to be included. Type name should be class case and not include 
        a name space qualification. 
           
        Note that the toMany relationship will be dependent on an ORM of this type in a matching 
        name space already existing. If it does not installation will fail.
           
        Required.

        @type {String}
        */
        "type": "ProjectTaskComment",
        
        /** 
        The table column to map to. If not specified all rows for the type will be returned.

        @type {String}
        */
        "column": "prjtask_id",
        
        /** 
        The key that is the relation to the column. Ignored if no column specified.
        
        @type {String}
        */
        "inverse": "project_task",
        
        /** 
        If true the returned array will contain the complete row for each matching record, otherwise 
        the array will contain only primary keys for matching records.
           
        Nested records will be automatically deleted when the parent is deleted so long as their edit 
        rules allow it. See deleteDelegate for situations where the rules are in conflict.
           
        @see deletDelegate
        @type {Boolean}
        @default false
        */
        "isNested": true,
        
        /** 
        Delete delegates are useful when you want nested records deleted when the parent is deleted, 
        but rules on the type conflict with this behavior. For example you may have nested records
        where the delete privilege on the toMany type's ORM is set to false because normally users 
        should not be able delete these records, however you do want the records to delete if the parent 
        is deleted. Normally if you attempt to delete these records, the underlying delete rule 
        for the type will 'do nothing.'
           
        The deleteDelegate allows you to redirect the delete rule to another table at a lower level that
        can over-ride such restrictions.
    
        @type {Hash}
        */
        "deleteDelegate": {
          /** 
          The table or view you want to actually perform the delete against.
             
          Required.

          @type {String}
          */
          "table": "comment",
          
          /** 
          Relation mappings between the object and the delete delegate table. These mappings are an array 
          that supports compound keys. Each relation should have either an inverse field mapping, or a
          fixed value, but never both.
             
          Required.

          @type {Array}
          */
          "relations": [
            {
              /** 
              The column to map to.
              
              Required.
                 
              @type {String}
              */
              "column": "comment_source_id",
              
              /** 
              A foreign key relation on the delegate table.
              
              @type {String}
              */
              "inverse": "guid",
              
              /** 
              A fixed value for the foreign key relation on the delegate table.
              
              @type {Any}
              */
              "value": "TA"
            }
          ]
        }
      }
    }
  ],
  
  /*
  A array of columns indicating the order queries on the views should be returned in.
  */
  "order": [
    "prjtask_number"
  ],
   
  /** 
  The extensions array allows you to define addtional tables on which to join to the table
  of this ORM. The following keys apply to extensions in the exact same manner as the root
  definition:
    
    * table
    * isChild
    * properties
    * order
    
  Note that the name space should not be included in extension arrays. It will be assumed
  to be the root name space. The isExension property will automatically be true on values
  listed in the extensions array.
  */
  
  "extensions": [],
  
  /** 
  Indicates the ORM has been created as part of an extension package. Helps to differentiate 
  standard from custom ORMs created by users for local implementations.
  
  @type {Boolean}
  @default false
  */
  "isSystem": false,
  
  /** 
  Dictates the sequence that extensions are processed in. Higher sequences will add columns to the
  furthermost right of the ORM views. 
  
  @type {String}
  */
  "sequence": 0
  
}
