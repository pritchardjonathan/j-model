
exports.required = function(message){
  return function(value, result){
    if(!value){
      result.addMessage(message);
      return false;
    } else return true;
  };
};

exports.email = function(message){
  return function(value, result){
    if(!value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)){
      result.addMessage(message);
      return false;
    } else return true;
  };
};

exports.min = function(min, message){
  return function(value, result){
    if(value < min){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};

exports.max = function(max, message){
  return function(value, result){
    if(value > max){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};

exports.range = function(min, max, message){
  return function(value, result){
    if(value < min || value > max){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};

exports.minLength = function(min, message){
  return function(value, result){
    if(!value || value.length < min){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};

exports.maxLength = function(max, message){
  return function(value, result){
    if(value && value.length > max){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};

exports.lengthRange = function(min, max, message){
  return function(value, result){
    if(value.length < min || value.length > max){
      result.addMessage(message);
      return false;
    }
    else return true;
  };
};


