export const MODEL_PARTS = [
  {
    label: "nose",
    value: () => "nose"
  },
  {
    label: "leftEye",
    value: isInverted => (isInverted ? "rightEye" : "leftEye")
  },
  {
    label: "rightEye",
    value: isInverted => (isInverted ? "leftEye" : "rightEye")
  },
  {
    label: "leftEar",
    value: isInverted => (isInverted ? "rightEar" : "leftEar")
  },
  {
    label: "rightEar",
    value: isInverted => (isInverted ? "leftEar" : "rightEar")
  },
  {
    label: "leftShoulder",
    value: isInverted => (isInverted ? "rightShoulder" : "leftShoulder")
  },
  {
    label: "rightShoulder",
    value: isInverted => (isInverted ? "leftShoulder" : "rightShoulder")
  },
  {
    label: "leftElbow",
    value: isInverted => (isInverted ? "rightElbow" : "leftElbow")
  },
  {
    label: "rightElbow",
    value: isInverted => (isInverted ? "leftElbow" : "rightElbow")
  },
  {
    label: "leftWrist",
    value: isInverted => (isInverted ? "rightWrist" : "leftWrist")
  },
  {
    label: "rightWrist",
    value: isInverted => (isInverted ? "leftWrist" : "rightWrist")
  },
  {
    label: "leftHip",
    value: isInverted => (isInverted ? "rightHip" : "leftHip")
  },
  {
    label: "rightHip",
    value: isInverted => (isInverted ? "leftHip" : "rightHip")
  },
  {
    label: "leftKnee",
    value: isInverted => (isInverted ? "rightKnee" : "leftKnee")
  },
  {
    label: "rightKnee",
    value: isInverted => (isInverted ? "leftKnee" : "rightKnee")
  },
  {
    label: "leftAnkle",
    value: isInverted => (isInverted ? "rightAnkle" : "leftAnkle")
  },
  {
    label: "rightAnkle",
    value: isInverted => (isInverted ? "leftAnkle" : "rightAnkle")
  }
];
