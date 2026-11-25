// Broad, open orbits like the reference. Adjacent handles share a tangent so
// every cubic join stays smooth instead of producing small hooks or kinks.
export const heroLightRibbons = [
  {
    id: "rising",
    start: [271, 410],
    curves: [
      [[365, 368], [405, 305], [493, 234]],
      [[581, 163], [672, 142], [703, 160]],
    ],
  },
  {
    id: "upper-orbit",
    start: [98, 366],
    curves: [
      [[-36, 400], [10, 444], [186, 468]],
      [[362, 492], [617, 492], [680, 448]],
      [[743, 404], [633, 366], [509, 370]],
    ],
  },
  {
    id: "lower-orbit",
    start: [338, 512],
    curves: [
      [[205, 523], [191, 565], [336, 585]],
      [[481, 605], [679, 589], [692, 549]],
      [[705, 509], [563, 495], [487, 509]],
    ],
  },
];

export function getRibbonPath({ start, curves }) {
  return `M${start.join(" ")} ${curves.map((curve) => `C${curve.flat().join(" ")}`).join(" ")}`;
}
