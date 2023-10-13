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
        // generateMainForm()
        generateDropDown('CUATM0')
    }, [])

    const [mainForm, setMainForm] = useState(undefined)
    const [arrOfDD, setArrOfDD] = useState([])

    const generateDropDown = (data) => {
        let tempArrHtml = arrOfDD
        let url = window.server + `/ReactElements/getTableWithFilter/${props.svSession}/SVAROG_CODES/PARENT_CODE_VALUE/${data}/10000`
        let form
        axios.get(url).then(res => {
            const { schema, uiSchema } = localitySchema(res.data);
            console.log(schema);
            console.log(uiSchema);
            form = (
                <Form
                    schema={schema}
                    uiSchema={uiSchema}
                    onSubmit={() => {
                        console.log(formData);
                    }}
                    className={`farm-registry-forms`}
                >
                    <></>
                </Form>
            );
            tempArrHtml.push(form)
            setArrOfDD(tempArrHtml)
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
                        formData={formData}
                        onSubmit={() => {
                            console.log();
                        }}
                        className={`farm-registry-forms`}
                    >
                        <></>
                        <div>
                            {arrOfDD}
                        </div>
                    </Form>
                );
                return form
            }).catch(err => {
                console.error(err)
            })
        }).catch(err => {
            console.error(err)
        })
    };
    return (
        <>{generateMainForm()}</>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

Address.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Address);
