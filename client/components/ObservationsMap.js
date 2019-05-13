import React, {Component} from 'react'
import ReactMapGL, {Marker, Popup} from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import {connect} from 'react-redux'
import {getObservationCoordThunk} from '../store'
import {Link} from 'react-router-dom'
// import dotenv from 'dotenv'

// dotenv.config()

class ObservationsMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 1.8
      },
      // popupInfo: null
    }
  }

  async componentDidMount() {
    await this.props.fetchObservationsCoords(this.props.match.params.obsId)
  }

  async componentDidUpdate() {
    if (this.props.observations.length === 0) {
      await this.props.fetchObservationsCoords(this.props.match.params.obsId)
    }
  }

  // renderPopup() {
  //   const {popupInfo} = this.state
  //   if (popupInfo && popupInfo.diveName) {
  //     return (
  //       <Popup
  //         tipSize={5}
  //         latitude={popupInfo.geog.coordinates[1]}
  //         longitude={popupInfo.geog.coordinates[0]}
  //         anchor="top"
  //         onClose={() => this.setState({popupInfo: null})}
  //         closeOnClick={false}
  //       >
  //         <div className="popup">
  //           <div>
  //             <strong>{popupInfo.diveName}</strong>
  //           </div>
  //           <div>
  //             <em>{popupInfo.location}</em>
  //           </div>
  //           <div>
  //             <em>{popupInfo.date.split('T')[0]}</em>
  //           </div>
  //           {/* add img here */}
  //           <div>
  //             <Link to={`/logs/${popupInfo.id}`}>Details</Link>
  //           </div>
  //         </div>
  //       </Popup>
  //     )
  //   } else if (popupInfo && popupInfo.storeFrontImgUrl) {
  //     return (
  //       <Popup
  //         tipSize={5}
  //         latitude={popupInfo.geog.coordinates[1]}
  //         longitude={popupInfo.geog.coordinates[0]}
  //         anchor="top"
  //         onClose={() => this.setState({popupInfo: null})}
  //         closeOnClick={false}
  //       >
  //         <div className="popup">
  //           <div>
  //             <strong>{popupInfo.name}</strong>
  //           </div>
  //           <div>
  //             <em>{popupInfo.location}</em>
  //           </div>
  //           <div>
  //             <img
  //               src={`/pictures/diveshop/${popupInfo.storeFrontImgUrl}`}
  //               alt="Store Front Image"
  //             />
  //           </div>
  //         </div>
  //       </Popup>
  //     )
  //   }
  // }

  // renderNearestPopup() {
  //   const {popupInfo} = this.state
  //   return (
  //     popupInfo && (
  //       <Popup
  //         tipSize={5}
  //         latitude={popupInfo.geog.coordinates[1]}
  //         longitude={popupInfo.geog.coordinates[0]}
  //         anchor="top"
  //         onClose={() => this.setState({popupInfo: null})}
  //         closeOnClick={false}
  //       >
  //         <div className="popup">
  //           <div>
  //             <strong>{popupInfo.name}</strong>
  //           </div>
  //           <div>
  //             <em>{popupInfo.location}</em>
  //           </div>
  //           <div>
  //             <img src={popupInfo.storeFrontImgUrl} alt="Store Front Image" />
  //           </div>
  //         </div>
  //       </Popup>
  //     )
  //   )
  // }

  render() {
    const {observations} = this.props
    console.log(this.props)
    if (observations.length === 0) {
      return <h1>LOADING</h1>
    }
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({viewport})}
        mapboxApiAccessToken="pk.eyJ1IjoiaGFycmlzb25jb2xlIiwiYSI6ImNqdmgyYW1iejBkeW00NG9jZDVidzNraDMifQ.8UJj9FAH_jJiFPcUAJ22KA"
        mapStyle="mapbox://styles/mapbox/dark-v9"
      >
        {observations.map(
          obs =>
          obs.geog && (
              <div>
                {console.log(obs.geog)}
                <Marker
                  key={obs.id}
                  latitude={obs.geog.coordinates[1]}
                  longitude={obs.geog.coordinates[0]}
                  offsetLeft={-20}
                  offsetTop={-10}
                >
                  <i
                    className="fas fa-flag diveflag"
                    // onClick={() => this.setState({popupInfo: log})}
                  />
                </Marker>
              </div>
            )
        )}{' '}
        <div className="mapKey">
          <div className="mapKey-title">Key</div>
          <div>
            <i className="fas fa-flag diveflag" />
            <span className="mapKey-desc">My Observations</span>
          </div>

        </div>
        {/* {this.renderPopup()} */}
        {/* {this.renderNearestPopup()} */}
      </ReactMapGL>
    )
  }
}

const mapStateToProps = state => ({
  observations: state.observationsMap
})

const mapDispatchToProps = dispatch => ({
  fetchObservationsCoords: id => {
    dispatch(getObservationCoordThunk(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ObservationsMap)
