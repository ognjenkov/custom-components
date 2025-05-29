import { FileRenderer, fileType } from './FormFile'

class CustomFormFields {
  constructor(formFields) {
    formFields.register(fileType, FileRenderer)
  }
}

export default {
  __init__: ['fileField'],
  fileField: ['type', CustomFormFields],
}
