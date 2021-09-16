// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const thumbsDownGesture = new GestureDescription('thumbsdown'); 

// Thumb 
thumbsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);

thumbsDownGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);




