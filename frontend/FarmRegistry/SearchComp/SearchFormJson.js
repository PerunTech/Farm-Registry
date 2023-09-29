const jsonData = {
  uischema : {
    "ui:order": [
    "dropDownVal",
    "inputVal"
    ],
    "inputVal" : {
      "ui:placeholder": "Вредност"
    },
    "ui:options": {"label": false},
    "ui:rootFieldId": "search-form",
  },
  JSONSchema : {
    "type": "object",
    "title": "Пребарување",
    "properties": {
      "inputVal": {
        "title": "Внесете вредност за пребарување",
        "type": "string"
      },
      "dropDownVal": {
        "type": "string",
        "title": "Пребарај во колона",
        "enum": [
          'FIC',
          'FULL_NAME',
          'ID_NO',
          'TAX_NO'
        ],
        "enumNames": ["ИДБР", "ИМЕ или ПРЕЗИМЕ", "Матичен број", "Даночен број"],
        "default": "FIC"
      }
    }
  }
}

export const exportJson = {
  getJsonData (key) {
    return jsonData[key]
  }
}
