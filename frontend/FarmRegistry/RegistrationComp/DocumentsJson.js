export default function DocumentsJson(context) {
  const listDocs = [
    {
      name: `${context.intl.formatMessage({ id: 'perun.farm_registry.organizational_form_doc', defaultMessage: 'perun.farm_registry.organizational_form_doc' })}`,
      allDocs: [
        {
          id: "proof_possession_availability",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.proof_possession_availability', defaultMessage: 'perun.farm_registry.proof_possession_availability' })}`,
          isAdded: true,
        },
        {
          id: "proof_ownership_of_livestock",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.proof_ownership_of_livestock', defaultMessage: 'perun.farm_registry.proof_ownership_of_livestock' })}`,
          isAdded: true,
        },
        {
          id: "account_copy_physical_entity",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.account_copy_physical_entity', defaultMessage: 'perun.farm_registry.account_copy_physical_entity' })}`,
          isAdded: true,
        },
      ],
    },
    {
      name: `${context.intl.formatMessage({ id: 'perun.farm_registry.family_entity_additional', defaultMessage: 'perun.farm_registry.family_entity_additional' })}`,
      allDocs: [
        {
          id: "statement_of_physical_entity",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.statement_of_physical_entity', defaultMessage: 'perun.farm_registry.statement_of_physical_entity' })}`,
          isAdded: false,
        },
      ],
    },
    {
      name: `${context.intl.formatMessage({ id: 'perun.farm_registry.physical_entity_additional', defaultMessage: 'perun.farm_registry.physical_entity_additional' })}`,
      allDocs: [
        {
          id: "proof_current_condition_legal_entity",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.proof_current_condition_legal_entity', defaultMessage: 'perun.farm_registry.proof_current_condition_legal_entity' })}`,
          isAdded: true,
        },
        {
          id: "statement_for_legal_entity",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.statement_for_legal_entity', defaultMessage: 'perun.farm_registry.statement_for_legal_entity' })}`,
          isAdded: true,
        },
        {
          id: "copy_of_deposited_signitures_legal_entity",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.copy_of_deposited_signitures_legal_entity', defaultMessage: 'perun.farm_registry.copy_of_deposited_signitures_legal_entity' })}`,
          isAdded: true,
        },
      ],
    },
    {
      name: `${context.intl.formatMessage({ id: 'perun.farm_registry.depending_bearer', defaultMessage: 'perun.farm_registry.depending_bearer' })}`,
      allDocs: [
        {
          id: "certificate_organic_production",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.certificate_organic_production', defaultMessage: 'perun.farm_registry.certificate_organic_production' })}`,
          isAdded: false,
        },
        {
          id: "property_list_of_greenhouses",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.property_list_of_greenhouses', defaultMessage: 'perun.farm_registry.property_list_of_greenhouses' })}`,
          isAdded: false,
        },
        {
          id: "statement_breeding_snails",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.statement_breeding_snails', defaultMessage: 'perun.farm_registry.statement_breeding_snails' })}`,
          isAdded: false,
        },
        {
          id: "property_list_physical_entity",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.property_list_physical_entity', defaultMessage: 'perun.farm_registry.property_list_physical_entity' })}`,
          isAdded: false,
        },
        {
          id: "statement_mushrooms_production",
          title:
            `${context.intl.formatMessage({ id: 'perun.farm_registry.statement_mushrooms_production', defaultMessage: 'perun.farm_registry.statement_mushrooms_production' })}`,
          isAdded: false,
        },
      ],
    },
    {
      name: `${context.intl.formatMessage({ id: 'perun.farm_registry.requirements', defaultMessage: 'perun.farm_registry.requirements' })}`,
      allDocs: [
        {
          id: "scaned_documents",
          title: `${context.intl.formatMessage({ id: 'perun.farm_registry.scaned_documents', defaultMessage: 'perun.farm_registry.scaned_documents' })}`,
          isAdded: true,
        },
      ],
    },
  ];
  return listDocs
};
