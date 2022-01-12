import { useState, useEffect, useRef } from 'react'
import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { GestureEstimator } from 'fingerpose'
import { gestures } from '../services/fingerpose/fingerposeService'
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands'
import { setReacted } from '../reducers/gameReducer'

export const useHands = (game, gameDispatch, socket, ignoredOne, setIgnoredOne, gid) => {
    const [ctx, setCtx] = useState(null)
    const [GE, setGE] = useState(null)
    const [cameraInitialised, setCameraInitialised] = useState(false)
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
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            modelComplexity: 0,
            selfieMode: true,
        });
    }, [])

    useEffect(() => {
        function onResults(results) {
            ctx.save();
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(
                results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
            if (results.multiHandLandmarks && game.reactionReady && !game.reacted) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#FF0000' })
                    drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });

                    // conv landmarks for fp
                    for (let f in landmarks) {
                        landmarks[f] = Object.values(landmarks[f]).map((e, i) => i < 3 ? e * 1000 : null)
                    }

                    const estimatedGestures = GE.estimate(landmarks, 7.5);

                    // gesture results
                    const gesture = estimatedGestures.gestures[0]

                    if (gesture !== undefined && gesture.confidence > 8) {
                        if (ignoredOne) {
                            console.log('gesture sent', gesture)
                            gameDispatch(setReacted(true))
                            socket.emit('gesture', {
                                reaction: {
                                    gesture: gesture,
                                    timestamp: new Date().getTime()
                                },
                                gameId: game.id,
                                gid
                            })
                            setIgnoredOne(false)
                        }
                        setIgnoredOne(true)
                    }
                }
            }
            ctx.restore();
        }
        handsRef.current.onResults(onResults)
        if (GE && ctx && cameraInitialised === false) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    await handsRef.current.send({ image: videoRef.current });
                },
                width: 1280,
                height: 720,
            });
            camera.start()
            setCameraInitialised(true)
        }
    }, [GE, ctx, socket, game, cameraInitialised, gameDispatch, ignoredOne, setIgnoredOne, gid])


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