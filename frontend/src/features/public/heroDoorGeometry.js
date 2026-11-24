// Coordinates follow the inner edge of each plate's fixed ornamental frame.
// The cavity, moving leaves and reflected doorway must share this same outline.
const doorways = {
  light: {
    outline:
      "M1130 720 V548 C1130 492 1168 437 1209 425 C1251 414 1294 455 1294 507 V686 Z",
    left: 1130,
    split: 1209,
    right: 1294,
    bottomLeft: 720,
    bottomRight: 686,
  },
  dark: {
    outline:
      "M1137 729 V548 C1137 492 1176 442 1220 430 C1264 419 1304 462 1304 513 V695 Z",
    left: 1137,
    split: 1220,
    right: 1304,
    bottomLeft: 729,
    bottomRight: 695,
  },
};

export function getHeroDoorGeometry(theme) {
  const door = doorways[theme] ?? doorways.light;
  const slope = (door.bottomRight - door.bottomLeft) / (door.right - door.left);
  return {
    ...door,
    leftTravel: door.split - door.left + 2,
    rightTravel: door.right - door.split + 2,
    slope,
    reflection: `matrix(1 ${2 * slope} 0 -1 0 ${2 * (door.bottomLeft - slope * door.left)})`,
    floor: `M${door.left} ${door.bottomLeft} L${door.right} ${door.bottomRight} V${door.bottomRight - 65} L${door.left} ${door.bottomLeft - 65} Z`,
  };
}
