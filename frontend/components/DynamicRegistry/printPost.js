import { React, ReactDOM, createRoot, Swal, utils } from 'perun-core'
const { useState } = React
const { labelsManager } = utils

/**
 * POST print buttons (`"type": "print", "method": "POST"`).
 *
 * The button's `params` are sent url encoded to `onSubmit`, with the date of its `promptType`,
 * and the report opens in a new tab, as the GET prints do. The prompt type sets what is picked,
 * how it is sent and under which name:
 *
 * | promptType | picked       | sent                                      |
 * |------------|--------------|-------------------------------------------|
 * | current    | -, no dialog | date=19.10.2026                           |
 * | daily      | a day        | date=12.12.2020                           |
 * | monthly    | a month      | month=12-2020                             |
 * | yearly     | a year       | year=2020                                 |
 * | from-to    | two days     | dateFrom=01.12.2020&dateTo=31.12.2020     |
 *
 * `promptKey` renames the value sent by current, daily, monthly and yearly.
 */

const PROMPT_TYPES = {
  current: { granularity: 'day', format: 'DD.MM.YYYY', fields: [{ name: 'date' }] },
  daily: { granularity: 'day', format: 'DD.MM.YYYY', fields: [{ name: 'date', label: 'date' }] },
  monthly: { granularity: 'month', format: 'MM-YYYY', fields: [{ name: 'month', label: 'month' }] },
  yearly: { granularity: 'year', format: 'YYYY', fields: [{ name: 'year', label: 'year' }] },
  'from-to': {
    granularity: 'day',
    format: 'DD.MM.YYYY',
    fields: [{ name: 'dateFrom', label: 'date_from' }, { name: 'dateTo', label: 'date_to' }],
  },
}

// A placeholder the menu configuration left unset, e.g. %PROMPT_KEY%
const isSet = (value) => typeof value === 'string' && value !== '' && !/^%\w+%$/.test(value)

const pad = (value) => String(value).padStart(2, '0')

const todayParts = () => {
  const today = new Date()
  return { YYYY: String(today.getFullYear()), MM: pad(today.getMonth() + 1), DD: pad(today.getDate()) }
}

const formatDateParts = (parts, format) => format
  .replace('YYYY', parts.YYYY)
  .replace('MM', parts.MM)
  .replace('DD', parts.DD)

const isComplete = (parts, granularity) => {
  if (!parts || !/^\d{4}$/.test(parts.YYYY || '')) return false
  if (granularity !== 'year' && !parts.MM) return false
  if (granularity === 'day' && !parts.DD) return false
  return true
}

const sortKey = (parts) => `${parts.YYYY}${parts.MM}${parts.DD}`

// The print prompt labels are the ones epi_management installs
const label = (code, intl) => labelsManager(code, intl, 'epi_management')

/** The prompt type of a button with the names its values are sent under, or nothing. */
const getPrompt = (el) => {
  const prompt = isSet(el.promptType) && PROMPT_TYPES[el.promptType]
  if (!prompt) return undefined
  if (!isSet(el.promptKey) || prompt.fields.length > 1) return prompt
  return { ...prompt, fields: [{ ...prompt.fields[0], name: el.promptKey }] }
}

/** The params of the picked values, or the label code of what is wrong with them. */
const collectParams = (prompt, values) => {
  const { fields, granularity, format } = prompt
  if (fields.some(field => !isComplete(values[field.name], granularity))) return { error: 'print_prompt_required' }
  if (fields.length === 2 && sortKey(values[fields[0].name]) > sortKey(values[fields[1].name])) {
    return { error: 'print_prompt_invalid_range' }
  }
  const params = {}
  fields.forEach(field => {
    params[field.name] = formatDateParts(values[field.name], format)
  })
  return { params }
}

const DatePartsInput = ({ id, granularity, value, onChange }) => {
  const parts = value || {}
  if (granularity === 'day') {
    const dateValue = isComplete(parts, 'day') ? `${parts.YYYY}-${parts.MM}-${parts.DD}` : ''
    return (
      <input
        id={id} type='date' className='form-control' value={dateValue}
        onChange={(e) => {
          const [YYYY, MM, DD] = e.target.value.split('-')
          onChange(e.target.value ? { YYYY, MM, DD } : null)
        }}
      />
    )
  }
  const yearInput = (
    <input
      id={granularity === 'year' ? id : `${id}_YEAR`} type='number' min='1900' max='2100' className='form-control'
      value={parts.YYYY || ''} onChange={(e) => onChange({ ...parts, YYYY: e.target.value })}
    />
  )
  if (granularity === 'year') return yearInput
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <select id={id} className='form-control' value={parts.MM || ''} onChange={(e) => onChange({ ...parts, MM: e.target.value })}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={pad(i + 1)}>{new Date(2000, i, 1).toLocaleString(undefined, { month: 'long' })}</option>
        ))}
      </select>
      {yearInput}
    </div>
  )
}

const PrintPromptInputs = ({ prompt, values, intl }) => {
  const [state, setState] = useState({ ...values })

  const onChange = (name, parts) => {
    values[name] = parts
    setState({ ...values })
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: 'left' }}>
      {prompt.fields.map(field => (
        <div key={field.name} className='form-group'>
          <label htmlFor={`PRINT_PROMPT_${field.name}`} className='control-label'>{label(field.label, intl)}</label>
          <DatePartsInput
            id={`PRINT_PROMPT_${field.name}`}
            granularity={prompt.granularity}
            value={state[field.name]}
            onChange={(parts) => onChange(field.name, parts)}
          />
        </div>
      ))}
    </form>
  )
}

/** Sends the params url encoded in a POST, opening the response in a new tab. */
const submitInNewTab = (url, params) => {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url
  form.target = '_blank'
  form.enctype = 'application/x-www-form-urlencoded'
  form.style.display = 'none'
  Object.entries(params).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value ?? ''
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export const printPost = (el, intl) => {
  const url = `${window.server}${el.onSubmit}`
  const submit = (promptParams) => submitInNewTab(url, { ...el.params, ...promptParams })
  const prompt = getPrompt(el)

  // Today's date prefills every picker, and is what current sends
  const values = {}
  prompt?.fields.forEach(field => {
    values[field.name] = todayParts()
  })

  if (!prompt || el.promptType === 'current') {
    submit(prompt ? collectParams(prompt, values).params : {})
    return
  }

  // Rendered inside flushSync so the container is filled before SweetAlert takes it
  const container = document.createElement('div')
  const root = createRoot(container)
  ReactDOM.flushSync(() => root.render(<PrintPromptInputs prompt={prompt} values={values} intl={intl} />))
  Swal.fire({
    icon: 'question',
    title: label('print_prompt_title', intl),
    html: container,
    showCancelButton: true,
    confirmButtonText: label('print_prompt_generate', intl),
    confirmButtonColor: '#7cd1f9',
    cancelButtonText: label('cancel', intl),
    allowOutsideClick: false,
    heightAuto: false,
    reverseButtons: true,
    preConfirm: () => {
      const { params, error } = collectParams(prompt, values)
      if (error) {
        Swal.showValidationMessage(label(error, intl))
        return false
      }
      return params
    },
  }).then(result => {
    root.unmount()
    if (result.isConfirmed) submit(result.value)
  }).catch(err => console.error(err))
}
