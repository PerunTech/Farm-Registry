export function jsonData(context) {
  return {
    uischema: {
    },
    JSONSchema: {
      type: 'object',
      title: `${context.intl.formatMessage({ id: 'perun.farm_registry.searching', defaultMessage: 'perun.farm_registry.searching' })}`,

      properties: {
        FIC: {
          type: 'string', title: `${context.intl.formatMessage({ id: 'perun.farm_registry.fic', defaultMessage: 'perun.farm_registry.fic' })}`
        },
        FULL_NAME: {
          type: 'string', title: `${context.intl.formatMessage({ id: 'perun.farm_registry.full_name', defaultMessage: 'perun.farm_registry.full_name' })}`,
        }
      }
    }
  }
}
