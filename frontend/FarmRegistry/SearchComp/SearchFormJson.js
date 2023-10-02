export function jsonData(context) {
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
        FULL_NAME: {
          type: 'string', title: `${context.intl.formatMessage({ id: 'perun.farm_registry.full_name', defaultMessage: 'perun.farm_registry.full_name' })}`,
        },
        FIC: {
          type: 'string', title: `${context.intl.formatMessage({ id: 'perun.farm_registry.fic', defaultMessage: 'perun.farm_registry.fic' })}`
        },
      }
    }
  }
}
