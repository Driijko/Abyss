const length = 10;
const positions = [];
const increase = 5;
for (let i = 0 ; i < length ; i++) {
  positions[i] = [50, 50];
}

for (let j = 0 ; j <20; j++) {
  for (let i = length - 1; i > 0 ; i--) {
    positions[i] = positions[i - 1];
    // ellipse(positions[i][0], positions[i][1], size, size);
    console.log(positions[i]);
  }
  positions[0] = [positions[0][0] + increase, positions[0][1]];

  console.log(positions[0]);
  console.log("////////////////////////////////////");
}
