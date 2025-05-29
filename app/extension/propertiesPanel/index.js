// import { CustomPropertiesProvider } from './CustomPropertiesProvider';

import { CustomPropertiesProvider } from "./CustomPropertiesProvider";

// export default {
//   __init__: [ 'rangePropertiesProvider' ],
//   rangePropertiesProvider: [ 'type', CustomPropertiesProvider ]
// };



export default {
  __init__: ['customSelectPropertiesProvider'],
  customSelectPropertiesProvider: ['type', CustomPropertiesProvider]
};