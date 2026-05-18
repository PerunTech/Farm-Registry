import { React, PropTypes, ComponentManager, ExportableGrid, elements, utils } from 'perun-core'
import WrapperSearchForm from './WrapperSearchForm'
const { useEffect, useRef, useState } = React
const { getDynamicKey } = utils
const { ReactBootstrap } = elements
const { Modal } = ReactBootstrap

const RecordSelectWrapper = (props, context) => {
  const mounted = useRef()
  const [gridId, setGridId] = useState('')
  const [showGridModal, setShowGridModal] = useState(false)
  const [searchResult, setSearchResult] = useState(undefined)
  const [showArrayGridModal, setShowArrayGridModal] = useState(false)
  const [singleInputConfig, setSingleInputConfig] = useState(undefined)
  const [arrayInputConfig, setArrayInputConfig] = useState(undefined)
  const [arrayInputsConfig, setArrayInputsConfig] = useState([])

  useEffect(() => {
    checkConfig()
  }, [])

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
    } else {
      transformArrayInputs()
    }
  })

  useEffect(() => {
    transformArrayInputs()
  }, [arrayInputsConfig])

  useEffect(() => {
    if (searchResult) {
      setGridId(getDynamicKey())
    }
  }, [searchResult])

  const closeArrayGridModal = () => {
    setShowArrayGridModal(false)
  }

  const onArrayInputClick = (inputConfig) => {
    setArrayInputConfig(inputConfig)
    setSearchResult(undefined)
    setShowArrayGridModal(true)
  }

  const handleInputTransformation = (input, placeholderLabelCode, clickAction) => {
    input.onclick = clickAction
    input.style.cursor = 'pointer'
    input.setAttribute('readonly', 'readonly')
    input.addEventListener('keydown', e => e.preventDefault())
    input.placeholder = context.intl.formatMessage({
      id: placeholderLabelCode || 'Missing label',
      defaultMessage: placeholderLabelCode || 'Missing label'
    })
    input.style.background = '#b9cfba'
  }

  const transformArrayInputs = () => {
    if (!arrayInputsConfig || arrayInputsConfig.length === 0) return
    arrayInputsConfig.forEach((inputConfig) => {
      const { firstSectionName, secondSectionName, displayFieldName, placeholderLabelCode } = inputConfig
      const middlePart = secondSectionName ? `_${secondSectionName}_${displayFieldName}` : `_${displayFieldName}`
      const regex = new RegExp('^root_' + firstSectionName + '_\\d+' + middlePart + '$')
      const inputs = Array.from(document.querySelectorAll('input')).filter((input) => regex.test(input.id))
      if (inputs && inputs.length > 0) {
        inputs.forEach(input => handleInputTransformation(input, placeholderLabelCode, () => onArrayInputClick(inputConfig)))
      }
    })
  }

  const closeGridModal = () => {
    setShowGridModal(false)
  }

  const onInputClick = (inputConfig) => {
    setSingleInputConfig(inputConfig)
    setSearchResult(undefined)
    setShowGridModal(true)
  }

  const transformSingleInput = (inputConfig) => {
    const { inputId, placeholderLabelCode } = inputConfig
    const input = document.getElementById(inputId)
    if (input) {
      handleInputTransformation(input, placeholderLabelCode, () => onInputClick(inputConfig))
    }
  }

  const checkConfig = () => {
    const { formid } = props
    const wrapperConfig = ComponentManager.getStateForComponent(formid, 'wrapperConfig')
    if (wrapperConfig) {
      const inputs = wrapperConfig.inputs
      if (inputs && Array.isArray(inputs) && inputs.length > 0) {
        const arrayInputItems = []
        inputs.forEach(input => {
          const inputId = input.inputId
          if (inputId) {
            // Inputs containing {index} will be a part of  a `type: 'array'` configuration, ie. there can be multiple inputs dynamically added to the form
            if (inputId?.includes('{index}')) {
              arrayInputItems.push(input)
            } else {
              // Single inputs
              transformSingleInput(input)
            }
          }
        })
        setArrayInputsConfig(arrayInputItems)
      }
    }
  }

  const onRowClick = (_id, _idx, row, isArrayInput) => {
    const { formid } = props
    const formData = ComponentManager.getStateForComponent(formid, 'formTableData')
    if (isArrayInput) {
      const { tableName, denormalizedField, denormalizedFieldName, displayFieldName, displayValue, firstSectionName, secondSectionName } = arrayInputConfig || {}
      const denormalizedFieldValue = denormalizedField ? row[`${tableName}.${denormalizedField}`] : undefined
      const valueToDisplay = displayValue ? row[`${tableName}.${displayValue}`] : undefined
      if (formData) {
        if (firstSectionName) {
          if (!formData[firstSectionName]) {
            formData[firstSectionName] = []
          }
          if (formData[firstSectionName] && Array.isArray(formData[firstSectionName])) {
            formData[firstSectionName][formData[firstSectionName].length - 1] = {
              [secondSectionName]: {
                ...formData[firstSectionName][formData[firstSectionName].length - 1]?.[secondSectionName] && { ...formData[firstSectionName][formData[firstSectionName].length - 1]?.[secondSectionName] },
                ...denormalizedFieldName && denormalizedFieldValue !== undefined && { [denormalizedFieldName]: denormalizedFieldValue },
                ...displayFieldName && valueToDisplay !== undefined && { [displayFieldName]: valueToDisplay }
              }
            }
            // This will remove any empty objects from the array
            formData[firstSectionName] = formData[firstSectionName].filter(item => Object.keys(item).length > 0)
          }
          ComponentManager.setStateForComponent(formid, 'formTableData', formData)
          props.formInstance.setState({ formTableData: formData })
          props.formInstance.onInputChange(formData)
          closeArrayGridModal()
        }
      }
    } else {
      const { tableName, denormalizedField, denormalizedFieldName, displayFieldName, displayValue, sectionName, additionalFieldsToMap } = singleInputConfig || {}
      const denormalizedFieldValue = denormalizedField ? row[`${tableName}.${denormalizedField}`] : undefined
      const valueToDisplay = displayValue ? row[`${tableName}.${displayValue}`] : undefined
      if (formData) {
        if (sectionName) {
          if (!formData[sectionName]) {
            formData[sectionName] = {}
          }
          if (denormalizedFieldName && denormalizedFieldValue !== undefined) {
            formData[sectionName][denormalizedFieldName] = denormalizedFieldValue
          }
          if (displayFieldName && valueToDisplay !== undefined) {
            formData[sectionName][displayFieldName] = valueToDisplay
          }
          // Check if there are any additional fields that need to be mapped/populated
          // This will be an array of objects like this: { fieldName: '', fieldToMap: '' }
          // Where the fieldName key is the name of the field in the form and the fieldToMap key is the value from the clicked row
          if (additionalFieldsToMap && Array.isArray(additionalFieldsToMap) && additionalFieldsToMap.length > 0) {
            additionalFieldsToMap.forEach(field => {
              formData[sectionName][field.fieldName] = row[field.fieldToMap]
            })
          }
        } else {
          if (denormalizedFieldName && denormalizedFieldValue !== undefined) {
            formData[denormalizedFieldName] = denormalizedFieldValue
          }
          if (displayFieldName && valueToDisplay !== undefined) {
            formData[displayFieldName] = valueToDisplay
          }
          // Check if there are any additional fields that need to be mapped/populated
          // This will be an array of objects like this: { fieldName: '', fieldToMap: '' }
          // Where the fieldName key is the name of the field in the form and the fieldToMap key is the value from the clicked row
          if (additionalFieldsToMap && Array.isArray(additionalFieldsToMap) && additionalFieldsToMap.length > 0) {
            additionalFieldsToMap.forEach(field => {
              formData[field.fieldName] = row[field.fieldToMap]
            })
          }
        }
        ComponentManager.setStateForComponent(formid, 'formTableData', formData)
        props.formInstance.setState({ formTableData: formData })
        props.formInstance.onInputChange(formData)
        closeGridModal()
      }
    }
  }

  const getCommonGridProps = () => {
    return {
      gridType: 'SEARCH_GRID_DATA',
      key: gridId,
      id: gridId,
      heightRatio: 0.4,
    }
  }

  const getCommonSimpleGridProps = () => {
    return {
      gridType: 'SEARCH_GRID_DATA',
      key: 'RECORD_SELECTION_GRID_MODAL',
      id: 'RECORD_SELECTION_GRID_MODAL',
      heightRatio: 0.7,
    }
  }

  return (
    <>
      {props.children}
      {showGridModal && (
        <Modal className='farm-registry-modal vmp-modal' show={showGridModal} onHide={() => closeGridModal()}>
          <Modal.Header className='farm-registry-modal-header' closeButton />
          <Modal.Body className='farm-registry-modal-body'>
            {singleInputConfig?.search && Object.keys(singleInputConfig.search).length > 0 && (
              <WrapperSearchForm
                formConfig={singleInputConfig.search}
                setSearchResult={setSearchResult}
              />
            )}
            {searchResult && (
              <ExportableGrid
                {...getCommonGridProps()}
                configTableName={singleInputConfig?.search?.grid?.configuration}
                dataTableName={searchResult}
                onRowClickFunct={onRowClick}
              />
            )}
            {!singleInputConfig?.search && !searchResult && (
              <ExportableGrid
                {...getCommonSimpleGridProps()}
                configTableName={singleInputConfig.configuration}
                dataTableName={singleInputConfig.data}
                onRowClickFunct={onRowClick}
              />
            )}
          </Modal.Body>
          <Modal.Footer className='farm-registry-modal-footer' />
        </Modal>
      )}
      {showArrayGridModal && (
        <Modal className='farm-registry-modal vmp-modal' show={showArrayGridModal} onHide={() => closeArrayGridModal()}>
          <Modal.Header className='farm-registry-modal-header' closeButton />
          <Modal.Body className='farm-registry-modal-body'>
            {arrayInputConfig?.search && Object.keys(arrayInputConfig.search).length > 0 && (
              <WrapperSearchForm
                formConfig={arrayInputConfig.search}
                setSearchResult={setSearchResult}
              />
            )}
            {searchResult && (
              <ExportableGrid
                {...getCommonGridProps()}
                configTableName={arrayInputConfig?.search?.grid?.configuration}
                dataTableName={searchResult}
                onRowClickFunct={(id, idx, row) => onRowClick(id, idx, row, true)}
              />
            )}
            {!arrayInputConfig?.search && !searchResult && (
              <ExportableGrid
                {...getCommonSimpleGridProps()}
                configTableName={arrayInputConfig?.configuration}
                dataTableName={arrayInputConfig?.data}
                onRowClickFunct={(id, idx, row) => onRowClick(id, idx, row, true)}
              />
            )}
          </Modal.Body>
          <Modal.Footer className='farm-registry-modal-footer' />
        </Modal>
      )}
    </>
  )
}

RecordSelectWrapper.contextTypes = {
  intl: PropTypes.object.isRequired,
}

export default RecordSelectWrapper
