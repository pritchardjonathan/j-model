var moment = require("moment"),
  typeConverterMap = {};

exports.getConverter = function(type){
  return typeConverterMap[type];
};

exports.getArrayConverter = function(type){
  var converter = typeConverterMap[type];
  if(!converter) return function(value, attribute){
    return value && Array.isArray(value) ? value : [];
  };
  else return function(value, attribute){
    if(!value) return null;
    if(!Array.isArray(value)) value = [];
    // Assignment conversion
    value = value.map(function(valueItem){
      return converter(valueItem, attribute)
    });
    // Override push() method to add type enforcement/conversion layer to existing array
    value.push = function(){
      Array.prototype.push.apply(value, new Array(arguments).map(function(argument){
        return converter(argument);
      }));
    };
    // TODO: extend conversion layer to other Array methods such as splice
    return value;
  };
};

exports.registerConverter = function(type, converter){
  typeConverterMap[type] = converter;
};


typeConverterMap["string"] = function(value, attribute){
  var type = typeof value;
  if(value === undefined) return "";
  if(value === null) return "";
  return value + "";
};

typeConverterMap["number"] = function(value, attribute){
  var type = typeof value;
  if(type !== "number"){
    if(type === "string"){
      if(value.indexOf(".") === -1) value = parseInt(value);
      else value = parseFloat(value);
    }
    if(value instanceof Date) value = value.getTime();

  }
  return value;
};

typeConverterMap["date"] = function(value, attribute){
  var moValue;
  if(value instanceof Date === false){
    moValue = moment(value, attribute.dateFormat);
    value = moValue.isValid() ? moValue.toDate() : null;
  }
  return value;
};

typeConverterMap["boolean"] = function(value, attribute){
  if(typeof value !== "boolean"){
    if(value === "true") value = true;
    else if(value === "false") value = false;
    else value = !!value;
  }
  return value;
};