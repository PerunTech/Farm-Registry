import { React, connect, axios, Loading, createHashHistory, elements, PropTypes } from "perun-core";
const { useEffect, useState } = React;
import { AgGridReact } from "ag-grid-react";
import "../style/style.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import style from "../style/registration.module.css";;
const { alertUser } = elements;
import { iconManager } from "../../assets/svgHolder";

const land_cover_code = ['200', '210', '300', '310', '320', '400', '410', '420', '421', '422', '423', '430', '490', '500',
  '600', '900']

const land_cover_name = ['Нива (обработливо земјиште)', 'Оранжерии и пластеници на обработливо земјиште',
  'Постојан тревник', 'Ливада', 'Пасиште', 'Долгогодишни култури (траен насад)', 'Лозов насад',
  'Овоштарник', 'Маслинов насад', 'Овошен насад', 'Јаткасто овошје', 'Растенија со брзо растечка маса',
  'Мешани трајни насади', 'Различна искористеност на земјиштето', 'Матични насади',
  'Останати типови на употреба на земјиштето']
const history = createHashHistory();

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
        translatedValue = "Да";
        break;
      default:
        translatedValue = "Не";
        break;
    }

    return translatedValue;
  };

  const translateLandCoverCode = (code) => {
    let translatedValue = '/'
    // These are the available land cover codes
    const landCoverCodes = land_cover_code
    // These are their translated values (names)
    const landCoverCodeNames = land_cover_name
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
