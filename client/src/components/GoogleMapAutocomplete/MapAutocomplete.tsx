/* eslint-disable camelcase */
import React, {FC, useEffect, useState, useCallback, useRef} from 'react';
import {
	Button,
	MenuItem,
	TextField,
	Modal,
	Box,
} from '@mui/material';
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';
import {useTranslation} from 'react-i18next';
import useOnclickOutside from 'react-cool-onclickoutside';
import {libraries, LOCATION, MapAutocompleteProps, MAP_STYLE} from './componentConstant';
import axios from 'axios';
import {URL} from 'src/data/constants/routeConstants';
import classes from './map-autocomplete.module.css';
import MapIcon from '@mui/icons-material/Map';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
	GoogleMap,
	useJsApiLoader,
} from '@react-google-maps/api';
import {AlertNotification} from 'src/data/types/types';
import AlertMessage from 'src/components/Notification/AlertMessage';


const MapAutocomplete: FC<MapAutocompleteProps> = ({setAddress}) => {
	const {t} = useTranslation();
	const [workingArea, setWorkingArea] = useState<{lat: number, lng: number}[] | []>([]);
	const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [addressMarker, setAddressMarker] = useState<null | google.maps.Marker>(null);

	const {isLoaded} = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
		libraries,
	});

	const mapRef = useRef(undefined);

	const onLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const onUnmount = useCallback((map) => {
		mapRef.current = undefined;
	}, []);

	const {
		ready,
		value,
		suggestions: {status, data},
		init,
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		initOnMount: false,
		debounce: 300,
	});

	useEffect(() => {
		const getSavedPolygon = async () => {
			await axios.get(URL.GEO_COORDINATES).then((response) => {
				if (response.data.length) {
					const coordinates = response.data.map((elem) => {
						return {
							lat: Number(elem.lat),
							lng: Number(elem.lng),
						};
					});

					setWorkingArea(coordinates);
				}
			});
		};

		getSavedPolygon();
	}, []);


	useEffect(() => {
		if (isLoaded) {
			init();
		}
	}, [isLoaded]);

	const handleInput = (e) => {
		setValue(e.target.value);
		setAddress(e.target.value);
	};

	const ref = useOnclickOutside(() => {
		clearSuggestions();
		if (value != '') {
			getGeocode({address: value})
				.then((results) => getLatLng(results[0]))
				.then(({lat, lng}) => {
					const point = new google.maps.LatLng(lat, lng);
					const area = new google.maps.Polygon({
						paths: workingArea,
					});
					const isWithinWorkingArea = google.maps.geometry.poly.containsLocation(
						point,
						area,
					);
					if (isWithinWorkingArea) {
						const marker = new google.maps.Marker({position: point});
						addressMarker?.setMap(null);
						marker.setMap(mapRef.current || null);
						setAddressMarker(marker);
					} else {
						setAlertOptions({
							message: 'Address is not in a working area',
							type: 'error',
							notify: true,
						});
						addressMarker?.setMap(null);
						setAddressMarker(null);
						setValue('');
						setAddress(null);
					}
				}).catch(() => {
					setValue('');
					setAddress(null);
				});
		}
	});

	const handleSelect = ({description}) => () => {
		setValue(description, false);
		setAddress(description);
		clearSuggestions();
		getGeocode({address: description})
			.then((results) => getLatLng(results[0]))
			.then(({lat, lng}) => {
				const point = new google.maps.LatLng(lat, lng);
				const area = new google.maps.Polygon({
					paths: workingArea,
				});
				const isWithinWorkingArea = google.maps.geometry.poly.containsLocation(
					point,
					area,
				);
				if (isWithinWorkingArea) {
					const marker = new google.maps.Marker({position: point});
					addressMarker?.setMap(null);
					marker.setMap(mapRef.current || null);
					setAddressMarker(marker);
				} else {
					setAlertOptions({
						message: 'Address is not in a working area',
						type: 'error',
						notify: true,
					});
					addressMarker?.setMap(null);
					setAddressMarker(null);
					setValue('');
					setAddress(null);
				}
			});
	};

	const renderSuggestions = () =>
		data.map((suggestion) => {
			const {
				place_id,
				structured_formatting: {main_text, secondary_text},
			} = suggestion;

			return (
				<MenuItem key={place_id} onClick={handleSelect(suggestion)}>
					<strong>{`${main_text} `}</strong> <small>{`: ${secondary_text}`}</small>
				</MenuItem>
			);
		});

	const handleOpenMap = () => setIsMapOpen(true);
	const handleCloseMap = () => setIsMapOpen(false);
	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const createMarker = (e) => {
		addressMarker?.setMap(null);
		setValue('');
		setAddress(null);
		const lat = e.latLng.lat();
		const lng = e.latLng.lng();
		const newMarker = new google.maps.Marker({position: {lat, lng}});
		getGeocode({location: {lat, lng}})
			.then((res) => {
				const point = new google.maps.LatLng(lat, lng);
				const area = new google.maps.Polygon({
					paths: workingArea,
				});
				const isWithinWorkingArea = google.maps.geometry.poly.containsLocation(
					point,
					area,
				);
				if (isWithinWorkingArea) {
					newMarker.setMap(mapRef.current || null);
					setAddressMarker(newMarker);
					setValue(res[0].formatted_address);
					setAddress(res[0].formatted_address);
				} else {
					setAlertOptions({
						message: 'Address is not in a working area',
						type: 'error',
						notify: true,
					});
					setAddressMarker(null);
					setValue('');
					setAddress(null);
				}
			});
	};


	return (
		<div ref={ref}>
			<TextField
				id='mapAutocomplete'
				name='mapAutocomplete'
				label={t('labels.address')}
				variant='filled'
				size='small'
				margin='dense'
				fullWidth
				value={value}
				onChange={handleInput}
				disabled={!ready}
				placeholder='Your address'
				InputProps={{
					style: {paddingRight: 0},
					endAdornment: (
						<Button
							color='inherit'
							sx={{minWidth: '52px'}}
							onClick={handleOpenMap}
						>
							<MapIcon/>
						</Button>
					),
				}}
			/>
			{
				status === 'OK' && <div className={classes.wrapper}>
					<ul className={classes.address__list}>{renderSuggestions()}</ul>
				</div>
			}
			<Modal
				open={isMapOpen}
				onClose={handleCloseMap}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={{
					top: '50%',
					position: 'absolute',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 1400,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					padding: '50px',
				}}>
					<div style={{position: 'relative', width: '100%'}}>
						<HighlightOffIcon
							fontSize='large'
							sx={{
								position: 'absolute',
								right: '-3.5%',
								top: '-7%',
								color: 'red',
								height: '50px',
								width: '50px',
								cursor: 'pointer',
							}}
							onClick={handleCloseMap}
						/>
						<div className={classes.containerMap}>
							{isLoaded ? <GoogleMap
								mapContainerStyle={MAP_STYLE.CONTAINER}
								center={LOCATION.DNIPRO}
								zoom={12}
								onLoad={onLoad}
								onUnmount={onUnmount}
								onClick={createMarker}
							>
								{}
								<></>
							</GoogleMap> : <div>Something went wrong</div>}
						</div>
					</div>
				</Box>
			</Modal>
			{
				alertOptions.notify &&
					<AlertMessage
						alertType={alertOptions.type}
						message={alertOptions.message}
						isOpen={isOpen}
						notify={alertOptions.notify}
					/>
			}
		</div>
	);
};


export default MapAutocomplete;


