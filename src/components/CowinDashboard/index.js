// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccineCoverage: [],
    vaccineByAge: [],
    vaccineByGender: [],
  }

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getFormattedDays = day => ({
    vaccineDate: day.vaccine_date,
    dose1: day.dose_1,
    dose2: day.dose_2,
  })

  getVaccinationDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const vaccinationDays = data.last_7_days_vaccination.map(eachDay =>
        this.getFormattedDays(eachDay),
      )
      const vaccinationAge = data.vaccination_by_age
      const vaccinationGender = data.vaccination_by_gender

      this.setState({
        apiStatus: apiStatusConstants.success,
        vaccineCoverage: vaccinationDays,
        vaccineByAge: vaccinationAge,
        vaccineByGender: vaccinationGender,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationSuccessView = () => {
    const {vaccineCoverage, vaccineByAge, vaccineByGender} = this.state

    return (
      <div className="success-container">
        <VaccinationCoverage vaccineCoverageDetails={vaccineCoverage} />
        <VaccinationByGender vaccineByGenderDetails={vaccineByGender} />
        <VaccinationByAge vaccineByAgeDetails={vaccineByAge} />
      </div>
    )
  }

  renderVaccinationLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-description">Something went wrong</h1>
    </div>
  )

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderVaccinationLoadingView()
      case apiStatusConstants.failure:
        return this.renderVaccinationFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-dashboard-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <h1 className="description">CoWIN Vaccination in India</h1>
        {this.renderVaccinationDetails()}
      </div>
    )
  }
}

export default CowinDashboard
