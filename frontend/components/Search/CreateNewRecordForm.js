import { React, PropTypes, GenericForm, ComponentManager, axios, elements, createHashHistory, utils } from 'perun-core'
const { alertUserResponse } = elements
const { labelsManager } = utils

const formatWrapperName = (businessObjectName = '') =>
  businessObjectName
    .replace(/\d/g, '')
    .replace(/_$/, '')
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
    .replace(/_/g, '')
    .trim();

const CreateNewRecordForm = (props, context) => {
  const hashHistory = createHashHistory()

  const resetFormSaveState = () => {
    ComponentManager.setStateForComponent('REGISTRATION_FORM', null, { saveExecuted: false })
  }

  const onSubmit = async (e) => {
    const addFormConfig = props.configuration?.addForm;
    const url = addFormConfig?.save?.onSave;
    const contentType = addFormConfig?.save?.contentType || 'application/x-www-form-urlencoded';
    const formData = e.formData || e;
    let data = formData
    const params = addFormConfig?.save?.params || undefined

    if (params) {
      data = Object.assign(formData, params)
    }

    const reqConfig = { method: 'post', url: `${window.server}${url}`, data: contentType && contentType.includes('application/json') ? formData : encodeURIComponent(JSON.stringify(formData)), headers: { 'Content-Type': contentType } };
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
        response: err,
        onConfirm: resetFormSaveState
      });

      return null;
    }
  };

  const addFormConfig = props.configuration?.addForm
  const wrapperName = props.configuration?.wrapper ? formatWrapperName(props.businessObjectName) : undefined;
  const inputWrapper = wrapperName ? window.__farmRegistryWrappers.getWrapper(wrapperName) : undefined;

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
      customSaveButtonName={labelsManager('save', context, 'farm_registry')}
      hideBtns={'closeAndDelete'}
      isAddForm={true}
      inputWrapper={inputWrapper}
    />
  )
}

CreateNewRecordForm.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default CreateNewRecordForm
