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
           // check if attribute should be picked
           let value = Boolean(description.translatable);
           if (value === false) {
             if (description.inputType === 'Asset:other') {
               value = true; // Treat 'source' and 'src' as translatable
             } else {
               break; // Skip non-translatable strings
             }
           }
          // add value to store
          paths[attributePath + description.name + '/'] = value;
          break;
      }
    }, '/');
    return Object.keys(paths);
  }

}

module.exports = ModelSchema;
