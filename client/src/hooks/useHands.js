import { useState, useEffect, useRef } from 'react'
import { Camera } from '@mediapipe/camera_utils'
import { drawLandmarks } from '@mediapipe/drawing_utils'
import { GestureEstimator } from 'fingerpose'
import { gestures } from '../services/fingerpose/fingerposeService'
import { Hands } from '@mediapipe/hands'

export const useHands = (game, gameDispatch, socket) => {
    const [ctx, setCtx] = useState(null)
    const [GE, setGE] = useState(null)
    const canvasRef = useRef()
    const videoRef = useRef()
    const [loaded, setLoaded] = useState(false)
    const handsRef = useRef(
        new Hands({
            locateFile: (file) => {
                console.log(file)
                return `@mediapipe/hands/${file}`;
            }
        })
    )

    useEffect(() => {
        handsRef.current.setOptions({
            maxNumHands: 1,
            minDetectionConfidence: 0.8,
            minTrackingConfidence: 0.5
        });
    }, [])


    // create a canvas and initialise fingerpose gesture estimators
    const initialiseCanvasAndGE = () => {
        setCtx(canvasRef.current.getContext('2d'))
        setGE(new GestureEstimator(
            gestures
        ))
    }

    const initialiseHands = () => {
        handsRef.current.initialize().then(success => setLoaded(true))
    }

    const closeHands = () => {
        handsRef.current.close()
    }

    // initialise mediapipe
    useEffect(() => {
        console.log('ue run')
        function onResults(results) {
            ctx.save();
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(
                results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });

                    // conv landmarks for fp
                    for (let f in landmarks) {
                        landmarks[f] = Object.values(landmarks[f]).map((e, i) => i < 3 ? e * 1000 : null)
                    }

                    const estimatedGestures = GE.estimate(landmarks, 7.5);

                    // gesture results
                    console.log(estimatedGestures.gestures[0])
                    const gesture = estimatedGestures.gestures[0]
                    socket.emit('gesture', {
                        reaction: {
                            gesture: gesture,
                            timestamp: new Date().getTime()
                        },
                        gameId: game.id
                    })
                }
            }
            ctx.restore();
        }
        if (GE && ctx) {
            handsRef.current.onResults(onResults)

            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await handsRef.current.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720
            });
            camera.start()
        }
    }, [ctx, GE, socket])

    return {
        initialiseCanvasAndGE,
        ctx, setCtx,
        GE, setGE,
        canvasRef,
        videoRef,
        closeHands,
        initialiseHands,
        loaded,
    }
}