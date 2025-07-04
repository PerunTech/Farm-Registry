import {
  React, ComponentManager, utils
} from "perun-core";
const { setInputFilter } = utils


const { useState, useEffect } = React

const SearchFormWrapper = (props) => {
  const [personalIdNumberInputField, setPersonalIdNumberInputField] = useState(undefined)

  useEffect(() => {
    // Get the form classNames
    const formClassNames = ComponentManager.getStateForComponent(props.formid, 'className')
    // Append a dot to each of them, so we can use them to get the needed input
    const finalFormClassNames = formClassNames?.split(' ')?.map(value => `.${value}`)?.join('') || ''
    // Get the needed input
    const input = document.querySelectorAll(`${finalFormClassNames} #root_ID_NO`)
    if (input) {
      const personalIdNumberInput = input[0]
      if (personalIdNumberInput) {
        setPersonalIdNumberInputField(personalIdNumberInput)
      }
    }
  }, [])

  useEffect(() => {
    if (personalIdNumberInputField) {
      // Allow only a maximum amount of 13 characters
      setInputFilter(personalIdNumberInputField, function (value) {
        return /^.{0,13}$/.test(value)
      })
    }
  }, [personalIdNumberInputField])

  return (
    <>
      {props.children}
    </>
  );
}

export default SearchFormWrapper
