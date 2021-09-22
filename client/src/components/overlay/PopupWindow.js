import React from "react";
import Modal from 'react-bootstrap/Modal'
import { Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";


require("react-bootstrap/ModalHeader")
function Popup(props) {
    return (
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Game ID
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <p>
          {props.text}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    );
  }

  export default Popup