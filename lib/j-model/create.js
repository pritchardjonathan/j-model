var converterFactory = require("./converterFactory");

module.exports = function(name, config){

  preProcessConfig(config);
  /**
   *
   * @param {object} data - Constructor data to populate the new model instance with
   * @constructor
   */
  function JModel(data){
    var self = this,
      internalData = {};

    if(!data) data = {};

    // Iterate attributes and apply to this instance
    if(config.attributes){
      config.attributes.forEach(function(attribute){
        if(attribute.type !== "function") {
          applyProperty(attribute);
        } else {
          applyHelper(attribute);
        }
      });
    }

    // Call the init method if supplied
    if(config.init) config.init.call(self, data);


    self.jModel = {
      /**
       * Provides access to the models name
       * @returns {string}
       */
      getName: function(){ return name; },
      /**
       * Provides access to the models configuration
       * @returns {Object}
       */
      getConfig: function(){ return config; }
    };


    /**
     * Provide access to the plain internal data object for serialisation
     * @returns {Object}
     */
    self.toJSON = function(){
      return internalData;
    };
    /**
     *
     * @param attribute
     */
    function applyProperty(attribute){
      var converter;

      if(attribute.array) converter = converterFactory.getArrayConverter(attribute.type);
      else converter = converterFactory.getConverter(attribute.type);
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
    }

    /**
     *
     * @param attribute
     */
    function applyHelper(attribute){
      self[attribute.name] = attribute.fn.bind(self);
    }
  }

  // Create converter for this model type

  converterFactory.registerConverter(name, function(value, attribute){
    if(!value) return null;
    if(value instanceof JModel) {

      if (value.jModel.getName() === attribute.type){
        if(attribute.nestedModelTags) return new JModel(value.toJSON(), attribute.nestedModelTags);
        else return value;
      }
      else value = value.toJSON();
    }
    if(typeof value !== "object") return null;
    else return new JModel(value, attribute.nestedModelTags);
  });

  JModel.getName = function(){ return name; };

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
        if(type.name === "JModel") return type.getName();
        else return type.name.toLowerCase();
      }
      else return "default";
    }

  }

};


