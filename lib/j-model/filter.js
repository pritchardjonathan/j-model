

module.exports = function(model, tags){
  var tagMap = {},
    filteredData = {},
    config = model.jModel.getConfig();

  if(tags){
    // Create a tag map for quick access later TODO: worth the initial expense?
    tags.forEach(function(tag){
      tagMap[tag] = true;
    });
  }

  // Filter data and return
  config.attributes.forEach(function(attribute){
    var include,
      internalAttributeData;
    if(!tags) include = true;
    else if(!attribute.tags || !attribute.tags.length) include = false;
    else {
      include = attribute.tags.some(function (tag) {
        return !!tagMap[tag];
      });
    }
    if(include){
      internalAttributeData = model[attribute.name];
      if(internalAttributeData) {
        if (!attribute.array && internalAttributeData.jModel) {
          internalAttributeData = module.exports(internalAttributeData, tags);
        } else if(internalAttributeData.length && internalAttributeData[0].jModel){
          internalAttributeData = internalAttributeData.map(function(internalAttributeDataItem){
            return module.exports(internalAttributeDataItem, tags);
          });
        }

      }
      filteredData[attribute.name] = internalAttributeData;
    }
  });
  return filteredData;
};