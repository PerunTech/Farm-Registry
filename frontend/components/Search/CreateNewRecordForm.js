import { React, PropTypes, GenericForm, ComponentManager, axios, elements, createHashHistory } from 'perun-core'
const { alertUserResponse } = elements
import { jsonToURI, flattenObject } from '../../utils'
import { getMainLabel } from '../utils_tools/LabelsExport'
const { useState, useEffect } = React
import FarmWrapper from '../Wrapper/FarmWrapper';
import HoldingWrapper from '../Wrapper/HoldingWrapper';
const CreateNewRecordForm = (props, context) => {
  const hashHistory = createHashHistory()
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

  const onSubmit = async (e) => {
    const addFormConfig = props.configuration?.addForm;
    const url = addFormConfig?.save?.onSave;
    const contentType = addFormConfig?.save?.contentType || 'application/x-www-form-urlencoded';
    const shouldEncode = addFormConfig?.save?.encode;
    const formData = e.formData || e;
    const data = shouldEncode ? jsonToURI(flattenObject(formData)) : encodeURIComponent(JSON.stringify(formData));
    const reqConfig = { method: 'post', url: `${window.server}${url}`, data, headers: { 'Content-Type': contentType } };

    try {
      const res = await axios(reqConfig);

      if (res?.data) {
        const resType = res.data?.type?.toLowerCase() || 'info';
        const objectId = resType === 'success' ? res.data.data['object_id'] : null;

        const onConfirm = () => {
          if (resType === 'success') {
            props.setShowRegistrationModal(false)
            const href = `/main/registry/${props.businessObjectName}/${res.data.data['object_id']}/farm-summary`
            hashHistory.push(href)
          } else {
            resetFormSaveState();
          }
        };

        alertUserResponse({
          response: res.data,
          onConfirm
        });

        return objectId;
      }

      return null;
    } catch (err) {
      console.error(err);
      alertUserResponse({
        response: err.response?.data,
        onConfirm: resetFormSaveState
      });

      return null;
    }
  };

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
        className={`form-test custom-farm-registry-form aims-forms hide-initial-form-legend initial-holding`}
        params={'FORM_DATA'}
        key={`REGISTRATION_FORM`}
        id={`REGISTRATION_FORM`}
        method={addFormConfig?.configuration?.onSubmit}
        uiSchemaConfigMethod={addFormConfig?.uischema?.onSubmit}
        tableFormDataMethod={addFormConfig?.data?.onSubmit}
        addSaveFunction={(e) => onSubmit(e)}
        customSaveButtonName={getMainLabel('save', context)}
        hideBtns={'closeAndDelete'}
        isAddForm={true}
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
