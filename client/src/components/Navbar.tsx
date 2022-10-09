import { Navbar, Nav, Container, Col, Button } from 'react-bootstrap'
import Logout from './auth/Logout';
import User from '../models/User';
import { useState } from 'react';
import PopupWindow from './overlay/PopupWindow';

const NavigationBar = ({ userState }: { userState: User }) => {
  const [modalShow, setModalShow] = useState(false)

  return (
    <Col className="px-0">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Lightning Cards!<sub style={{ marginLeft: '0.5em' }}>beta</sub></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Button onClick={() => setModalShow(true)} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}>
                How To Play ?
              </Button>
              <PopupWindow text={
                <div>
                  <h6>Welcome to Lightning Cards! A novel reactions-based card game</h6>
                  <i>Login may take a while, or try logging in twice.</i>
                  <ol>
                    <li>
                      Start a game
                      <ol type='a'>

                        <li>As a room host, click 'Create New Game'</li>
                        <li>If joining a game with an existing ID, click 'Join Game'</li>
                      </ol>
                    </li>
                    <li>Once in game lobby, click game ID to get a shareable ID from which a friend can join</li>
                    <li>Click ready (host clicks 'Begin')</li>
                    <li>
                      Gameplay
                      <ol type='a'>

                        <li>When a players card deck is highlighted green, he must click to draw a card</li>
                        <li>If it's a non-reaction card, continue drawing. Else make the reaction (click 'Rules' button for more info)</li>
                        <li>The player who makes a wrong reaction OR makes the reaction is last and is declared the round loser. He receives all the cards in the drawn deck</li>
                        <li>You win by getting rid of all your cards!</li>
                      </ol>
                    </li>
                  </ol>
                </div>
              } show={modalShow} onHide={() => setModalShow(false)}>

              </PopupWindow>
              <div className="d-flex">
                {
                  userState.isAuthenticated
                    ? <Logout />
                    : ""
                }
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Col >
  )
}

export default NavigationBar