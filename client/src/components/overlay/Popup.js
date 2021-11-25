// import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';

const Popup = (props) => {
  // const [copied, setCopied] = useState(false)

  const onHide = () => {
    // setCopied(false)
    props.onHide()
  }

  return (
    <Modal
      text={props.text}
      show={props.show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Reaction Rules
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.text}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Popup