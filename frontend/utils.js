export const getDynamicKey = () => {
  return (+ new Date() + Math.floor(Math.random() * 999999)).toString(36)
}

/**
 * A function used for restricting the type of value a user can enter in an
 * input of type 'text' or textarea element (example: only a numeric value or a numeric value in
 * a certain range)
 * @param  {HTMLElement} element The input/textarea whose value we want to restrict
 * @param  {RegExp} inputFilter The filter which will be applied to the input/textarea
 * (the filter will be a regular expression)
 */
export function setInputFilter(element, inputFilter) {
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

export function convertBytes(bytes, decimal) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimal)) + ' ' + sizes[i]
}

export const jsonToURI = (json, shouldStringify) => {
  let arr = []
  for (let property in json) {
    if (Object.prototype.hasOwnProperty.call(json, property) && json[property] !== undefined) {
      if (shouldStringify && typeof json[property] === 'object') {
        if (Array.isArray(json[property])) {
          arr.push(encodeURIComponent(property) + '=' + encodeURIComponent(json[property].toString()))
        } else {
          arr.push(encodeURIComponent(property) + '=' + encodeURIComponent(JSON.stringify(json[property])))
        }
      } else {
        arr.push(encodeURIComponent(property) + '=' + encodeURIComponent(json[property]))
      }
    }
  }
  return arr.join('&')
}

export const flattenObject = (obj) => {
  const flattened = {}
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]))
    } else {
      flattened[key] = obj[key]
    }
  })
  return flattened
}