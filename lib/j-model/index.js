var moment = require("moment"),
  converterFactory = {};

exports.create = function(name, config){

  preProcessConfig(config);

  function JModel(data){
    var self = this,
      internalData = {};

    if(!data) data = {};

    if(config.attributes){
      config.attributes.forEach(function(attribute){
        var converter;

        if(attribute.array) converter = createArrayConverter(attribute.type);
        else converter = converterFactory[attribute.type];
        // If no converter was found create a basic converter
        if(!converter) converter = function(value, attribute){ return value; };

        Object.defineProperty(self, attribute.name, {
          get: function(){
            return internalData[attribute.name];
          },
          set: function(value){
            internalData[attribute.name] = converter(value, attribute);
          }
        });

        internalData[attribute.name] = converter(data[attribute.name], attribute);

      });
    }

    if(config.init) config.init.call(self, data);

    self.getModelName = function(){ return name; };
    self.toJSON = function(){
      return internalData;
    };
  }

  // Create converter for this model type
  converterFactory[name] = function(value, attribute){
    if(!value) return null;
    if(value instanceof JModel) {
      if (value.getModelName() === attribute.type) return value;
      else value = value.toJSON();
    }
    if(typeof value !== "object") return null;
     else return new JModel(value);
  };

  JModel.getModelName = function(){ return name; };

  return JModel;

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
      if(typeof attribute === "object"){
        // Copy options to new attribute config object
        Object.keys(attribute).forEach(function(key){
          if(key !== "name" && key !== "type")
            processedAttribute[key] = attribute[key];
        })
      }
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
      if(type.name){
        if(type.name === "JModel") return type.getModelName();
        else return type.name.toLowerCase();
      }
      else return "default";
    }

  }

};

converterFactory["string"] = function(value, attribute){
  var type = typeof value;
  if(value === undefined) return "";
  if(value === null) return "";
    return value + "";
};

converterFactory["number"] = function(value, attribute){
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

converterFactory["date"] = function(value, attribute){
  var moValue;
  if(value instanceof Date === false){
    moValue = moment(value, attribute.dateFormat);
    value = moValue.isValid() ? moValue.toDate() : null;
  }
  return value;
};

converterFactory["boolean"] = function(value, attribute){
  if(typeof value !== "boolean"){
    if(value === "true") value = true;
    else if(value === "false") value = false;
    else value = !!value;
  }
  return value;
};

function createArrayConverter(type){
  var converter = converterFactory[type];
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
}
