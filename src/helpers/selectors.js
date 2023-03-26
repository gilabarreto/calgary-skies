export function formattedClockTime(time) {
  const currentTime = new Date(time * 1000);
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }
  return currentTime.toLocaleTimeString('en-US', timeOptions).replace(' AM', 'am').replace(' PM', 'pm');
}

export function formattedSunsetSunriseTime(time) {
  const currentTime = new Date(time * 1000);
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }
  return currentTime.toLocaleTimeString('en-US', timeOptions).replace(' AM', 'am').replace(' PM', 'pm');
}

export function gradientBg() {
  const hour = new Date().getHours();
  const gradients = [
    'radial-gradient(circle, #2c3e50, #2980b9, #87CEEB)', // 12am - 1am
    'radial-gradient(circle, #2980b9, #3498db, #87CEEB)', // 1am - 2am
    'radial-gradient(circle, #3498db, #87CEEB, #B0C4DE)', // 2am - 3am
    'radial-gradient(circle, #87CEEB, #B0C4DE, #F0E68C)', // 3am - 4am
    'radial-gradient(circle, #B0C4DE, #F0E68C, #FFA500)', // 4am - 5am
    'radial-gradient(circle, #F0E68C, #FFA500, #FF8C00)', // 5am - 6am
    'radial-gradient(circle, #FFA500, #FF8C00, #FF7F50)', // 6am - 7am
    'radial-gradient(circle, #FF8C00, #FF7F50, #FF6347)', // 7am - 8am
    'radial-gradient(circle, #FF7F50, #FF6347, #FF4500)', // 8am - 9am
    'radial-gradient(circle, #FF6347, #FF4500, #FF1493)', // 9am - 10am
    'radial-gradient(circle, #FF4500, #FF1493, #C71585)', // 10am - 11am
    'radial-gradient(circle, #FF1493, #C71585, #4CAF50)', // 11am - 12pm
    'radial-gradient(circle, #C71585, #4CAF50, #8BC34A)', // 12pm - 1pm
    'radial-gradient(circle, #4CAF50, #8BC34A, #CDDC39)', // 1pm - 2pm
    'radial-gradient(circle, #8BC34A, #CDDC39, #FFEB3B)', // 2pm - 3pm
    'radial-gradient(circle, #CDDC39, #FFEB3B, #FFC107)', // 3pm - 4pm
    'radial-gradient(circle, #FFEB3B, #FFC107, #FF9800)', // 4pm - 5pm
    'radial-gradient(circle, #FFC107, #FF9800, #FF5722)', // 5pm - 6pm
    'radial-gradient(circle, #FF9800, #FF5722, #E91E63)', // 6pm - 7pm
    'radial-gradient(circle, #FF5722, #E91E63, #9C27B0)', // 7pm - 8pm
    'radial-gradient(circle, #E91E63, #9C27B0, #673AB7)', // 8pm - 9pm
    'radial-gradient(circle, #9C27B0, #673AB7, #3F51B5)', // 9pm - 10pm
    'radial-gradient(circle at center, #673AB7, #3F51B5, #2c3e50)', // 10pm - 11pm
    'radial-gradient(circle at center, #3F51B5, #2c3e50, #2980b9)', // 11pm - 12am
  ];
  return gradients[hour]
}