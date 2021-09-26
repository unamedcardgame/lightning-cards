import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard'


const Popup = (props) => {
  const [copied, setCopied] = useState(false)

  const onHide = () => {
    setCopied(false)
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
          Game ID
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <p>
          {props.text}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <CopyToClipboard text={props.text} >
          <Button onClick={() => setCopied(true)} variant={copied ? 'success' : 'primary'}>{copied ? 'Copied' : 'Copy'}</Button>
        </CopyToClipboard>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Popup