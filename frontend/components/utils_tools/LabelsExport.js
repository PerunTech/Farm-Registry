/**
 * MANDATORY PARAMETERS
 * @param {string} label - type of label
 * @param {string} context - imported context from component where LabelsExport is used
 * OPTIONAL PARAMETERS
 * @param {string} moduleName - name of the module where label is used
 */

export const labelsManager = {
  importLabel(label, context, moduleName) {
    if (label && context) {
      if (moduleName) {
        return context.intl.formatMessage({
          id: `perun.${moduleName}.${label}`,
          defaultMessage: `perun.${moduleName}.${label}`,
        });
      } else {
        return context.intl.formatMessage({
          id: `perun.generalLabel.${label}`,
          defaultMessage: `perun.generalLabel.${label}`,
        });
      }
    } else {
      console.warn("Check your params");
    }
  },
};
