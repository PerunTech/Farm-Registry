import {
    React,
    connect,
    GenericGrid,
    GridManager,
    FormManager,
    Modal,
    axios,
    ComponentManager,
    PropTypes,
    Loading,
    Form,
} from 'perun-core'
const { useState, useEffect } = React
const Address = (props) => {
    useEffect(() => {
        generateMainForm()
    }, [])
    const [schema, setSchema] = useState({})
    const [uiSchema, setUiSchema] = useState({})
    const [flag, setFlag] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({})
    const [permaSchema, setPermaSchema] = useState({})
    const generateMainForm = () => {
        const urlS = window.server + `/ReactElements/getTableJSONSchema/${props.svSession}/ADDRESS_MLD`
        const urlU = window.server + `/ReactElements/getTableUISchema/${props.svSession}/ADDRESS_MLD`
        setLoading(true)
        setFlag(false)
        axios.get(urlS).then(res => {
            setSchema(res.data)
            setPermaSchema(res.data)
            axios.get(urlU).then(res => {
                setUiSchema(res.data)
                setFlag(true)
                setLoading(false)
            }).catch(err => {
                console.error(err)
                setLoading(false)
            })
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    };

    const generateNewTest = (id) => {
        console.log(permaSchema);
        if (id) {
            if (formData['LOCALITY1'] !== id) {
                setFlag(false)
                let tempSchema = { ...permaSchema };
                let tempEnum = []
                let tempEnumNames = []
                let innerId
                let innerOpt
                innerId = id.split('_') //array of two elements (string example: parentid_childid)
                tempSchema.properties['LOCALITY2'].enum.map((option, i) => {
                    innerOpt = option.split('_')
                    if (innerId[1] === innerOpt[0]) {
                        tempEnum.push(option)
                        tempEnumNames.push(tempSchema.properties['LOCALITY2'].enumNames[i])
                    }
                })
                tempSchema.properties['LOCALITY2'].enum = tempEnum
                tempSchema.properties['LOCALITY2'].enumNames = tempEnumNames
                setSchema(tempSchema)
                setFlag(true)
            }
        }
    }

    return (
        <>{loading && <Loading />}
            {flag && <Form
                schema={schema}
                uiSchema={uiSchema}
                onSubmit={(e) => console.log(e)}
                className={`farm-registry-forms`}
                formData={formData}
                onChange={(e) => {
                    setFormData(e.formData)
                    generateNewTest(e.formData['LOCALITY1'])
                }}
            >
                <></>
                <div>

                </div>
                <button className='btn-success btn_save_form' type='submit'>Submit</button>
            </Form>}
        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

Address.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Address);
