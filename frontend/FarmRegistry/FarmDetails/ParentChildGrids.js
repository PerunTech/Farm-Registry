import { React, connect, axios, PropTypes, Loading, createHashHistory, elements, ExportableGrid, GridManager, ComponentManager, GenericForm, redux } from 'perun-core'
const { useState, useEffect } = React
import style from "../style/registration.module.css"
const { ReactBootstrap, alertUser } = elements;
import { labelsManager } from '../utils_tools/LabelsExport';
const ParentChildGrids = (props, context) => {
    const [stateGrid, setStateGrid] = useState(undefined)
    const generateParentGrid = () => {
        const { grids } = props
        const configWs = props.grids[0].objectConfiguration.configuration.onSubmit
        const dataWs = props.grids[0].objectConfiguration.data.onSubmit
        const gridDiv = <>
            <div className={`${style['parent-dynamic-grid']}`}>
                <ExportableGrid
                    gridType={"READ_URL"}
                    key={grids[0].ID + props.farmObjId}
                    id={grids[0].ID + props.farmObjId}
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
        if (objectId) {
            const configWs = grid.objectConfiguration.configuration.onSubmit
            let dataWs = grid.objectConfiguration.data.onSubmit
            dataWs = dataWs.replace(/{([^}]+)}/g, objectId)
            const gridDiv = <div className={` ${style['child-dynamic-grid']}`}>
                <ExportableGrid
                    gridType={"READ_URL"}
                    key={grid.ID + props.farmObjId}
                    id={grid.ID + props.farmObjId}
                    configTableName={configWs}
                    dataTableName={dataWs}
                    heightRatio={0.7}
                    onRowClickFunct={(id, idx, row) => handleRowClick(id, idx, row, props.grid.ID)}
                    refreshData={true}
                    toggleCustomButton={true}
                    customButton={() => props.addFormFunc()}
                    customButtonLabel={labelsManager.importLabel('add', context, 'farm_registry')}
                />

            </div>
            setStateGrid(gridDiv)
        }
    }


    const handleCustomRowClick = (_id, _rowIdx, row, gridId, grid) => {
        props.setRowParent(row[`${gridId}.OBJECT_ID`] || 0)
        generateGrid(row[`${gridId}.OBJECT_ID`], grid)
    }
    const handleRowClick = (_id, _rowIdx, row, gridId) => {
        props.setRowChild(row[`${gridId}.OBJECT_ID`] || 0)
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
