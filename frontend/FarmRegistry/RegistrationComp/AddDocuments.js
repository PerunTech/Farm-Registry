import { React, PropTypes, connect, elements } from "perun-core";
const { alertUser } = elements;
import style from "../style/AddDocuments.module.css";
import { iconManager } from "../../assets/svgHolder";
import DocumentsJson from "./DocumentsJson";
import { labelsManager } from "../utils_tools/LabelsExport";

class AddDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentsRender: null, // test object
      documentsObj: DocumentsJson,
    };
  }

  componentDidMount() {
    this.iterateDocs(this.state.documentsObj);
  }

  /* iterate json and create documents html */
  iterateDocs = (json) => {
    let docHTML;
    let titleHTML;
    let elArr = [];
    for (let i in json.listDocs) {
      titleHTML = (
        <p
          key={json.listDocs[i].name}
          onClick={() => this.collapsableDocs(el.name)}
          className={style["docsTitle"]}
        >
          {json.listDocs[i].name}
        </p>
      );
      elArr.push(titleHTML);
      for (let j in json.listDocs[i].allDocs) {
        let el = json.listDocs[i].allDocs[j];
        docHTML = (
          <div
            key={el.title + el.isAdded}
            id={el.title + el.isAdded}
            className={`${style.flex} ${style.documentStyle}`}
          >
            <div className={`${style.title}`}>{el.title}</div>
            <div className={`${style.actions}`}>
              <div key={el.id} className={`${style.flex}`}>
                {el.isAdded === false && (
                  <div className={style["flex"]}>
                    <input
                      className={style["custom-form-elements"]}
                      hidden
                      type="file"
                      key={el.id}
                      id={`uploadLabel-${el.id}`}
                      name={el.name}
                      title="Одберете датотека"
                      onChange={(e) =>
                        this.onChange(e, "getUploadName", el.id, "isClicked")
                      }
                    />
                    <label
                      id={`uploadLabel-${el.id}`}
                      htmlFor={`uploadLabel-${el.id}`}
                      className={style["upload-label"]}
                    >
                      {iconManager.getIcon("upload")}Прикачи
                    </label>
                    <button
                      className={style["btn_save_docs"]}
                      id={`uploadBtn-${el.id}`}
                      key={`uploadBtn-${el.id}`}
                      onClick={() => this.saveDocument(el.id)}
                    >
                      {iconManager.getIcon("save")}Зачувај
                    </button>
                  </div>
                )}
                {el.isAdded === true && (
                  <button
                    className={style["btn_del_docs"]}
                    key={`deleteBtn-${el.id}`}
                    id={`deleteBtn-${el.id}`}
                    title={"Избриши документ"}
                    onClick={() => this.detelteDocument(el.id, el.title)}
                  >
                    {iconManager.getIcon("delete")}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
        elArr.push(docHTML);
      }
    }
    this.setState({ documentsRender: elArr });
  };

  /* Collapsibles Docs Menu

  collapsableDocs = () => {
    let coll = document.getElementsByClassName('documentStyle');
    let m;
    for (m = 0; m < coll.length; m++) {
      coll[m].addEventListener("click", function() {
        this.classList.toggle("active");
        let docsTitle = this.json.listDocs[i].name;
        if (docsTitle.style.display === "block") {
          panel.style.display = "none";
        } else {
          docsTitle.style.display = "block";
        }
      });
    }
  }

  /*

  /* onchange fucntion for type file only */
  onChange = (e, getFile, docId) => {
    if (getFile === "getUploadName") {
      let file;
      this.setState({ [e.target.id]: e.target.files[0] });
      if (e.target.files[0]) {
        file = e.target.files[0];
        document.getElementById(`uploadLabel-${docId}`).innerHTML = file.name;
        this.setState({ docId: docId });
      } else {
        document.getElementById(`uploadLabel-${docId}`).innerHTML =
          labelsManager.importLabel("attach", this.context, "farm_registry");
      }
    }
  };

  /* upload selected document, data.append function not tested, just copied from perun-batch */
  saveDocument = (id) => {
    console.log("added");
    // if (this.state.docId === id) {
    // let type
    // let restUrl = window.server
    // let params = this.state
    // let params = {personObj : '', file: '', docId: id}
    // const data = new FormData() // eslint-disable-line
    // if (`${params}.${id}`) {
    //   let file = `${params}.${id}`
    //   data.append(file.name, file)
    // }
    // data.append('param', JSON.stringify(params))
    // axios({
    //   method: 'post',
    //   data: data,
    //   url: restUrl,
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }).then(function (response) {
    //   console.log(response)
    //   this.iterateDocs()
    // })
    // .catch(function (response) {
    //   type = response.response.data.type
    //   type = type.toLowerCase()
    //   component.setState({ alert: alertUser(true, type, response.response.data.message) })
    // })
    // } else {
    // this.setState({ alert: alertUser(true, 'info', 'Ве молиме прикачете документ', null, null) })
    // }
  };

  /* delete selected document */
  deleteDocument = (id, title) => {
    const deleteDocWithTitle = this.context.intl.formatMessage({ id: 'perun.farm_registry.delete_doc_title', defaultMessage: 'perun.farm_registry.delete_doc_title' })
    const labelOK = this.context.intl.formatMessage({ id: 'perun.farm_registry.ok', defaultMessage: 'perun.farm_registry.ok' })
    const labelBack = this.context.intl.formatMessage({ id: 'perun.farm_registry.back', defaultMessage: 'perun.farm_registry.back' })
    this.setState({
      alert: alertUser(
        true,
        "info",
        `${deleteDocWithTitle} ${title}`,
        null,
        () => {
          console.log("test");
        },
        null,
        true,
        `${labelOK}`,
        `${labelBack}`
      ),
    });
    // let type
    // let postUrl = window.server
    // let form_params = {'objId': id}
    // let th1s = this
    // axios({
    //   method: 'post',
    //   data: form_params,
    //   url: postUrl,
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    // }).then((response) => {
    //   if (response) {
    //     console.log(response)
    //     this.iterateDocs()
    //   }
    // })
    // .catch((error) => {
    //   type = error.data.data.type
    //   type = type.toLowerCase()
    //   th1s.setState({ alert: alertUser(true, type, response.data.message) })
    // })
  };

  render() {
    const { documentsRender } = this.state;
    return (
      <React.Fragment>
        <div className={`${style.componentHolder}`}>
          <div className={`${style.dataHolder}`}>
            <p className={style["titleHolder"]}>
              {" "}
              {labelsManager.importLabel(
                "docs",
                this.context,
                "farm_registry"
              )}{" "}
            </p>
          </div>
          <div className={`${style.rightContainer}`}>
            {documentsRender}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});
AddDocuments.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddDocuments);
