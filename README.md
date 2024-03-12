# MeetingTimeSchedulerV2
## Table of contents
* [General info](#general-info)
* [Setup](#setup)
* [How does it work?](#how-does-it-work)
* [Test cases](#test-cases)

## General info
This project is a simpler & improved algorithm for scheduling a common meeting time among users. 

The user has to provide the following:
* List of users & their availability time range
* Time Range that the meeting is going to be held
* Duration of the meeting

By default, the code will gather the **_Earliest Meeting Time with Most Attendees._**

## Setup
To run this project, install it locally using npm:

```
$ cd ../MeetingTimeSchedulerV2
$ npm install
$ npm start
```

## How does it work?
This algorithm has 5 main functions that sort & filter out the data to get the desired output by the user. They are: 
* timeConverter
* filterAvailableStaff
* findEarliestTimeLatestTime
* findPotentialMeetingTime
* findBestStrengthEarliestMeetingTime

#### Step One: Time Converter (timeConverter)
The first step is to convert the raw data, keyed by the user, into Minutes. 

This helps to standardise & simplify dealing with timings. 

#### Step Two: Filter Available Staff (filterAvailableStaff)
Once all the timing has been converted, the next thing to do is to filter out unavailable staff. 

The function first removes staff that are unable to be there for the: 
* Entire meeting duration
* During the indicated time range

Following this, data is taken in if the staff can make it within the time range. This returns the staff that is available for the meeting. 

#### Step Three: Find Earliest Timing & Latest Timing (findEarliestTimeLatestTime)
After getting all the available staff, the next step involves finding the earliest & latest start time.

This helps to gather the latest timing that the meeting has to start to fulfil the meeting duration. 

#### Step Four: Find Potential Meeting Time (findPotentialMeetingTime)
Gathering all the potential start timings, the next step is to find the potential meeting time combos. 

All the potential start timings & their ending timings, which fulfil the meeting duration, will be tracked inside an array. By default, the attendees are 0 as this function focuses on finding the combination of meeting times. 

#### Step Five: Find Earliest Meeting Time with the Best Attendees (findBestStrengthEarliestMeetingTime)
Finally, this function will run through all the potential meeting times to find the attendees available  each time.

It will then find the time which has the most attendees & set that as the default start time. If there is a tie in the attendees, the meeting timing will be set to the earliest. 

## Test cases
Four test cases were run to find out if the algorithm works.
 
#### Test Case 1: Passed ✅
Scenario: 
* 1100000008 is available from 1000 to 1800.
* 1100000009 is available from 1500 to 1800.
* 1100000010, 1100000011, 1100000012 and 1100000013 is available from 0800 to 1100.
* Meeting is 2 hours long & must be held between 0800 to 1100.

Desired outcome: 
* 1100000010, 1100000011, 1100000012 and 1100000013 will be available
* Meeting time is 0800 (480) to 1000 (600)

Outcome: 
![image](https://github.com/ChohKaifeng/MeetingTimeSchedulerV2/assets/64060097/a0809e0f-278e-4ca2-a009-c605cc751c37)

#### Test Case 2: Passed ✅
Scenario: 
* 1100000008 is available from 1000 to 1800.
* 1100000009 is available from 1500 to 1800.
* 1100000010, 1100000011, 1100000012 and 1100000013 are available from 0800 to 1200.
* Meeting is 2 hours long & must be held between 0800 to 1200.

Outcome: 
* 1100000008, 1100000010, 1100000011, 1100000012 and 1100000013 will be available
* Meeting time is 1000 (600) to 1200 (720)

Outcome: 
![image](https://github.com/ChohKaifeng/MeetingTimeSchedulerV2/assets/64060097/cabe039c-80dc-44ef-9c1c-3cb7a0060460)

#### Test Case 3: Passed ✅
Scenario: 
* 1100000008, 1100000009, 1100000010 is available from 1000 to 1200.
* 1100000011, 1100000012 and 1100000013 are available from 0800 to 1000.
* Meeting is 2 hours long & must be held between 0800 to 1200.

Desired outcome: 
* 1100000011, 1100000012 and 1100000013 will be available since it is the earliest timing
* Meeting time is 0800 (480) to 1000 (600)

Outcome: 
![image](https://github.com/ChohKaifeng/MeetingTimeSchedulerV2/assets/64060097/17b9a7b2-e3d6-468a-9c8e-62d8240c8237)
