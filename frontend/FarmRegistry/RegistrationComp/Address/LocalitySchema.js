export default function localitySchema(locality) {
    let values = []
    let labels = []
    locality.forEach(option => {
        values.push(option['SVAROG_CODES.PARENT_CODE_VALUE'])
        labels.push(option['SVAROG_CODES.LABEL_CODE'])
    })
    return {
        schema: {
            title: 'test',
            type: 'object',
            properties: {
                ADDRESS: {
                    type: 'number', title: 'test',
                    enum: values, enumNames: labels
                },

            }
        },
        uiSchema: {
        }
    }
}
