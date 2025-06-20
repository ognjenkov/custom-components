import { FormPlayground } from '@bpmn-io/form-js';

import RenderExtension from './extension/render';
import FileExtension from './extension/custom-file-render';
import PropertiesPanelExtension from './extension/propertiesPanel';
import CustomSelectModule from './extension/custom-http-bound-connector';

import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';

import './style.css';

import schema from './empty.json';

new FormPlayground({
  container: document.querySelector('#form'),
  schema: schema,
  data: {},

  additionalModules: [
    RenderExtension,
    FileExtension, CustomSelectModule,
    
  ],

  editorAdditionalModules: [
    PropertiesPanelExtension,
  ]
});
