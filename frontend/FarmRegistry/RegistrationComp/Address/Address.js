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
    Form,
} from 'perun-core'
import localitySchema from './LocalitySchema'
const { useState, useEffect } = React
const Address = (props) => {
    useEffect(() => {
        generateMainForm()
        generateDropDown('CUATM0')

    }, [])

    const [mainForm, setMainForm] = useState(undefined)
    const [arrOfDD, setArrOfDD] = useState([])
    const [flag, setFlag] = useState(false)
    const [formDataObj, setFormData] = useState({})

    const generateDropDown = (data) => {
        console.log(formDataObj)
        console.log('========================================================');
        let tempData = formDataObj
        let order = arrOfDD.length + 1
        let formId = `LOCALITY${order}`
        let tempArrHtml = arrOfDD
        let url = window.server + `/ReactElements/getTableWithFilter/${props.svSession}/SVAROG_CODES/PARENT_CODE_VALUE/${data}/10000`
        let form
        console.log(order);
        axios.get(url).then(res => {
            const { schema, uiSchema } = localitySchema(res.data, `LOCALITY`);
            form = (
                <Form
                    id={formId}
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={{ 'LOCALITY': `${formDataObj[order]}` }}
                    onSubmit={(e) => {
                    }}
                    onChange={(e) => {
                        if (e.formData?.LOCALITY) {
                            setFlag(false)
                            generateDropDown(e.formData['LOCALITY'])
                            tempData[`LOCALITY${arrOfDD.length}`] = e.formData['LOCALITY']
                            setFormData(tempData)
                            console.log(e.formData);
                            console.log(formDataObj)
                        }
                    }}
                    className={`farm-registry-forms farm-reg-dd `}
                >
                    <></>
                </Form>
            );
            if (res.data.length > 0) {
                tempArrHtml.push(form)
            }
            setArrOfDD(tempArrHtml)
            setFlag(true)
        }).catch(err => {
            console.error(err)
        })
    }
    const generateMainForm = (formData) => {
        const urlS = window.server + `/ReactElements/getTableJSONSchema/${props.svSession}/ADDRESS_MLD`
        const urlU = window.server + `/ReactElements/getTableUISchema/${props.svSession}/ADDRESS_MLD`
        let schema
        let uiSchema
        let form
        axios.get(urlS).then(res => {
            schema = res.data
            axios.get(urlU).then(res => {
                uiSchema = res.data
                form = (
                    <Form
                        schema={schema}
                        uiSchema={uiSchema}
                        onSubmit={(e) => saveDataAndNewForm(e)}
                        className={`farm-registry-forms`}
                        formData={formData}
                    >
                        <></>
                        <button className='btn-success btn_save_form' type='submit'>Submit  </button>
                        <div className='dd-form-con'>
                            {arrOfDD}
                        </div>
                    </Form>
                );
                setMainForm(form)
                setFlag(true)
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        })
    };

    const saveDataAndNewForm = (e) => {
        let formData = e.formData
        for (const [key, value] of Object.entries(formDataObj)) {
            formData[key] = value
        }
        setFlag(false)
        generateMainForm(formData)
    }
    return (
        <>{flag && mainForm}</>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

Address.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Address);
