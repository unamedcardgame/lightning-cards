import { createGesture } from "./createGesture";

export const gestures = [
  // PEACE
  createGesture({
    "name": "peace",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": "7.25",
    "description": [
      [
        "addCurl",
        "Thumb",
        "HalfCurl",
        0.5
      ],
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Index",
        "VerticalUp",
        0.5789473684210527
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpRight",
        0.5789473684210527
      ],
      [
        "addCurl",
        "Ring",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpLeft",
        0.4117647058823529
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpRight",
        0.35294117647058826
      ],
      [
        "addCurl",
        "Pinky",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "DiagonalUpRight",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "VerticalUp",
        0.42105263157894735
      ],
      [
        "addDirection",
        "Pinky",
        "DiagonalUpLeft",
        0.15789473684210525
      ],
      [
        "setWeight",
        "Index",
        2
      ],
      [
        "setWeight",
        "Middle",
        2
      ]
    ]
  }),
  // OKAY
  createGesture({
    "name": "okay",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": "7.25",
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Index",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpRight",
        1
      ],
      [
        "addDirection",
        "Middle",
        "VerticalUp",
        0.25
      ],
      [
        "addCurl",
        "Ring",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "VerticalUp",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpLeft",
        1
      ],
      [
        "setWeight",
        "Index",
        2
      ]
    ],
    "enabled": true
  }),
  // PEWPEW
  createGesture({
    "name": "pewpew",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": "7.25",
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        1
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "HorizontalLeft",
        1
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "HorizontalLeft",
        1
      ],
      [
        "addCurl",
        "Ring",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "HorizontalLeft",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "HorizontalLeft",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addDirection",
        "Index",
        "HorizontalRight",
        1
      ],
      [
        "addDirection",
        "Middle",
        "HorizontalRight",
        1
      ],
      [
        "addDirection",
        "Ring",
        "HorizontalRight",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "HorizontalRight",
        1
      ]
    ],
    "enabled": true
  }),
  // ROCKON
  createGesture({
    "name": "rockon",
    "algorithm": "fingerpose",
    "models": "hands",
    "confidence": 7.5,
    "description": [
      [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpRight",
        1
      ],
      [
        "addCurl",
        "Middle",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "VerticalUp",
        1
      ],
      [
        "addCurl",
        "Ring",
        "FullCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "VerticalUp",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        1
      ]
    ]
  })
]