import { React, Modal, Form, PropTypes, connect } from "perun-core";
// React Big Calendar
import { Views, Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
// CSS
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarComponents.css";
// Label Manager
import { labelsManager } from "../utils_tools/LabelsExport";
import mk from "date-fns/locale/mk"

class CalendarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: [],
      formModal: null,
      infoModal: null,
    };
  }

  localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
      'mk': mk,
    },
  });

  componentDidMount() {
    const dummyData = [
      {
        end: new Date("January 29, 2022 03:24:00"),
        start: new Date("January 29, 2022 07:24:00"),
        subject: "Meeting",
        title: "Meeting",
      },
      {
        end: new Date("January 28, 2022 05:24:00"),
        start: new Date("January 28, 2022 07:24:00"),
        subject: "Conference",
        title: "Conference",
      },
      {
        end: new Date("January 30, 2022 03:24:00"),
        start: new Date("January 30, 2022 07:24:00"),
        subject: "Vacation",
        title: "Vacation",
      },
    ];

    this.setState({
      newEvent: dummyData,
    });
  }

  handleEventDelete = (event) => {
    console.log(event);

    //axios delete call

    this.setState({
      infoModal: null,
    });
  };

  handleDisplayDetails = (event) => {
    const modalTitle = "Event Information";

    const info = (
      <div>
        <h1>Title: {event.title}</h1>
        <h3>Subject: {event.subject}</h3>
        <span>
          Event Start:{" "}
          {event.start
            .toString()
            .split("GMT+0100 (Central European Standard Time)")}
        </span>
        <p>
          Event End:{" "}
          {event.end
            .toString()
            .split("GMT+0100 (Central European Standard Time)")}
        </p>
        <button onClick={() => this.handleEventDelete(event)}>
          Delete Event
        </button>
      </div>
    );

    this.setState({
      infoModal: (
        <Modal
          modalTitle={modalTitle}
          modalSize={65}
          closeModal={() => this.setState({ infoModal: null })}
          modalContent={info}
        />
      ),
    });
  };

  handleSelect = ({ start, end }) => {
    const modalData = {
      type: "object",
      properties: {
        TITLE_ID: {
          type: "string",
          maximum: 999999999999999,
          title: "Title/IDNUMBER",
        },
        SUBJECT: {
          type: "string",
          title: "Subject",
          maximum: 999999999999999,
        },
      },
      dependencies: {},
      required: ["TITLE_ID"],
    };

    const form = (
      <Form
        className={"something"}
        schema={modalData}
        onSubmit={(event) => this.handleSubmit(event, start, end)}
      >
        <button className="modalSubmitButton">Create</button>
      </Form>
    );

    const modalTitle = "Add Event";

    this.setState({
      formModal: (
        <Modal
          modalTitle={modalTitle}
          modalSize={65}
          closeModal={() => this.setState({ formModal: null })}
          modalContent={form}
        />
      ),
    });
  };

  handleSubmit = (event, start, end) => {
    this.setState({
      newEvent: [
        ...this.state.newEvent,
        {
          start,
          end,
          title: event.formData.TITLE_ID,
          subject: event.formData.SUBJECT,
        },
      ],
      formModal: null,
    });

    console.log(this.state.newEvent);

    // axios post call
  };

  render() {
    const { newEvent, formModal, infoModal } = this.state;
    return (
      <div className="calendar">
        <h1>
          {labelsManager.importLabel("calendar", this.context, "farm_registry")}
        </h1>
        {formModal}
        {infoModal}
        <Calendar
          localizer={this.localizer}
          onSelectEvent={(event) => this.handleDisplayDetails(event)}
          onSelectSlot={this.handleSelect}
          events={newEvent}
          startAccessor="start"
          selectable
          defaultView={Views.DAY}
          views={["month", "week", "day"]}
          endAccessor="end"
          style={{ height: 500, margin: "100px 20px" }}
          messages={{
            next: labelsManager.importLabel("next", this.context, "farm_registry"),
            previous: labelsManager.importLabel("previous", this.context, "farm_registry"),
            today: labelsManager.importLabel("today", this.context, "farm_registry"),
            month: labelsManager.importLabel("month", this.context, "farm_registry"),
            week: labelsManager.importLabel("week", this.context, "farm_registry"),
            day: labelsManager.importLabel("day", this.context, "farm_registry")
          }}
          culture='mk'
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

CalendarComponent.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(CalendarComponent);
