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
  currentFlight: 0
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
  }
}

const updateFlightShown = () => {}

const main = () => {
  setupHeaderImage()
  getFlightData()
  updateFlightShown()
}

document.addEventListener('DOMContentLoaded', main)
