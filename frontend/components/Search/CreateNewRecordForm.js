import { React, PropTypes, GenericForm, ComponentManager, axios, elements } from 'perun-core'
const { alertUser } = elements
import { jsonToURI, flattenObject } from '../../utils'
import { getMainLabel } from '../utils_tools/LabelsExport'
const { useState, useEffect } = React
import FarmWrapper from '../Wrapper/FarmWrapper';
import HoldingWrapper from '../Wrapper/HoldingWrapper';
const CreateNewRecordForm = (props, context) => {
  const [wrappers] = useState([{ Farm: FarmWrapper }, { Holding: HoldingWrapper }]);
  const [wrapperName, setWrapperName] = useState(undefined);
  useEffect(() => {
    if (props.configuration?.wrapper) {
      const formattedWrapper = props.businessObjectName
        .replace(/\d/g, '')
        .replace(/_$/, '')
        .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
        .replace(/_/g, '')
        .trim();

      setWrapperName(formattedWrapper);
    }
  }, []);
  const resetFormSaveState = () => {
    ComponentManager.setStateForComponent('REGISTRATION_FORM', null, { saveExecuted: false })
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
    let inputWrapper = undefined;

    const addFormConfig = props.configuration?.addForm
    if (props.configuration?.wrapper) {
      wrappers.forEach(wrap => {
        const [key] = Object.keys(wrap);
        if (wrapperName === key) {
          inputWrapper = wrap[key];
        }
      });
    }

    return (
      <GenericForm
        className={`form-test custom-farm-registry-form`}
        params={'FORM_DATA'}
        key={`REGISTRATION_FORM`}
        id={`REGISTRATION_FORM`}
        method={addFormConfig?.configuration?.onSubmit}
        uiSchemaConfigMethod={addFormConfig?.uischema?.onSubmit}
        tableFormDataMethod={addFormConfig?.data?.onSubmit}
        addSaveFunction={(e) => onSubmit(e)}
        customSaveButtonName={getMainLabel('save', context)}
        hideBtns={'closeAndDelete'}
        inputWrapper={inputWrapper}
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
