

// "use strict";

//  export const getTime = minute => {
//     const hour = Math.floor(minute / 60); //converts to 1.5hr instead of 90min
//     const day = Math.floor(hour / 24);  //converts hours to day 2days instead of 48hrs

//     const time = day || hour || minute;
//     const unitIndex = [day,hour,minute].lastIndexOf(time);
//     const timeUnit = ["days","hours","minutes"][unitIndex];

//     return{ time, timeUnit};

//  }

//  //cause time is not available in api

//  const randomTime = Math.floor(Math.random() * 90) + 10; // 10–99 minutes
// const { time, timeUnit } = getTime(randomTime);