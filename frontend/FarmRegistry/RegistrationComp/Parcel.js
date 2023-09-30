import { React, connect, axios, Loading, createHashHistory, elements, PropTypes } from "perun-core";
const { useEffect, useState } = React;
import { AgGridReact } from "ag-grid-react";
import "../style/style.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import style from "../style/registration.module.css";;
const { alertUser } = elements;
import { iconManager } from "../../assets/svgHolder";
import { labelsManager } from '../utils_tools/LabelsExport';

const history = createHashHistory();

const land_cover_code = ['200', '210', '300', '310', '320', '400', '410', '420', '421', '422', '423', '430', '490', '500', '600', '900']

const Parcel = (props) => {
  const [collumns, setCollumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    generateInterGrid();
  }, []);

  const translateBooleanValue = (value) => {
    let translatedValue = "";
    switch (true) {
      case value:
        translatedValue = `${labelsManager.importLabel('yes', context, 'farm_registry')}`;
        break;
      default:
        translatedValue = `${labelsManager.importLabel('no', context, 'farm_registry')}`;
        break;
    }

    return translatedValue;
  };

  const getLandCoverNames = () => {
    return [
      `${labelsManager.importLabel('farmland', context, 'farm_registry')}`,
      `${labelsManager.importLabel('greenhouse', context, 'farm_registry')}`,
      `${labelsManager.importLabel('permanent_lawn', context, 'farm_registry')}`,
      `${labelsManager.importLabel('lawn', context, 'farm_registry')}`,
      `${labelsManager.importLabel('pasture', context, 'farm_registry')}`,
      `${labelsManager.importLabel('permanent_cropland', context, 'farm_registry')}`,
      `${labelsManager.importLabel('vineyard', context, 'farm_registry')}`,
      `${labelsManager.importLabel('orchard', context, 'farm_registry')}`,
      `${labelsManager.importLabel('olive_grove', context, 'farm_registry')}`,
      `${labelsManager.importLabel('fruit_garden', context, 'farm_registry')}`,
      `${labelsManager.importLabel('nuts', context, 'farm_registry')}`,
      `${labelsManager.importLabel('fast_growing_plants', context, 'farm_registry')}`,
      `${labelsManager.importLabel('mixed_permanent_crops', context, 'farm_registry')}`,
      `${labelsManager.importLabel('different_land_use', context, 'farm_registry')}`,
      `${labelsManager.importLabel('stem_plants', context, 'farm_registry')}`,
      `${labelsManager.importLabel('other_types_of_land_use', context, 'farm_registry')}`,
    ]
  }

  const translateLandCoverCode = (code) => {
    let translatedValue = '/'
    // These are the available land cover codes
    const landCoverCodes = land_cover_code
    // These are their translated values (names)
    const landCoverCodeNames = getLandCoverNames()
    // Get the position of the land cover code
    const landCoverCodeIndex = landCoverCodes.indexOf(code)
    // If it's found (therefore the number will be 0 or larger than 0), get the appropriate name for the code
    if (landCoverCodeIndex >= 0) {
      translatedValue = landCoverCodeNames[landCoverCodeIndex]
    }
    return translatedValue
  };

  const generateInterGrid = () => {
    setLoading(true)
    let url =
      window.server +
      `/WsFarmUtils/getAgriParcelData/${props.svSession}/${props.farmObjId}`;
    axios.get(url).then((res) => {
      if (res.data) {
        let data = res.data.data;
        let dataKeys = Object.keys(data[0]);
        dataKeys.map((item) => {
          setCollumns((prev) => [
            ...prev,
            {
              field: item,
              sortable: true,
              filter: "agTextColumnFilter",
              filterParams: {
                buttons: ["reset", "apply"],
                suppressAndOrCondition: true,
              }, headerName: item
            },
          ]);
        });

        data.map((obj) => {
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === "boolean") {
              obj[key] = translateBooleanValue(value)
            }
            else if (key == "Употреба на земјиште") {
              obj[key] = translateLandCoverCode(value)
            }
            else {
              obj[key] = value
            }

          }
          setRows((prev) => [...prev, obj])
        });
        setShowGrid(true)
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      setShowGrid(true)
      alertUser(
        true,
        err.data.type.toLowerCase(),
        err.data.title,
        err.data.message
      );
    });
  };
  const openMap = () => {
    const { farmData } = props
    const objectId = farmData?.objectId
    const objectTypeId = farmData?.objectTypeId
    const params = `id=${objectId}&type=${objectTypeId}&action=sizp`
    history.push(`/main/farm-registry/map?${params}`)
  }

  return (
    <React.Fragment>
      {loading && <Loading />}
      <button className={`${style.mapBtn}`} onClick={() => openMap()}>{iconManager.getIcon("parcel")}
        {this.context.intl.formatMessage({ id: 'perun.farm_registry.lpis_map', defaultMessage: 'perun.farm_registry.lpis_map' })}
      </button>
      {showGrid && <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px"
        }}
      >
        <div
          className={"ag-theme-balham"}
          style={{ height: "70vh", width: "100%" }}
        >
          <AgGridReact rowData={rows} columnDefs={collumns} columnHeight={30} headerHeight={70}></AgGridReact>
        </div>
      </div>}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  farmData: state['farm_registry.mapData']?.farmData,
  farmerObjId: state['farm_registry.mapData']?.farmData?.objectId
});

Parcel.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Parcel);
