import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, ModalBody } from "react-bootstrap";
import { fetchTicket, ticketCreation } from "../api/tickets";

import Sidebar from "../components/Sidebar";
import Widget from "./Widget";

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "title",
  },

  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "ASIGNEE",
    field: "asignee",
  },

  {
    title: "PRIORITY",
    field: "ticketPriority",
  },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];
function Customer() {
  // Open a new modal
  const [createTicketModal, setCreateTicketModal] = useState(false);
  // Success or error message
  const [message, setMessage] = useState("");
  // store ticket details
  const [ticketDetails, setTicketDetails] = useState([]);
  //ticket count for widgets
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  // update modal
  const [updateModal, setUpdateModal] = useState(false);
  const openUpdateModal = () => setUpdateModal(true);
  const closeUpdateModal = () => setUpdateModal(false);
  // logout if error = 401
  const navigate = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then((response) => {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createTicket = (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };
    ticketCreation(data)
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
          console.log(error);
        } else if (error.response.status === 401) {
          logoutFn();
        } else {
          console.log(error);
        }
      });
  };
  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      progress: 0,
      closed: 0,
      blocked: 0,
    };
    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else {
        data.blocked += 1;
      }
    });
    setTicketStatusCount(Object.assign({}, data));
  };
  const updateTicket = (ticketDetails) => {
    console.log(ticketDetails);
    const ticket = {
      id: ticketDetails.id,
      title: ticketDetails.title,
      description: ticketDetails.description,
      assignee: ticketDetails.assignee,
      ticketPriority: ticketDetails.ticketPriority,
      status: ticketDetails.status,
    };
    setUpdateModal(true);
    //setCreateTicketModal(true);

    console.log(ticket);
  };
  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container pt-5">
        <h3 className="text-center display-3">
          Welcome {localStorage.getItem("name")} !
        </h3>
        <p className="text-center text-muted">Take a look at your tickets</p>

        {/* wigits begin here */}
        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount={ticketStatusCount.open}
            pathColor="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={ticketStatusCount.progress}
            pathColor="darkblue"
          />

          <Widget
            color="success"
            title="CLOSED"
            icon="check2-circle"
            ticketCount={ticketStatusCount.closed}
            pathColor="blue"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle "
            ticketCount={ticketStatusCount.blocked}
            pathColor="black"
          />
        </div>
        <hr />

        <h4 className="text-primary text-center">{message}</h4>

        <MaterialTable
          title="Ticket raised by you"
          onRowClick={(event, rowData) => updateTicket(rowData)}
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#447551",
              color: "white",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [
              {
                label: "Download PDF",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "Ticket Record"),
              },
              {
                label: "Download CSV",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "Ticket Record"),
              },
            ],
          }}
        />
        {updateModal ? (
          <Modal
            show={updateModal}
            backdrop="static"
            centered
            onHide={() => closeUpdateModal}
          >
            <Modal.Header
              className="fw-bold text-danger text-center"
              closeButton
            >
              UPDATE THIS TICKET
            </Modal.Header>
            <Modal.Body>
              <form>
              <div className="input-group m-1">
                  <label className="label label-md input-group-text fw-bold">
                    TITLE OF TICKET
                  </label>
                  <input
                    type="text"
                    className="form-control text-center"
                    placeholder="Title of the Ticket"
                    name="title"
                  />
                </div>
              </form>
              <div className="d-flex justify-content-center">
              <button className="btn btn-success m-1" onClick={closeUpdateModal}>
                  Update
                </button>
                <button className="btn btn-dark m-1" onClick={closeUpdateModal}>
                  close
                </button>
              </div>
            </Modal.Body>
          </Modal>
        ) : null}
        <hr />
        <h4 className="text-center ">
          Facing any issues? Just raise a ticket!
        </h4>
        <button
          className="btn btn-success form-control"
          onClick={() => setCreateTicketModal(true)}
        >
          Raise a Ticket
        </button>

        {createTicketModal ? (
          <Modal
            show={createTicketModal}
            backdrop="static"
            centered
            onHide={() => setCreateTicketModal(false)}
          >
            <Modal.Header
              closeButton
              className="fw-bold text-danger text-center"
            >
              CREATE A NEW TICKET
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={createTicket}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text fw-bold">
                    TITLE OF TICKET
                  </label>
                  <input
                    type="text"
                    className="form-control text-center"
                    placeholder="Title of the Ticket"
                    name="title"
                    required
                  />
                </div>

                <div className="input-group m-2">
                  <label className="label label-md input-group-text fw-bold">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className="md-textarea form-control"
                    rows="3"
                    name="description"
                    placeholder="Description of the ticket"
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="m-1 btn btn-primary">
                    Create a Ticket
                  </button>
                  <button
                    className="m-1 btn btn-dark"
                    onClick={() => setCreateTicketModal(false)}
                  >
                    Cancle
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
    </div>
  );
}

export default Customer;
