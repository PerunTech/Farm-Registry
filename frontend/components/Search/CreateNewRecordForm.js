import { React, PropTypes, GenericForm, ComponentManager, axios, elements } from 'perun-core'
const { alertUser } = elements
import { jsonToURI, flattenObject } from '../../utils'
import { getMainLabel } from '../utils_tools/LabelsExport'

const CreateNewRecordForm = (props, context) => {
  const resetFormSaveState = () => {
    ComponentManager.setStateForComponent('AR_REGISTRATION_FORM', null, { saveExecuted: false })
  }

  const onSubmit = (e) => {
    const addFormConfig = props.configuration?.addForm
    const url = addFormConfig?.save?.onSave
    const contentType = addFormConfig?.save?.contentType || 'application/x-www-form-urlencoded'
    const shouldEncode = addFormConfig?.save?.encode
    const formData = e.formData
    const data = shouldEncode ? jsonToURI(flattenObject(formData)) : encodeURIComponent(JSON.stringify(formData))
    const reqConfig = { method: 'post', url: `${window.server}${url}`, data, headers: { 'Content-Type': contentType } }
    axios(reqConfig).then(res => {
      if (res.data) {
        const resType = res?.data?.type?.toLowerCase() || 'info'
        const title = res?.data?.title || ''
        const msg = res?.data?.message || ''
        const onConfirm = () => {
          if (resType === 'success') {
            props.setShowRegistrationModal(false)
          } else {
            resetFormSaveState()
          }
        }
        alertUser(true, resType, title, msg, onConfirm)
      }
    }).catch(err => {
      console.error(err)
      const title = err.response?.data?.title || err
      const msg = err.response?.data?.message || ''
      alertUser(true, 'error', title, msg, () => resetFormSaveState())
    })
  }

  const generateForm = () => {
    const addFormConfig = props.configuration?.addForm

    return (
      <GenericForm
        className={`aims-forms`}
        params={'FORM_DATA'}
        key={`AR_REGISTRATION_FORM`}
        id={`AR_REGISTRATION_FORM`}
        method={addFormConfig?.configuration?.onSubmit}
        uiSchemaConfigMethod={addFormConfig?.uischema?.onSubmit}
        tableFormDataMethod={addFormConfig?.data?.onSubmit}
        addSaveFunction={(e) => onSubmit(e)}
        customSaveButtonName={getMainLabel('save', context)}
        hideBtns={'closeAndDelete'}
      />
    )
  }

  return (
    <>
      {generateForm()}
    </>
  )
}

CreateNewRecordForm.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default CreateNewRecordForm
