import { React, connect, PropTypes, ExportableGrid, ComponentManager } from 'perun-core'
const { useState, useEffect } = React
import style from "../style/registration.module.css"
import { labelsManager } from '../utils_tools/LabelsExport';
import { getDynamicKey } from '../../utils';
let prev
const ParentChildGrids = (props, context) => {
    useEffect(() => {
        return () => {
            ComponentManager.cleanComponentReducerState(props.grids[0].ID + '_' + props.farmObjId)
            ComponentManager.cleanComponentReducerState(prev)
        }
    }, [])

    const [stateGrid, setStateGrid] = useState(undefined)
    const generateParentGrid = () => {
        const { grids } = props
        const configWs = props.grids[0].objectConfiguration.configuration.onSubmit
        const dataWs = props.grids[0].objectConfiguration.data.onSubmit
        const btnArray = props.grids[0].objectConfiguration.additionalBtns
        const gridDiv = <>
            <div className={`${style['parent-dynamic-grid']}`}>
                {btnArray && props.buildCustomBtnArr(btnArray, false)}
                <ExportableGrid
                    gridType={"READ_URL"}
                    key={grids[0].ID + '_' + props.farmObjId}
                    id={grids[0].ID + '_' + props.farmObjId}
                    configTableName={configWs}
                    dataTableName={dataWs}
                    heightRatio={0.7}
                    onRowClickFunct={(id, idx, row) => handleCustomRowClick(id, idx, row, props.grids[0].ID, grids[1])}
                    refreshData={true}
                />
            </div>
            {stateGrid}


        </>
        return gridDiv
    }
    const generateGrid = (objectId, grid) => {
        let gridId = grid.ID + objectId + getDynamicKey()
        const btnArray = props.grids[0].objectConfiguration.additionalBtns
        prev = gridId

        if (objectId) {
            const configWs = grid.objectConfiguration.configuration.onSubmit
            let dataWs = grid.objectConfiguration.data.onSubmit
            dataWs = dataWs.replace(/{([^}]+)}/g, objectId)
            const gridDiv = <div className={` ${style['child-dynamic-grid']}`}>
                {btnArray && <div className={style['child-grid-balancer']} />}
                <ExportableGrid
                    gridType={"READ_URL"}
                    key={gridId}
                    id={gridId}
                    configTableName={configWs}
                    dataTableName={dataWs}
                    heightRatio={0.7}
                    onRowClickFunct={(id, idx, row) => handleRowClick(id, idx, row, grid.ID, gridId)}
                    editContextFunc={(row) => editFunc(row, grid.ID, gridId)}
                    refreshData={true}
                    toggleCustomButton={true}
                    customButton={() => {
                        props.addFormFunc(gridId)
                        props.setRowChild(0)
                    }}
                    customButtonLabel={labelsManager.importLabel('add', context, 'farm_registry')}
                />

            </div>
            setStateGrid(gridDiv)
        }
    }


    const handleCustomRowClick = (_id, _rowIdx, row, gridId, grid) => {
        props.setRowParent(row[`${gridId}.OBJECT_ID`] || 0)
        ComponentManager.cleanComponentReducerState(gridId + prev)
        generateGrid(row[`${gridId}.OBJECT_ID`], grid)
    }
    const handleRowClick = (_id, _rowIdx, row, gridId, gridAndDynamic) => {
        props.setRowChild(row[`${gridId}.OBJECT_ID`] || 0)
        props.addFormFunc(gridAndDynamic)
    }
    const editFunc = (row, gridId, gridAndDynamic) => {
        props.setRowChild(row[`${gridId}.OBJECT_ID`] || 0)
        props.addFormFunc(gridAndDynamic)
    }
    return (
        <>{generateParentGrid()}
        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

ParentChildGrids.contextTypes = {
    intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(ParentChildGrids);
