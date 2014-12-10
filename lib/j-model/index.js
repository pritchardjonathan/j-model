var moment = require("moment"),
  converterFactory = {},
  modelConstructorCache = {};

exports.create = function(name, config){
  preProcessConfig(config);
  function ModelConstructor(data){
    var self = this,
      internalData = {};
    if(config.attributes){
      config.attributes.forEach(function(attribute){
          var converter;

        if(attribute.array) converter = createArrayConverter(attribute.type);
        else converter = converterFactory[attribute.type];
        // If no converter was found create a basic converter
        if(!converter) converter = function(value){ return value; };

        Object.defineProperty(self, attribute.name, {
          get: function(){
            return internalData[attribute.name];
          },
          set: function(value){
            internalData[attribute.name] = converter(value);
          }
        });
      });
    }
    self.getModelName = function(){ return name; }
  }
  modelConstructorCache[name] = ModelConstructor;
  return ModelConstructor;

  function preProcessConfig(config){
    if(!config.attributes){
      config.attributes = [];
      return;
    }
    config.attributes = config.attributes.map(function(attribute){
      var processedAttribute = {
        name: getPropertyName(attribute),
        type: getPropertyType(attribute)
      };
      if(attribute.array) processedAttribute.array = true;
      else if(attribute.type) processedAttribute.array = Array.isArray(attribute.type);
      return processedAttribute;
    });
  }

  function getPropertyName(attribute){
    if(typeof attribute === "string") return attribute;
    else if(attribute.name) return attribute.name;
    else throw new Error("Missing attribute name");
  }

  function getPropertyType(attribute){
    var type,
      typeType;

    if(typeof attribute === "string") return "default";

    type = attribute.type;

    if(Array.isArray(type)) type = type[0];

    typeType = typeof type;

    if(typeType === "string") return type;
    else if(typeType === "function"){
      if(type instanceof ModelConstructor) return type.getModelName();
      else if(type.name) return type.name.toLowerCase();
      else return "default";
    }

  }

};

converterFactory["string"] = function(value){
    return value + "";
};

converterFactory["number"] = function(value){
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

converterFactory["date"] = function(value){
  var moValue;
  if(value instanceof Date === false){
    moValue = moment(value);
    value = moValue.isValid() ? moValue.toDate() : null;
  }
  return value;
};

converterFactory["boolean"] = function(value){
  if(typeof value !== "boolean"){
    if(value === "true") value = true;
    else if(value === "false") value = false;
    else value = !!value;
  }
  return value;
};

function createArrayConverter(type){
  var converter = converterFactory[type];
  if(!converter) return function(value){
    return value && Array.isArray(value) ? value : [];
  };
  else return function(value){
    if(!value) return null;
    if(!Array.isArray(value)) value = [];
    // Assignment conversion
    value = value.map(function(valueItem){
      return converter(valueItem)
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
}
