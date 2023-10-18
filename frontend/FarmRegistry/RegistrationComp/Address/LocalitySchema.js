export default function localitySchema(locality, dynamicId) {
    let values = []
    let labels = []
    locality.forEach((option, i) => {
        values.push(`${option['SVAROG_CODES.CODE_VALUE']}`)
        labels.push(option['SVAROG_CODES.LABEL_CODE'])
    })
    return {
        schema: {
            title: 'test',
            type: 'object',
            properties: {
                [dynamicId]: {
                    type: 'string', title: 'test',
                    enum: values, enumNames: labels
                },

            }
        },
        uiSchema: {
        }
    }
}
