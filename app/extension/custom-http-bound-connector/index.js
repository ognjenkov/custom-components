import { CustomSelect, customSelectType } from './CustomSearchSelect'

class CustomFormFields {
  static $inject = ['formFields']
  constructor(formFields) {
    formFields.register(customSelectType, CustomSelect)
  }
}

export default {
  __init__: ['selectField'],
  selectField: ['type', CustomFormFields],
}
