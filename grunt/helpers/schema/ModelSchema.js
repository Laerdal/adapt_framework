const GlobalsSchema = require('./GlobalsSchema');

/**
 * Represents an article, block, accordion or other type of model schema
 */
class ModelSchema extends GlobalsSchema {

  /**
   * Create array of translatable attribute paths
   * @returns {[string]}
   */
  getTranslatablePaths() {
    const paths = {};
  
    this.traverse('', ({ description, next }, attributePath) => {
      switch (description.type) {
        case 'object':
          next(attributePath + description.name + '/');
          break;
        case 'array':
          if (!description.hasOwnProperty('items')) {
            // handles 'inputType': 'List' edge-case
            break;
          }
          if (description.items.type === 'object') {
            next(attributePath + description.name + '/');
          } else {
            next(attributePath);
          }
          break;
        case 'string':
          let value = false;
          if (description.translatable) {
            value = true;
          } else if (/^Asset:/.test(description.inputType)) {
            value = true; 
          } else if (description.inputType === 'Text' && description?.validators?.includes('url')) {
            value = true;
          }
  
          if (value) {
            paths[attributePath + description.name + '/'] = true;
          }
          break;
      }
    }, '/');
  
    return Object.keys(paths);
  }
  

}

module.exports = ModelSchema;
