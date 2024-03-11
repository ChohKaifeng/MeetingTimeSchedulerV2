// var userData = [
//   //8, 10, 13
//   ["1100000008", "1000", "1800"], // cannot
//   ["1100000009", "1500", "1800"], // cannot
//   ["1100000010", "0900", "1100"], // can
//   ["1100000011", "0800", "1000"], // can
//   ["1100000012", "0800", "1100"], // can
//   ["1100000013", "0800", "1000"], // can
// ];

var userData = [
  //8, 10, 13
  ["1100000008", "1000", "1800"], // cannot
  ["1100000009", "1500", "1800"], // cannot
  ["1100000010", "0900", "1100"], // can
  ["1100000011", "0900", "1100"], // can
  ["1100000012", "0900", "1100"], // can
  ["1100000013", "0800", "1000"], // can
];
var timeRange = ["0800", "1100"];
var meetingDuration = "2";

algorithm();

function timeConverter(userData, timeRange, meetingDuration) {
  // Convert Time Range to minutes
  let startingTimeRange = parseInt(timeRange[0]);
  let endingTimeRange = parseInt(timeRange[1]);
  let convertedMeetingDuration = parseFloat(meetingDuration);

  timeRange[0] =
    Math.floor(startingTimeRange / 100) * 60 + (startingTimeRange % 100);
  timeRange[1] =
    Math.floor(endingTimeRange / 100) * 60 + (endingTimeRange % 100);
  convertedMeetingDuration = convertedMeetingDuration * 60;

  for (let i = 0; i < userData.length; i++) {
    let startTime = parseInt(userData[i][1]);
    let endTime = parseInt(userData[i][2]);

    // Convert ST, ET to minutes
    userData[i][1] = Math.floor(startTime / 100) * 60 + (startTime % 100);
    userData[i][2] = Math.floor(endTime / 100) * 60 + (endTime % 100);
  }

  return convertedMeetingDuration;
}

//       userData[i][1] >= timeRange[0] &&
//   userData[i][2] >= timeRange[1] &&
//   userData[i][1] >= timeRange[1]

function filterAvailableStaff(convertedMeetingDuration) {
  let availableStaff = [];

  // Find out if start & end time is within time Range
  // 1. Within Time Range (TR)
  // 2. User ST is within ST TR, User ET after ET TR, User ST before ET TR
  // (Find those end later than proposed time)
  // 3. User ST is within ST TR, User ET before ET TR, User ET before ST TR
  // (Find those start earlier than proposed time)
  // 4. User ST is before ST TR, User ET is after ET TR
  // (Find those start earlier & end later)
  for (let i = 0; i < userData.length; i++) {
    // Check if the following qualifies:
    // 1. TR End time & User ST is more or equal to the meeting Duration
    // 2. User schedule can fit meeting duration
    if (
      timeRange[1] - userData[i][1] >= convertedMeetingDuration &&
      userData[i][2] - userData[i][1] >= convertedMeetingDuration
    ) {
      if (userData[i][1] >= timeRange[0] && userData[i][2] <= timeRange[1])
        availableStaff.push(userData[i]);
      else if (
        userData[i][1] >= timeRange[0] &&
        userData[i][2] > timeRange[1] &&
        userData[i][1] < timeRange[1]
      )
        availableStaff.push(userData[i]);
      else if (
        userData[i][1] <= timeRange[0] &&
        userData[i][2] <= timeRange[1] &&
        userData[i][2] > timeRange[0]
      )
        availableStaff.push(userData[i]);
      else if (userData[i][1] < timeRange[0] && userData[i][2] > timeRange[1])
        availableStaff.push(userData[i]);
    }
  }
  return availableStaff;
}

function findEarliestTimeLatestTime(availableStaff) {
  let earliestTimeLatestTime = [undefined, undefined];

  // Find out avail staff Earliest ST & Latest ET
  for (let i = 0; i < availableStaff.length; i++) {
    if (
      earliestTimeLatestTime[0] == undefined ||
      earliestTimeLatestTime[0] > availableStaff[i][1]
    ) {
      earliestTimeLatestTime[0] = availableStaff[i][1];
    }

    if (
      earliestTimeLatestTime[1] == undefined ||
      earliestTimeLatestTime[1] < availableStaff[i][2]
    ) {
      earliestTimeLatestTime[1] = availableStaff[i][2];
    }
  }

  return earliestTimeLatestTime;
}

function findPotentialMeetingTime(
  earliestTimeLatestTime,
  convertedMeetingDuration
) {
  let potentialMeetingTimeCombos = [];
  let startTime = earliestTimeLatestTime[0];
  let latestEndTime = earliestTimeLatestTime[1];

  // Find Potential Meeting Times
  // PotentialMeetingTimeCombos (Start Time, End Time, Participants)
  // Find combos that
  // 1. Fits into meeting duration
  // 2. Does not exceed the latest ending time.
  do {
    potentialMeetingTimeCombos.push([
      startTime,
      startTime + convertedMeetingDuration,
      0,
    ]);
    startTime++;
  } while (latestEndTime - startTime >= convertedMeetingDuration);

  return potentialMeetingTimeCombos;
}

function findBestStrengthEarliestMeetingTime(
  availableStaff,
  potentialMeetingTimeCombos
) {
  // Find out which timing has the most attendees.
  for (let x = 0; x < availableStaff.length; x++) {
    for (let i = 0; i < potentialMeetingTimeCombos.length; i++) {
      // Count if
      // 1. Potential start time is later or same to staff available start time
      // 2. Potential end time needs to be earlier or same to staff's available end time
      if (
        potentialMeetingTimeCombos[i][0] >= availableStaff[x][1] &&
        potentialMeetingTimeCombos[i][1] <= availableStaff[x][2]
      ) {
        potentialMeetingTimeCombos[i][2]++;

        // If only 1 person is able to make it to the meeting, push username in
        // Else if >1 person is able to make it, push username in a 3D Array.
        if (potentialMeetingTimeCombos[i][2] === 1)
          potentialMeetingTimeCombos[i].push([availableStaff[x][0]]);
        else if (potentialMeetingTimeCombos[i][2] > 1)
          potentialMeetingTimeCombos[i][3].push(availableStaff[x][0]);
      }

    }
  }

  let bestStrengthEarliestTiming = [];

  // Find out which timing is the earliest
  for (let i = 0; i < potentialMeetingTimeCombos.length; i++) {
    // If bestStrengthEarliestTiming array is 0, Fill with first data
    // However, if there is a potential meeting time combo that appears more than
    // the current highest potential meeting count, replace it as the new highest.
    if (
      bestStrengthEarliestTiming.length === 0 ||
      potentialMeetingTimeCombos[i][2] > bestStrengthEarliestTiming[2]
    )
      bestStrengthEarliestTiming.splice(
        0,
        4,
        potentialMeetingTimeCombos[i][0],
        potentialMeetingTimeCombos[i][1],
        potentialMeetingTimeCombos[i][2],
        potentialMeetingTimeCombos[i][3]
      );
  }

  return bestStrengthEarliestTiming;
}

function algorithm() {
  let possiblePairs = [];

  //Convert Time
  let convertedMeetingDuration = timeConverter(
    userData,
    timeRange,
    meetingDuration
  );

  let availableStaff = filterAvailableStaff(convertedMeetingDuration);
  let earliestTimeLatestTime = findEarliestTimeLatestTime(availableStaff);

  let potentialMeetingTimes = findPotentialMeetingTime(
    earliestTimeLatestTime,
    convertedMeetingDuration
  );

  let earliestMeetingBestStrength = findBestStrengthEarliestMeetingTime(
    availableStaff,
    potentialMeetingTimes
  );

  console.log(earliestMeetingBestStrength);

  // Best timing is 480, 600, staff 11 &  13
}

//FIND BEST TIMING OF ALL STAFF (EARLIER BETTER WITH MOST STAFF)
