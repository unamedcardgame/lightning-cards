/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Card from '@heruka_urgyen/react-playing-cards/lib/TcN'
import { useState, useEffect, useRef, useContext } from 'react'
import { Container } from 'react-bootstrap'
import Webcam from "react-webcam";
import * as fp from "fingerpose";
import Handsfree from 'handsfree'
import { setCallbacks } from '../../services/socketService';
import { AuthContext } from '../../contexts/AuthContext';

const Floor = ({ game, setGame, socket }) => {
  const { userState: authState } = useContext(AuthContext)
  const [drawPile, setDrawPile] = useState([])

  useEffect(() => {
    setCallbacks(socket, setDrawPile)
    console.log(game.cards)
  }, [socket])

  const drawCard = () => {
    console.log(socket.id)
    socket.emit('draw card', { sid: socket.id, gameId: game.id })
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runHandsfree = async () => {
    const handsfree = new Handsfree({
      hands: {
        enabled: true,
        // The maximum number of hands to detect [0 - 4]
        maxNumHands: 1,

        // Minimum confidence [0 - 1] for a hand to be considered detected
        minDetectionConfidence: 0.7,

        // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
        // Higher values are more robust at the expense of higher latency
        minTrackingConfidence: 0.5
      }
    })

    handsfree.start()
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          loveYouGesture,
          thumbsDownGesture
        ]);
        console.log(hand[0].landmarks)
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => { runHandsfree() }, []);

  return (
    <Container fluid className="h-100">
      <div className="table">
        {
          game.players
            .map((p, i) => {
              return (
                <div key={i} onClick={drawCard}>
                  <Card back card={'2c'} height={'6em'} />
                  <p style={{ color: 'white' }}>{p}</p>
                </div>
              )
            })
        }
      </div>
      <div className="drawpile">
        <Card card={drawPile} height={'6em'} />
      </div>
      <div className="header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        {/* NEW STUFF */}
        {emoji !== null ? (
          <img
            alt="gesture"
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </Container>
  )
}

export default Floor