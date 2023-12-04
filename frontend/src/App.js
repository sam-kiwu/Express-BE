// import React from 'react'
// import './App.css';
// import {Container, Table} from "react-bootstrap";
// import { useEffect, useState } from 'react';
// import axios from "axios";

// const App = () => {
//   const [developers, SetDevelopers] = useState([]);

//   useEffect(() => {
//     fetchDevelopers()
//   }, []);

//   const fetchDevelopers = async () =>  {
//     const response = await axios.get('http://localhost:3006/developer');
//     if(response){
//       SetDevelopers(response.data.developers);
//     }
//   }


//   return (
//     <div className='App'>
//       <Container>
//       <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th>No</th>
//           <th>Name</th>
//           <th>Email</th>
//           <th>Address</th>
//         </tr>
//       </thead>
//       <tbody>
//         {
//           developers?.map((developer, index) => {
//             return(
//               <tr>
//                 <td>{index + 1}</td>
//                 <td>{developer.names}</td>
//                 <td>{developer.email}</td>
//                 <td>{developer.address}</td>
//               </tr>
//             )
//           })
//         }
        
//       </tbody>
//     </Table>
//       </Container>
//     </div>
//   )
// }

// export default App

import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Form, Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const App = () => {
  const [developers, setDevelopers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [itIsEditing, setItIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [devToDelete, setDevToDelete] = useState(null);
  const [editDev, setEditDev] = useState(null);
  const [newDev, setNewDev] = useState({
    names: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (showForm || showEdit) {
      const fetchDevelopers = async () => {
        try {
          const response = await axios.get('http://localhost:3006/developer');
          if (response.data && response.data.developers) {
            setDevelopers(response.data.developers);
          } else {
            setDevelopers([]);
          }
        } catch (error) {
          console.error('error fetching dev', error);
        }
      };
      fetchDevelopers();
    }
  }, [showForm, showEdit]);

  const inputChange = (event) => {
    const { name, value } = event.target;
    setNewDev({ ...newDev, [name]: value });
  };

  const addDeveloperButton = () => {
    setShowForm(true);
  };

  const hideAddDeveloperButton = () => {
    setNewDev({
      names: '',
      email: '',
      address: '',
    });
    setEditDev(null);
    setItIsEditing(false);
    setShowForm(false);
    setShowEdit(false);
  };

  const addAndUpdateDeveloper = async () => {
    try {
      const response = itIsEditing
        ? await axios.put(`http://localhost:3006/developer/${itIsEditing}/edit`, newDev)
        : await axios.post('http://localhost:3006/developer/create', newDev);

      if (response.status === 201 || response.status === 200) {
        const updatedDev = itIsEditing
          ? developers.map((dev) => (dev.id === editDev.id ? response.data.updatedDev : dev))
          : [...developers, response.data.newDev];

        setDevelopers(updatedDev);
        hideEditDev();
        setNewDev({
          names: '',
          email: '',
          address: '',
        });
      } else {
        handleUnsuccessful(response);
      }
    } catch (error) {
      console.log(`Error ${itIsEditing ? 'editing' : 'adding'} developer:`, error);
    }
  };

  const handleUnsuccessful = (response) => {
    if (response.status === 400) {
      console.error('fake Req:', response.data.error);
    } else if (response.status === 404) {
      console.error('not found', response.data.error);
    } else {
      console.error('error', response.data.error);
    }
  };

  const showEditDev = (developer) => {
    setEditDev(developer);
    const newDevData = {
      names: '',
      email: '',
      address: '',
    };
    setNewDev(newDevData);
    setShowEdit(true);
    setItIsEditing(true);
  };

  const hideEditDev = () => {
    setEditDev(null);
    setNewDev({
      names: '',
      email: '',
      address: '',
    });
    setShowEdit(false);
    setItIsEditing(false);
  };

  const showDeleteConfirmation = (developer) => {
    setDevToDelete(developer);
    setShowConfirmDelete(true);
  };

  const confirmHideDeletion = () => {
    setDevToDelete(null);
    setShowConfirmDelete(false);
  };

  const deleteDev = async () => {
    try {
      const response = await axios.delete(`http://localhost:3006/developer/${devToDelete.id}`);
      if (response.status === 200) {
        setDevelopers(developers.filter((dev) => dev.id !== devToDelete.id));
        confirmHideDeletion();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Container>
        {!showForm && !showEdit && (
          <Button variant="secondary" onClick={addDeveloperButton}>
            Add dev
          </Button>
        )}

        <Modal show={showForm || showEdit} onHide={hideAddDeveloperButton} onExited={hideAddDeveloperButton}>
          <Modal.Header closeButton>
            <Modal.Title>{showEdit ? 'Edit Developer' : 'Add Dev'}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={newDev.names} name="names" placeholder="enter your names" onChange={inputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={newDev.email} name="email" placeholder="enter your email" onChange={inputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" value={newDev.address} name="address" placeholder="enter your address" onChange={inputChange} />
              </Form.Group>
            </Form>

            {showEdit && (
              <Button variant="primary" onClick={addAndUpdateDeveloper}>
                Save
              </Button>
            )}

            {!showEdit && (
              <Button variant="primary" onClick={addAndUpdateDeveloper}>
                Save Dev
              </Button>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showConfirmDelete} onHide={confirmHideDeletion}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this developer?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={confirmHideDeletion}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteDev}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Table striped bordered hover> 
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
          {developers && developers.length > 0 ? (
              developers.map((developer, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{developer?.names}</td>
                  <td>{developer?.email}</td>
                  <td>{developer?.address}</td>
                  <td>
                    <Button variant="primary" onClick={() => showEditDev(developer)}>
                      Edit
                    </Button>
                    <Button variant="secondary" onClick={() => showDeleteConfirmation(developer)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">N/A</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default App;
 