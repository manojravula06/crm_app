import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";
import Widget from "./Widget";
import { fetchTicket, ticketUpdation } from "../api/tickets";
import { getAllUser,userUpdation } from "../api/user";
import Sidebar from "../components/Sidebar";

// TASKS :
/*
Create a common dynamic component for widgets 
// GET API for users : userid
// Create a func getAllUsers() => fetch the api => staore the array of objects in state => userDetails
Pass the userdetails in material table 

// PUT API dor users : userid, updated new data -> change of status 

1/ Grab the curr user using onRowClick
2. STore the details of the user -> open a modal 
3. Modal will show all the curr details -> print all user details in the user modal 
4. Grab the new updated value and store it ina state 
5. Fetch the put api -> userid, updated data-> log the response 
*/

// put logic
/*
1. Grab the curr ticket : ticket id , all the curr data along with it 
2. Store the curr Ticket in a state -> display the curr ticket details in the modal 
3. Grab the new updated values and store in a state
4. Fetch the api with the new updated data 
*/

const columns = [
  { title: "ID", field: "id" },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
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
const userColumns = [
  { title: "USER ID", field: "userId" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes",
  lookup: {
    ADMIN: "ADMIN",
    ENGINEER: "ENGINEER",
    CUSTOMER: "CUSTOMER" 
  } 
  },
  {
    title: "STATUS",
    field: "userStatus",
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING: "PENDING" 
    }
  }
];

function Admin() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});

  // get api and store the data
  const [userDetails, setUserDetails] = useState([]);
  // open and close user modal
  const [userUpdationModal, setUserUpdationModal] = useState(false);
  // store the curr user details and the updated user details
  const [selectedCurrUser, setSelectedCurrUser] = useState({});

  const [message, setMessage] = useState("");

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const openTicketUpdationModal = () => setTicketUpdationModal(true);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);
  
  const fetchUsers=()=>{
    getAllUser().then((response)=>{
      setUserDetails(response.data);
 
    
    }).catch(function(error){
      console.log(error);
    })
  }
  const fetchTickets = () => {
    fetchTicket()
      .then((response) => {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  const updateTicketCount = (tickets) => {
    // filling this empty object with the ticket counts
    // Segrating the tickets in 4 properties according to the status of the tickets
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };

    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    });

    setTicketStatusCount(Object.assign({}, data));
  };
  // Storing teh curr ticket details in a state
    console.log(selectedCurrUser)
  const editTicket = (ticketDetail) => {
    const ticket = {
      id: ticketDetail.id,
      title: ticketDetail.title,
      reporter: ticketDetail.reporter,
      assignee: ticketDetail.assignee,
      ticketPriority: ticketDetail.ticketPriority,
      status: ticketDetail.status,
      description: ticketDetail.description, 
    };
    console.log("selected ticket", ticketDetail);
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };
  // 3. grabbing teh new updated data and storing it in a state
  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
      const user={
      
      }
     
    console.log(selectedCurrTicket);
 
  };

  //  4. Call the api with the new updated data
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        console.log(response);
        // closing the modal
        setTicketUpdationModal(false);
        // fetching the tickets again to update the table and the widgets
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
const updateUser=(e)=>{
  e.preventDefault();

}
  const editUser=(userDetail)=>{
    const user={
      id: userDetail.userId,
      name:userDetail.name,
      email:userDetail.email,
      role:userDetail.userTypes,
      status:userDetail.userStatus
    }
    setUserUpdationModal(true)
    setSelectedCurrUser(user)
  }

  return (
    <div className="bg-light vh-100%">
      <Sidebar />

      {/* Welcome text */}
      <div className="container p-5">
        <h3 className="text-center text-danger">
          Welcome, {localStorage.getItem("name")}!
        </h3>
        <p className="text-muted text-center">
          Take a quick look at your admin stats below
        </p>
      </div>
      {/* Widgets starts */}
      <div className="row ms-5 ps-5 mb-5">
        {/* w1 */}

        <Widget
          title="Open"
          color="primary"
          icon="envelope"
          ticketCount={ticketStatusCount.open}
          pathColor="darkblue"
        />
        {/* w2 */}
        <Widget
          title="Progress"
          color="warning"
          icon="hourglass-split"
          ticketCount={ticketStatusCount.progress}
          pathColor="orange"
        />
        {/* w3 */}
        <Widget
          title="Closed"
          color="success"
          icon="check2-circle"
          ticketCount={ticketStatusCount.closed}
          pathColor="darkgreen"
        />
        {/* w4 */}
        <Widget
          title="Blocked"
          color="danger"
          icon="slash-circle"
          ticketCount={ticketStatusCount.blocked}
          pathColor="red"
        />
      </div>
      {/* Widgets end */}
      <div className="text-center">
        <h5 className="text-info">{message}</h5>
      </div>
      <div className="container">
        <MaterialTable
          // 1. grabbing the specific ticket from the row
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKET"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },

            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "ticketRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "ticketRecords"),
              },
            ],
          }}
        />
        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details and we will call the api  */}
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-danger">
                    User ID : {selectedCurrTicket.id}{" "}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  {/* If equal labels needed , set height and width for labelSize */}
                  <label className="label input-group-text label-md labelSize">
                    Title
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.title}
                    className="form-control"
                  />
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Reporter
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.reporter}
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Assignee
                  </label>
                  <select className="form-control" name="assignee">
                    <option>Manoj</option>
                  </select>
                </div>
                {/* Onchange : grabbing teh new updates values from UI  */}
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={selectedCurrTicket.ticketPriority}
                    className="form-control"
                    name="ticketPriority"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Description
                  </label>
                  <textarea
                    type="text"
                    value={selectedCurrTicket.description}
                    onChange={onTicketUpdate}
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {userUpdationModal ? (
          <Modal
            show={userUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">UPDATE USER DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details and we will call the api  */}
              <form
              // onSubmit={updateUser}
              >
                <div className="p-1">
                  <h5 className="card-subtitle mb-2 text-danger">User ID : 
                  {selectedCurrUser.id }
                  </h5>
                </div>
                <div className="input-group mb-2">
                  {/* If equal labels needed , set height and width for labelSize */}
                  <label className="label input-group-text label-md labelSize">
                    Name
                  </label>
                  <input type="text" disabled value ={selectedCurrUser.name} className="form-control" />
               
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Email
                  </label>
                  <input type="email" disabled
                    value={selectedCurrUser.email}
                  className="form-control" />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Role
                  </label>
                  <input type="text" disabled
                  value={selectedCurrUser.role}
                  className="form-control" />
                </div>
                {/* Onchange : grabbing the new updates value from UI  */}

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={selectedCurrUser.status}
                    // onChange={onUserUpdate}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setUserUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        <hr />

{/* user details table */}

        <MaterialTable
          title="USER DETAILS"
          onRowClick={(event, rowData) => editUser(rowData)}
          columns={userColumns}
          data={userDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "userRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "userRecords"),
              },
            ],
          }}
        />
      </div>


    </div>
  );
}

export default Admin;
