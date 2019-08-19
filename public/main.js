const STATE = {
  headerImg: {
    url:
      'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/as15-88-11901orig.jpg',
    title: 'no title',
    copyright: 'no copyright',
    titleAndCopyrightSelector: document.querySelector('.copyright-area'),
    selector: document.querySelector('.header-image')
  },
  flightData: [],
  showFlight: 0,
  currentFlight: {
    nameSelector: document.querySelector('.uld-name'),
    descriptionSelector: document.querySelector('.uld-description'),
    countdownSelector: document.querySelector('.uld-countdown'),
    locationSelector: document.querySelector('.uld-location')
  },
  icons: {
    icon: icon => {
      const i = document.createElement('i')
      i.classList.add('fa')
      i.classList.add(icon)
      return i
    },
    shuttle: () => {
      return STATE.icons.icon('fa-space-shuttle')
    },
    info: () => {
      return STATE.icons.icon('fa-info-circle')
    },
    clock: () => {
      return STATE.icons.icon('fa-clock')
    },
    map: () => {
      return STATE.icons.icon('fa-map-marked-alt')
    }
  }
}

const setupHeaderImage = async () => {
  const response = await fetch(
    'https://sdg-astro-api.herokuapp.com/api/Nasa/apod'
  )
  if (response.status === 200) {
    const data = await response.json()
    STATE.headerImg.url = data.hdUrl
    STATE.headerImg.selector.style.backgroundImage = `url("${
      STATE.headerImg.url
    }")`
    if (data.title) {
      STATE.headerImg.title = data.title
    }
    if (data.copyright) {
      STATE.headerImg.copyright = data.copyright
    }
    STATE.headerImg.titleAndCopyrightSelector.textContent = `copyright: ${
      STATE.headerImg.copyright
    } | title: ${STATE.headerImg.title}`
  } else {
  }
}

class FlightData {
  constructor(title, description, time, location) {
    this.title = title
    this.description = description
    this.time = time
    this.location = location
  }
}

const getFlightData = async () => {
  const response = await fetch(
    'https://sdg-astro-api.herokuapp.com/api/SpaceX/launches/upcoming'
  )
  if (response.status === 200) {
    const data = await response.json()
    data.forEach(flight => {
      STATE.flightData.push(
        new FlightData(
          flight.mission_name,
          flight.details,
          flight.launch_date_unix,
          flight.launch_site.site_name_long
        )
      )
    })
    // console.log(data)
  }
}

const updateFlightShownName = () => {
  STATE.currentFlight.nameSelector.textContent = ''
  STATE.currentFlight.nameSelector.appendChild(STATE.icons.shuttle())
  const span = document.createElement('span')
  span.textContent = ` ${STATE.flightData[STATE.showFlight].title}`
  STATE.currentFlight.nameSelector.appendChild(span)
}

const updateFlightShownDescription = () => {
  STATE.currentFlight.descriptionSelector.textContent = ''
  STATE.currentFlight.descriptionSelector.appendChild(STATE.icons.info())
  const span = document.createElement('span')
  if (!STATE.flightData[STATE.showFlight].description) {
    STATE.flightData[STATE.showFlight].description =
      'No description available yet.'
  }
  span.textContent = ` ${STATE.flightData[STATE.showFlight].description}`
  STATE.currentFlight.descriptionSelector.appendChild(span)
}

const updateFlightShownTime = () => {
  STATE.currentFlight.countdownSelector.textContent = ''
  STATE.currentFlight.countdownSelector.appendChild(STATE.icons.clock())

  const currentTime = Math.floor(new Date().getTime() / 1000)

  const countDownTotalSeconds =
    STATE.flightData[STATE.showFlight].time - currentTime

  // console.log(`current time ${currentTime}`)
  // console.log(`Launch time is ${STATE.flightData[STATE.showFlight].time}`)
  // console.log(`countdown time is ${countDownTime}`)

  const countDownDays = Math.floor(countDownTotalSeconds / 86400)
  const daysRemainder = countDownTotalSeconds % 86400

  const countDownHours = Math.floor(daysRemainder / 3600)
  const hoursRemainder = daysRemainder % 3600

  const countDownMinutes = Math.floor(hoursRemainder / 60)
  const countDownSeconds = hoursRemainder % 60

  const displayTime = `${countDownDays} days, ${countDownHours} hours, ${countDownMinutes} minutes, ${countDownSeconds} seconds`
  if (countDownTotalSeconds > 0) {
    const span = document.createElement('span')
    span.textContent = ` ${displayTime}`
    STATE.currentFlight.countdownSelector.appendChild(span)
  } else {
    const span = document.createElement('span')
    span.textContent = ` This launch has passed.`
    STATE.currentFlight.countdownSelector.appendChild(span)
  }
}

const updateFlightShownLocation = () => {
  STATE.currentFlight.locationSelector.textContent = ''
  STATE.currentFlight.locationSelector.appendChild(STATE.icons.map())
  const span = document.createElement('span')
  span.textContent = ` ${STATE.flightData[STATE.showFlight].location}`
  STATE.currentFlight.locationSelector.appendChild(span)
}

const updateFlightShown = () => {
  updateFlightShownName()
  updateFlightShownDescription()
  updateFlightShownTime()
  updateFlightShownLocation()
}

const previousFlight = () => {
  if (STATE.showFlight === 0) {
    STATE.showFlight = STATE.flightData.length - 1
  } else {
    STATE.showFlight = STATE.showFlight - 1
  }
  updateFlightShown()
}

const nextFlight = () => {
  if (STATE.showFlight === STATE.flightData.length - 1) {
    STATE.showFlight = 0
  } else {
    STATE.showFlight = STATE.showFlight + 1
  }
  updateFlightShown()
}

const main = async () => {
  setupHeaderImage()
  await getFlightData()
  updateFlightShown()
  setInterval(() => {
    updateFlightShownTime()
  }, 1000)
  setInterval(() => {
    nextFlight()
  }, 10000)
}

document.addEventListener('DOMContentLoaded', main)
document.querySelector('.left-arrow').addEventListener('click', previousFlight)
document.querySelector('.right-arrow').addEventListener('click', nextFlight)
