module.exports = function(model, callback){
  var validationResult = { valid: true, global: null, attribute: null };

  validateAttributes(model, function(err, attributeValidationResult){
    validationResult.attribute = attributeValidationResult;
    if(!attributeValidationResult.valid) validationResult.valid = false;
    validateGlobal(model, function(err, globalValidationResult){
      validationResult.global = globalValidationResult;
      if(!globalValidationResult.valid) validationResult.valid = false;
      callback(err, validationResult);
    });
  });


};

function validateAttributes(model, callback){
  var attributes = model.getModelConfig().attributes,
    result = { valid: true, messages: [] },
    attributesValidatedCount = 0;

  if(!attributes || !attributes.length) callback(null, result);

  attributes.forEach(function(attribute){
    var validatorsValidatedCount = 0;
    if(!attribute.validators || !attribute.validators.length){
      attributeValidated();
      return;
    }
    attribute.validators.forEach(function(validator){
      var syncResult = validator.call(
        model,
        model[attribute.name],
        {
          addMessage: function(message){
            result.messages.push({ name: attribute.name, message: message });
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
  var config = model.getModelConfig(),
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