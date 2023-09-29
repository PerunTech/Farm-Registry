export function jsonData(context) {
  const enumLabels = [
    `${context.intl.formatMessage({ id: 'perun.farm_registry.fic', defaultMessage: 'perun.farm_registry.fic' })}`,
    `${context.intl.formatMessage({ id: 'perun.farm_registry.full_name', defaultMessage: 'perun.farm_registry.full_name' })}`,
    `${context.intl.formatMessage({ id: 'perun.farm_registry.in_no', defaultMessage: 'perun.farm_registry.in_no' })}`,
    `${context.intl.formatMessage({ id: 'perun.farm_registry.tax_no', defaultMessage: 'perun.farm_registry.tax_no' })}`,
  ]
  const enumValues = ['FIC', 'FULL_NAME', 'ID_NO', 'TAX_NO']
  return {
    uischema: {
      order: ['dropDownVal', 'inputVal'],
      inputVal: {
        placeholder: `${context.intl.formatMessage({ id: 'perun.farm_registry.value', defaultMessage: 'perun.farm_registry.value' })}`,
      },
      options: { "label": false },
      rootFieldId: "search-form",
    },
    JSONSchema: {
      type: 'object',
      title: `${context.intl.formatMessage({ id: 'perun.farm_registry.searching', defaultMessage: 'perun.farm_registry.searching' })}`,
      properties: {
        dropDownVal: {
          type: 'string',
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.column_search', defaultMessage: 'perun.farm_registry.column_search' })}`,
          enum: enumValues,
          enumNames: enumLabels,
          default: "FIC"
        },
        inputVal: {
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.searching_val', defaultMessage: 'perun.farm_registry.searching_val' })}`,
          type: 'string'
        }
      }
    }
  }
}
