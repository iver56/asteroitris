function euclideanDistance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

function calculateAngleDifference(angle1, angle2) {
  // Return the smallest angle difference between the two angles
  angle1 = angle1.mod(Math.PI * 2);
  angle2 = angle2.mod(Math.PI * 2);
  return Math.PI - Math.abs(Math.abs(angle1 - angle2) - Math.PI);
}
