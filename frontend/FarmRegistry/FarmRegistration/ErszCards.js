export default function getERZSCards(context) {
	return {
		"navigation": {
			"cards": [
				{
					"id": "zs",
					"labelCode": `${context.intl.formatMessage({ id: 'perun.farm_registry.agricultural_holdings', defaultMessage: 'perun.farm_registry.agricultural_holdings' })}`,
					"value": "0"
				},
				{
					"id": "active_zs",
					"labelCode": `${context.intl.formatMessage({ id: 'perun.farm_registry.active_agricultural_holding', defaultMessage: 'perun.farm_registry.active_agricultural_holding' })}`,
					"value": "0"
				},
				{
					"id": "docs_requirements",
					"labelCode": `${context.intl.formatMessage({ id: 'perun.farm_registry.documents_requirements', defaultMessage: 'perun.farm_registry.documents_requirements' })}`,
					"value": "0"
				},
				{
					"id": "msg_sent",
					"labelCode": `${context.intl.formatMessage({ id: 'perun.farm_registry.todays_meetings', defaultMessage: 'perun.farm_registry.todays_meetings' })}`,
					"value": "0"
				}
			]
		}
	}
}