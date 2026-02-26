import {
    React,
    connect,
    elements,
    ComponentManager,
    PropTypes, utils, Loading, axios
} from "perun-core";
const { labelsManager } = utils
const { useEffect, useRef, useState } = React;
const { alertUserResponse, alertUserV2 } = elements;
const AnimalWrapper = (props, context) => {
    const [loading, setLoading] = useState(false);
    const lastValidatedRef = useRef("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            const formData = ComponentManager.getStateForComponent(props.formid, "formTableData");
            const objectId = ComponentManager.getStateForComponent(props.formid, "objectId");
            const animalId = formData?.["animal.basic_info"]?.["ANIMAL_ID"];
            const animalClass = formData?.["animal.description"]?.["ANIMAL_CLASS"];
            const currentKey = `${objectId || ""}|${animalId || ""}|${animalClass || ""}`;

            if (currentKey !== lastValidatedRef.current) {
                lastValidatedRef.current = currentKey;
                if (objectId && animalId && animalClass) {
                    validateInput();
                }
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, [props.formid]);

    const validateInput = (event) => {
        if (event?.preventDefault) event.preventDefault()
        const formData = ComponentManager.getStateForComponent(props.formid, "formTableData");
        const objectId = ComponentManager.getStateForComponent(props.formid, "objectId");
        if (objectId && formData?.['animal.basic_info']?.['ANIMAL_ID'] && formData?.['animal.description']?.['ANIMAL_CLASS']) {
            setLoading(true)
            axios.get(`${window.server}/WsAims/checkIfAnimalIdExist/0/${formData['animal.basic_info']['ANIMAL_ID']}/${formData['animal.description']['ANIMAL_CLASS']}/${objectId}`).then(res => {
                if (res.data) {
                    setLoading(false)
                    if (res.data.message) {
                        alertUserV2({
                            type: 'warning',
                            title: res.data.title,
                            confirmButtonText: labelsManager('yes', context, 'farm_registry'),
                            onConfirm: animalMove,
                            showCancel: true,
                            cancelButtonText: labelsManager('no', context, 'farm_registry')
                        })
                    }
                }
            }).catch(err => {
                console.error(err);
                setLoading(false)
                alertUserResponse({ response: err })
            });
        }

    }

    const animalMove = () => {
        const formData = ComponentManager.getStateForComponent(props.formid, "formTableData");
        const objectId = ComponentManager.getStateForComponent(props.formid, "objectId");
        const closeModal = ComponentManager.getStateForComponent(props.formid, "closeModal");
        const currentDate = new Date().toISOString().slice(0, 19);
        const payload = {
            objectParams: [
                {
                    "MASS_PARAM_ANIMAL_FLOCK_ID": formData['animal.basic_info']['ANIMAL_ID'],
                    "MASS_PARAM_HOLDING_OBJ_ID": objectId,
                    "MASS_PARAM_ANIMAL_CLASS": formData['animal.description']['ANIMAL_CLASS'],
                    "MASS_PARAM_DATE_OF_ADMISSION": currentDate
                }
            ]
        }
        const url = '/WsAims/transferAnimalOrFlockToHolding'
        setLoading(true)
        const reqConfig = { method: 'post', url: `${window.server}${url}`, data: payload, };
        axios(reqConfig).then(res => {
            alertUserResponse({ response: res.data })
            setLoading(false)
            closeModal()
        }

        ).catch(err => {
            ComponentManager.setStateForComponent(`${props.formid}`, null, {
                saveExecuted: false,
            });
            console.error(err);
            setLoading(false)
            alertUserResponse({ response: err })
        });

    }


    return (
        <>{
            loading && <Loading />
        }
            {props.children}
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
AnimalWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AnimalWrapper);
