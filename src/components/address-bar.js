import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import classnames from '../utils/class-names';

class AddressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            errorMessage: '',
            latitude: null,
            longitude: null,
            isGeocoding: false,
        };
    }

    handleChange = address => {
        this.setState({
            address,
            latitude: null,
            longitude: null,
            errorMessage: '',
        });
    };

    handleSelect = selected => {
        this.setState({ isGeocoding: true, address: selected });
        geocodeByAddress(selected)
            .then(res => getLatLng(res[0]))
            .then(({ lat, lng }) => {
                this.setState({
                    latitude: lat,
                    longitude: lng,
                    isGeocoding: false,
                });
            })
            .catch(error => {
                this.setState({ isGeocoding: false });
                console.log('error', error); // eslint-disable-line no-console
            });
    };

    handleCloseClick = () => {
        this.setState({
            address: '',
            latitude: null,
            longitude: null,
        });
    };

    handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        this.setState({ errorMessage: status }, () => {
            clearSuggestions();
        });
    };

    render() {
        const {
            address,
            latitude,
            longitude,
            isGeocoding,
        } = this.state;

        return (
            <div>
                <PlacesAutocomplete
                    searchOptions={{ componentRestrictions: { country: ['CA'] } }}
                    onChange={this.handleChange}
                    value={address}
                    onSelect={this.handleSelect}
                    onError={this.handleError}
                    shouldFetchSuggestions={address.length > 2}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => {
                        return (
                            <div className='address-bar'>
                                <div className='address-bar__input-box'>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Search Places...',
                                            className: 'address-bar__input',
                                        })}
                                    />
                                    {this.state.address.length > 0 && (
                                        <button
                                            className='address-bar__clear-button'
                                            onClick={this.handleCloseClick}
                                        >
                                            x
                    </button>
                                    )}
                                </div>
                                {suggestions.length > 0 && (
                                    <div className='address-bar__autocomplete-container'>
                                        {suggestions.map(suggestion => {
                                            const className = classnames('address-bar__suggestion-item', {
                                                'address-bar__suggestion-item--active': suggestion.active,
                                            });

                                            return (
                                                /* eslint-disable react/jsx-key */
                                                <div
                                                    {...getSuggestionItemProps(suggestion, { className })}
                                                >
                                                    <strong>
                                                        {suggestion.formattedSuggestion.mainText}
                                                    </strong>{' '}
                                                    <small>
                                                        {suggestion.formattedSuggestion.secondaryText}
                                                    </small>
                                                </div>
                                            );

                                        })}

                                    </div>
                                )}
                            </div>
                        );
                    }}
                </PlacesAutocomplete>


                {
                    ((latitude && longitude) || isGeocoding) && (
                        <div>
                            <h3 className='address-bar__geocode-result-header'>Geocode result</h3>
                            {isGeocoding ? (
                                <div>
                                    <i className='fa fa-spinner fa-pulse fa-3x fa-fw address-bar__spinner' />
                                </div>
                            ) : (
                                    <div>
                                        <div className='address-bar__geocode-result-item--lat'>
                                            <label>Latitude:</label>
                                            <span>{latitude}</span>
                                        </div>
                                        <div className='address-bar__geocode-result-item--lng'>
                                            <label>Longitude:</label>
                                            <span>{longitude}</span>
                                        </div>
                                    </div>
                                )}
                        </div>
                    )
                }
            </div >
        );
    }
}

export default AddressBar;
