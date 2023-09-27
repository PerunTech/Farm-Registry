import { redux } from 'perun-core'
const { store, updateSelectedRows } = redux

export function strcmp (string1, string2) {
  return (
    typeof string1 === 'string' &&
    typeof string2 === 'string' &&
    string1.toUpperCase() === string2.toUpperCase()
  )
}

export function isValidArray (array, minNumberOfElements) {
  return (array && array.constructor === Array && array.length >= minNumberOfElements)
}

export function isValidObject (object, minNumberOfKeys) {
  return (object && object.constructor === Object && Object.keys(object).length >= minNumberOfKeys)
}

export function isJSON (value) {
  value = !strcmp(typeof value, 'string') ? JSON.stringify(value) : value
  try {
    value = JSON.parse(value);
  } catch (e) {
    return false
  }

  if (strcmp(typeof value, 'object') && value !== null) {
    return true
  }

  return false
}

export function handleRowSelection (selectedRows, gridId) {
  store.dispatch(updateSelectedRows(selectedRows, gridId))
}

/**
 * A function that converts all letters from a string to lowercase, except the first one
 * @param  {string} string The string whose letters need to be converted to lowercase
 */
export function allLettersToLowerCaseExceptTheFirstOne (string) {
  return string.charAt(0) + string.substring(1).toLowerCase()
}

/**
 * A function that truncates a string to a certain number of characters & appends a character at the end of it
 * 
 * Mandatory params
 * @param  {string} string The string that needs to be truncated
 * @param  {number} startOfSubstr The starting point of the truncated part
 * @param  {number} endOfSubstr The ending point of the truncated part
 * 
 * Optional params
 * @param  {string} charToAppend An optional character that will be appended at the end of truncated string
 * @param  {number} position The position of the string portion, if it's a multiple word one
 */
export function truncateString (string, startOfSubstr, endOfSubstr, charToAppend, position) {
  // If the position param exists & it's of type number, we know it's a multiple word string
  if (!isNaN(position)) {
    const portionToTruncate = string.split(' ')[position]
    let truncated = portionToTruncate.substr(startOfSubstr, endOfSubstr)
    if (charToAppend) {
      truncated = truncated + charToAppend
    }
    return string.replace(portionToTruncate, truncated)
  } else {
    let truncated = string.substr(startOfSubstr, endOfSubstr)
    if (charToAppend) {
      truncated = truncated + charToAppend
    }
    return truncated
  }
}

/**
 * A function used for restricting the type of value a user can enter in an
 * input of type 'text' or textarea element (example: only a numeric value or a numeric value in
 * a certain range)
 * @param  {HTMLElement} element The input/textarea whose value we want to restrict
 * @param  {RegExp} inputFilter The filter which will be applied to the input/textarea
 * (the filter will be a regular expression)
 */
export function setInputFilter (element, inputFilter) {
  const events = ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop']
  events.forEach(function (event) {
    element.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
      } else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        this.value = ''
      }
    })
  })
}

export function jsonToURI (json) {
  let arr = []
  for (let property in json) {
    if (Object.prototype.hasOwnProperty.call(json, property) && json[property] !== undefined) {
      arr.push(encodeURIComponent(property) + '=' + encodeURIComponent(json[property]))
    }
  }
  return arr.join('&')
}

export function convertBytes (bytes, decimal) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i]
}

export function getFormWsPathsPerTable (tableName, objectId, session, saveWs, parentId) {
  return {
    urlDataForm: `/ReactElements/getTableFormData/${session}/${objectId}/${tableName}`,
    uiSchema: `/ReactElements/getTableUISchema/${session}/${tableName}`,
    formMethod: `/ReactElements/getTableJSONSchema/${session}/${tableName}`,
    ...saveWs && { urlSaveForm: `${window.server}/ReactElements/createTableRecordFormData/${session}/${tableName}/${parentId}` }
  }
}
