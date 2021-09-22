import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

export const createGesture = (gesture) => {
  const description = new GestureDescription(gesture.name)
  gesture.description.forEach(pose => {
    // build the description
    switch (pose[0]) {
      case 'addCurl':
        description[pose[0]](Finger[pose[1]], FingerCurl[pose[2]], pose[3]);
        break;

      case 'addDirection':
        description[pose[0]](Finger[pose[1]], FingerDirection[pose[2]], pose[3]);
        break;

      case 'setWeight':
        description[pose[0]](Finger[pose[1]], pose[2]);
        break;

      default:
        break;
    }
  })
  return description
}; // Create the gesture estimator