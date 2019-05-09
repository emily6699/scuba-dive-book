import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {
  getDiverLogsThunk,
  getDiverCertsThunk,
  // getBadgesThunk,
  getLogsThunk
} from '../store'
import {getDiverBadgesThunk} from '../store/diverBadgesReducer'
import {LineChart, BarChart, DepthChart} from './D3Components'
import {Tooltip} from 'britecharts-react'

import {TimeStringToFloat} from '../../utilities/d3Utils'

class DiverAnalysis extends Component {
  componentDidMount() {
    this.props.loadDiverLogs(this.props.diver.id)
    this.props.loadDiverCerts(this.props.diver.id)
    this.props.loadDiverBadges(this.props.diver.id)
    this.props.loadAllLogs()
  }
  render() {
    const {firstName, id} = this.props.diver
    const {diverLogs, diverCerts, diverBadges, allLogs} = this.props
    const timeUnderWaterDateData = diverLogs.reduce((accum, log) => {
      if (log) {
        accum.push({
          date: log.date,
          value:
            (TimeStringToFloat(log.timeOut) - TimeStringToFloat(log.timeIn)) *
            60
        })
      }
      return accum
    }, [])

    const airEfficiencyDateData = diverLogs.reduce((accum, log) => {
      if (log) {
        accum.push({
          date: log.date,
          value:
            (log.tankPressureStart - log.tankPressureEnd) /
            ((TimeStringToFloat(log.timeOut) - TimeStringToFloat(log.timeIn)) *
              60)
        })
      }
      return accum
    }, [])

    let usersThatDive = []

    const numberOfDivesComparisonData = allLogs.reduce(
      (accum, log) => {
        if (usersThatDive.indexOf(log.diverId) === -1) {
          usersThatDive.push(log.diverId)
        }
        if (log.diverId === id) {
          accum.myDives += 1
        } else {
          accum.otherDives += 1
        }
        return accum
      },
      {myDives: 0, otherDives: 0}
    )

    numberOfDivesComparisonData.otherDives =
      numberOfDivesComparisonData.otherDives / (usersThatDive.length - 1)

    const timeUnderWaterData = {
      dataByTopic: [
        {
          topicName: 'Time Under Water',
          topic: 'Time Under Water',
          dates: timeUnderWaterDateData
        }
      ]
    }

    const airEfficiencyData = {
      dataByTopic: [
        {
          topicName: 'Air Consumption per min',
          topic: 'Air Consumption per min',
          dates: airEfficiencyDateData
        }
      ]
    }

    const maxDepthData = diverLogs.reduce((accum, log) => {
      accum.push({
        date: log.date,
        name: 'Max Depth',
        value: log.maxDepth
      })
      return accum
    }, [])

    if (allLogs.length === 0) {
      return <h1>LOADING...</h1>
    }
    return (
      <div className="Container">
        <div className="ChartContainer">
          <h4>Time Under Water Breakdown(mins)</h4>
          <LineChart data={timeUnderWaterData} />
        </div>
        <div className="ChartContainer">
          <h4>Air Consumption Breakdown (Bar per min)</h4>
          <LineChart data={airEfficiencyData} />
        </div>
        <div className="ChartContainer">
          <h4>Number of Dives Comparison</h4>
          <BarChart
            data={[
              {
                value: numberOfDivesComparisonData.myDives,
                name: 'Your Dives'
              },
              {
                value: numberOfDivesComparisonData.otherDives,
                name: 'Avg Number of Dives for Other Divers'
              }
            ]}
          />
        </div>
        <div className="ChartContainer">
          <h4>Max Depth History</h4>
          <DepthChart data={maxDepthData} />
          {/* <Tooltip render={DepthChart} /> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    diver: state.diver,
    diverLogs: state.diverLogs,
    diverCerts: state.diverCerts,
    diverBadges: state.diverBadges,
    allLogs: state.logs
  }
}

const mapDispatchToProps = dispatch => ({
  loadDiverLogs: diverId => {
    dispatch(getDiverLogsThunk(diverId))
  },
  loadDiverCerts: diverId => {
    dispatch(getDiverCertsThunk(diverId))
  },
  loadDiverBadges: diverId => {
    dispatch(getDiverBadgesThunk(diverId))
  },
  loadAllLogs: () => {
    dispatch(getLogsThunk())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DiverAnalysis)
