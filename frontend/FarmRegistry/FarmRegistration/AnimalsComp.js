import { React, connect, PropTypes, GenericGrid, ComponentManager, axios, elements } from "perun-core";
const { alertUser } = elements
import { labelsManager } from "../utils_tools/LabelsExport";
import style from "../style/animalStyle.module.css";
import { iconManager } from "../../assets/svgHolder";

class AnimalsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldName: '',
      tableName: 'AHV_SINGLE_ANIMAL',
      hideSearchForm: true,
      holdingId: '',
      earTagMother: '',
      earTagNumber: '',
      animalType: '',
      animalRace: ''
    };
  }

  displayAnimalsGrid = () => {
    const { holdingId, earTagMother, earTagNumber, animalType, animalRace, tableName } = this.state
    const { svSession } = this.props
    if (!holdingId && !earTagMother && !earTagNumber && !animalType && !animalRace) {
      alertUser(true, 'error', 'Немате внесено вредности за пребарување.', 'Ве молиме внесете вредност/и по кои сакате да пребарате.')
    } else {
      let multipleFilterData = []
      if (holdingId) {
        multipleFilterData.push({ fieldName: 'HOLDING_ID', fieldValue: holdingId, operand: 'AND'})
      }
      if (earTagMother) {
        multipleFilterData.push({ fieldName: 'EAR_TAG_MOTHER', fieldValue: earTagMother, operand: 'AND' })
      }
      if (earTagNumber) {
        multipleFilterData.push({ fieldName: 'EAR_TAG_NUMBER', fieldValue: earTagNumber, operand: 'AND'})
      }
      if (animalType) {
        multipleFilterData.push({ fieldName: 'ANIMAL_TYPE', fieldValue: animalType, operand: 'AND'})
      }
      if (animalRace) {
        multipleFilterData.push({ fieldName: 'ANIMAL_RACE', fieldValue: animalRace, operand: 'AND'})
      }
      const names = multipleFilterData.map((data) => data.fieldName).join(',');
      const values = multipleFilterData.map((val) => val.fieldValue).join(',');

      let operandFinal = []
      multipleFilterData.map((element) => {
        operandFinal.push(element.operand)
      });


      if(operandFinal.length > 1) {
        operandFinal.pop();
        operandFinal = JSON.stringify(operandFinal)
      } 
     
      const gridId = `INITIAL_${tableName}_GRID`
      const gridConfig = `/ReactElements/getTableFieldList/${svSession}/${tableName}`
      const gridData = `/ReactElements/getTableWithMultipleFilters/${svSession}/${tableName}/${names}/${operandFinal}/${values}/1000`
      const grid = (
        <GenericGrid
          gridType={"READ_URL"}
          key={gridId}
          id={gridId}
          configTableName={gridConfig}
          dataTableName={gridData}
          minHeight={580}
        />
      )
      ComponentManager.cleanComponentReducerState(gridId)
      this.setState({ grid: undefined }, () => this.setState({ grid }))
    }
  }

  handleSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      this.displayAnimalsGrid()
    }
  }


  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  resetFields = () => {
    this.setState({ holdingId: '', earTagMother: '', earTagNumber: '', animalType: '', animalRace: '' })
    ComponentManager.cleanComponentReducerState(gridId)
    this.setState({ grid: undefined }, () => this.setState({ grid }))
  }


  render() {
    const { holdingId, earTagMother, earTagNumber, animalType, animalRace, grid } = this.state
    return (
      <div className={`${style["search-container"]}`} id="search-container">
        <div className={`${style["search-holder"]}`} id="search-holder">
          <div className={`${style["search-holder-title"]}`}><b>Животни</b></div>
          <div id="searchForm" className={`${style["searchForm"]}`}>
            <section className={`${style["flex"]}`}>
              <label>{labelsManager.importLabel("holding_id", this.context, "farm_registry")}</label>
              <input
                value={holdingId}
                onKeyDown={this.handleSearchByTheEnterKey}
                id="holdingId"
                onChange={this.onChange}
              />
            </section>
            <section className={`${style["flex"]}`}>
              <label>{labelsManager.importLabel("ear_tag_mother", this.context, "farm_registry")}</label>
              <input
                value={earTagMother}
                id="earTagMother"
                onKeyDown={this.handleSearchByTheEnterKey}
                onChange={this.onChange}
              />
            </section>
            <section className={`${style["flex"]}`}>
              <label>{labelsManager.importLabel("ear_tag_number", this.context, "farm_registry")}</label> 
              <input
                value={earTagNumber}
                onChange={this.onChange}
                onKeyDown={this.handleSearchByTheEnterKey}
                id="earTagNumber"
              />
            </section>
            <section className={`${style["flex"]}`}>
              <label>{labelsManager.importLabel("animal_type", this.context, "farm_registry")}</label>
              <input
                value={animalType}
                onChange={this.onChange}
                onKeyDown={this.handleSearchByTheEnterKey}
                id="animalType"
              />
            </section>
            <section className={`${style["flex"]}`}>
              <label>{labelsManager.importLabel("animal_race", this.context, "farm_registry")}</label>
              <input
                value={animalRace}
                onChange={this.onChange}
                onKeyDown={this.handleSearchByTheEnterKey}
                id="animalRace"
              />
            </section>
          </div>
          <div className={`${style["btn-holder"]}`}>
              <button
                className={`${style["search-button"]}`}
                onClick={this.displayAnimalsGrid}
                onKeyDown={this.handleSearchByTheEnterKey}
              >
                {iconManager.getIcon("search")}
                {labelsManager.importLabel(
                  "search",
                  this.context,
                  "farm_registry"
                )}
              </button>
              <button
                className={`${style["reset-button"]}`}
                onClick={this.resetFields}
                title={'Избришeте ги внесените вредностите од полињата'}
              >
                {iconManager.getIcon("reset")}
                {labelsManager.importLabel(
                  "reset",
                  this.context,
                  "farm_registry"
                )}
              </button>
          </div>
        </div>
        <div id="grid-holder" className={`${style["grid-holder"]}`}>
          {grid}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

AnimalsComp.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AnimalsComp);
