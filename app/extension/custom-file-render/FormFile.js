import classNames from 'classnames'

/*
 * Import components and utilities from our extension API. Warning: for demo experiments only.
 */
import { Errors, FormContext, Textfield, Description, Label } from '@bpmn-io/form-js'
import { html, useContext } from 'diagram-js/lib/ui'
//import ProcessInstancesService from '../../services/ProcessInstances.service'

export const fileType = 'file-upload'

/*
 * This is the rendering part of the custom field. We use `htm` to
 * to render our components without the need of extra JSX transpilation.
 */
export function FileRenderer(props) {
  const { disabled, errors = [], field, readonly, value } = props

  const { description, id, label, validate = {}, organization, taskId, key } = field

  const { required } = validate

  const { formId } = useContext(FormContext)
  const jsonValue = value ? JSON.parse(value) : []

  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`

  const onChange = ({ target }) => {
    if (jsonValue.length > 0) return
    // ProcessInstancesService.uploadFile(organization, target.files).then((response) => {
    //   props.onChange({ field, value: JSON.stringify([...jsonValue, ...response]) })
    // })
    console.log(target.files)
  }

  const handleBrowse = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (readonly) return
    const input = document.getElementById(prefixId(id, formId))
    input?.click()
  }

  const handleEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (jsonValue.length > 0) return
    const fileList = e.dataTransfer.files
    if (fileList && fileList.length > 0) {
      // ProcessInstancesService.uploadFile(organization, Array.from(fileList)).then((response) => {
      //   props.onChange({ field, value: JSON.stringify([...jsonValue, ...response]) })
      // })
      console.log(Array.from(fileList))
    }
  }

  const handleFileDelete = (e, file) => {
    // ProcessInstancesService.deleteFile(organization, file.id).then(() => {
    //   props.onChange({ field, value: JSON.stringify([...jsonValue.filter((f) => f.id !== file.id)]) })
    //   if (localStorage.tasksData) {
    //     const tasksData = JSON.parse(localStorage.tasksData)
    //     if (tasksData) {
    //       localStorage.tasksData = JSON.stringify([
    //         ...tasksData.map((item) => {
    //           if (item.taskId === taskId) {
    //             return {
    //               ...item,
    //               data: {
    //                 ...item.data,
    //                 [key]: JSON.stringify([...jsonValue.filter((f) => f.id !== file.id)]),
    //               },
    //             }
    //           }

    //           return item
    //         }),
    //       ])
    //     }
    //   }
    // })
    console.log(file)
  }

  return html`<div class=${formFieldClasses(fileType)}>
    <${Label} class="mb-2" label=${label} required=${required} />
    ${jsonValue.length === 0 &&
    html` <div
      class="px-6 py-4 border border-dotted border-slate-500 bg-gray-100 rounded-md text-sm text-slate-700 flex items-center justify-center"
      onDragEnter=${handleEnter}
      onDragLeave=${handleLeave}
      onDragOver=${handleOver}
      onDrop=${handleDrop}
    >
      <input type="file" onChange=${onChange} class="hidden" id=${prefixId(id, formId)} />
      <p>
        Drag and Drop files here or
        ${readonly
        ? html`<span> browse</span>`
        : html`<a className="text-blue-500 cursor-pointer" onClick=${handleBrowse}> browse </a>`}
      </p>
    </div>`}
    <div class="mt-2 space-y-3">
      ${(jsonValue).map(
          (f) =>
            html`<div key=${f.id} class="flex text-sm text-slate-600 items-center justify-between">
            <div class="flex gap-x-2 items-center">
              <svg
                class="w-6 h-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 20V4H13V9H18V20H6Z"
                  fill="black"
                />
              </svg>

              <p class="text-md">${f.fileName}</p>
            </div>
            <button
              className="px-4"
              onClick=${(e) => {
                handleFileDelete(e, f)
              }}
            >
              <svg
                className="w-5 h-5 fill-gray-300 hover:fill-gray-500"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.00033 13.8333C1.00033 14.75 1.75033 15.5 2.66699 15.5H9.33366C10.2503 15.5 11.0003 14.75 11.0003 13.8333V3.83333H1.00033V13.8333ZM2.66699 5.5H9.33366V13.8333H2.66699V5.5ZM8.91699 1.33333L8.08366 0.5H3.91699L3.08366 1.33333H0.166992V3H11.8337V1.33333H8.91699Z"
                />
              </svg>
            </button>
          </div>`,
        )}
    </div>
    <div>
      <input type="file" onChange=${onChange} class="hidden" readonly=${readonly} disabled=${disabled} />
    </div>
    <${Description} description=${description} />
    <${Errors} errors=${errors} id=${errorMessageId} />
  </div>`
}

/*
 * This is the configuration part of the custom field. It defines
 * the schema type, UI label and icon, palette group, properties panel entries
 * and much more.
 */
FileRenderer.config = {
  /* we can extend the default configuration of existing fields */
  ...Textfield.config,
  type: fileType,
  label: 'Additional files',
  organization: '',
  taskId: '',
  propertiesPanelEntries: ['key', 'label', 'description', 'disabled', 'readonly'],
}

// helper //////////////////////

function formFieldClasses(type, { errors = [], disabled = false, readonly = false } = {}) {
  if (!type) {
    throw new Error('type required')
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-has-errors': errors.length > 0,
    'fjs-disabled': disabled,
    'fjs-readonly': readonly,
  })
}

function prefixId(id, formId) {
  if (formId) {
    return `fjs-form-${formId}-${id}`
  }

  return `fjs-form-${id}`
}
