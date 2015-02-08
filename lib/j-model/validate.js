module.exports = function(model, tags, callback){
  var validationResult = { valid: true, global: null, attribute: null };

  if(typeof tags === "function"){
    callback = tags;
    tags = null;
  }

  validateAttributes(model, tags, function(err, attributeValidationResult){
    validationResult.attribute = attributeValidationResult;
    if(!attributeValidationResult.valid) validationResult.valid = false;
    validateGlobal(model, function(err, globalValidationResult){
      validationResult.global = globalValidationResult;
      if(!globalValidationResult.valid) validationResult.valid = false;
      callback(err, validationResult);
    });
  });


};

function validateAttributes(model, tags, callback){
  var attributes = model.jModel.getConfig().attributes,
    result = { valid: true, messages: [] },
    attributesValidatedCount = 0;

  if(!attributes || !attributes.length) callback(null, result);

  attributes.forEach(function(attribute){
    var validatorsValidatedCount = 0, enabled = true;
    if(!attribute.validators || !attribute.validators.length){
      attributeValidated();
      return;
    }

    if(tags && tags.length){
      // Check if this attribute should be validated
      if(!attribute.tags || !attribute.tags.length) enabled = false;
      else {
        enabled = false;
        tags.some(function (tag) {
          attribute.tags.some(function(attributeTag){
            if(tag === attributeTag){
              enabled = true;
            }
            return enabled;
          });
          return enabled;
        });
      }
    }

    if(!enabled){
      attributeValidated();
      return;
    }

    attribute.validators.forEach(function (validator) {
      var syncResult = validator.call(
        model,
        model[attribute.name],
        {
          addMessage: function (message) {
            result.messages.push({name: attribute.name, message: message});
          },
          done: function (valid) {
            validatorComplete(valid);
          }
        });

      if (typeof syncResult !== "undefined") validatorComplete(syncResult);

    });

    function validatorComplete(valid){
      validatorsValidatedCount++;
      if(!valid) result.valid = false;
      if(validatorsValidatedCount === attribute.validators.length)
        attributeValidated();
    }

  });

  function attributeValidated() {
    attributesValidatedCount++;
    if (attributesValidatedCount === attributes.length)
      callback(null, result);
  }
}

function validateGlobal(model, callback){
  var config = model.jModel.getConfig(),
    validatorsValidatedCount = 0,
    result = { valid: true, messages: []};
  if(!config.validators || !config.validators.length){ callback(null, result); return; }
  config.validators.forEach(function(validator){
    var syncResult = validator.fn.call(
      model,
      model,
      {
        addMessage: function(message){
          result.messages.push({ name: validator.name, message: message });
        },
        done: function(valid){
          validatorComplete(valid);
        }
      });

    if(typeof syncResult !== "undefined") validatorComplete(syncResult);
  });
  function validatorComplete(valid){
    validatorsValidatedCount++;
    if(!valid) result.valid = false;
    if(validatorsValidatedCount === config.validators.length)
      callback(null, result);
  }
}