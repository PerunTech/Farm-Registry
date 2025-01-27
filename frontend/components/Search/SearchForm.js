import { React, PropTypes, GenericForm } from 'perun-core'
import { getMainLabel } from '../utils_tools/LabelsExport'

const SearchForm = (props, context) => {
  const generateForm = () => {
    const buttonsArray = [
      {
        type: 'button',
        id: 'add-new-record-btn',
        className: 'btn-success btn_save_form',
        action: () => props.setShowRegistrationModal(true),
        label: getMainLabel('add', context)
      },
      {
        type: 'submit',
        id: 'search-records-btn',
        className: 'btn-success btn_save_form',
        label: getMainLabel('search', context)
      }
    ]

    if (props.configuration?.readOnly) {
      buttonsArray.shift()
    }
    const searchConfig = props.configuration?.searchForm
    return (
      <GenericForm
        className='farm-registry-search-form'
        params='FORM_DATA'
        key='AR_SEARCH_FORM'
        id='AR_SEARCH_FORM'
        method={searchConfig?.configuration?.onSubmit}
        uiSchemaConfigMethod={searchConfig?.uischema?.onSubmit}
        tableFormDataMethod={searchConfig?.data?.onSubmit}
        hideBtns='all'
        buttonsArray={buttonsArray}
        addSaveFunction={() => props.handleSearch()}
        customSave
      />
    )
  }

  return (
    <>
      {generateForm()}
    </>
  )
}

SearchForm.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default SearchForm
