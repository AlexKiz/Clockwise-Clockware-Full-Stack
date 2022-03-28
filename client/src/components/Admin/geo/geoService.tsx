import axios from 'axios';
import React, {useState, useCallback, useRef, useEffect, FC} from 'react';
import {GeoServiceProps, LOCATION, MAP_STYLE, libraries} from './componentConstants';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import {
	GoogleMap,
	useJsApiLoader,
	DrawingManager,
} from '@react-google-maps/api';
import {
	Button,
	CircularProgress,
	Stack,
	Typography,
} from '@mui/material';
import {URL} from 'src/data/constants/routeConstants';
import classes from './geo-service.module.css';
import {AlertNotification} from 'src/data/types/types';
import AlertMessage from 'src/components/Notification/AlertMessage';


const GeoService: FC<GeoServiceProps> = () => {
	const [isDrawingPanelActive, setIsDrawingPanelActive] = useState<boolean>(false);
	const [drawingMode, setDrawingMode] = useState(null);
	const [drawnPolygon, setDrawnPolygon] = useState<null | google.maps.Polygon>(null);
	const [polygonCoordinates, setPolygonCoordinates] = useState<{lat: number, lng: number}[] | []>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});

	useEffect(() => {
		const getSavedPolygon = async () => {
			await axios.get(URL.GEO_COORDINATES).then((response) => {
				if (response?.data?.length) {
					const coordinates = response.data.map((elem) => {
						return {
							lat: Number(elem.lat),
							lng: Number(elem.lng),
						};
					});
					const preloadedPolygon = new google.maps.Polygon({
						paths: coordinates,
					});
					preloadedPolygon.setMap(mapRef.current || null);

					setDrawnPolygon(preloadedPolygon);
					setIsDrawingPanelActive(false);
				}
			});
		};

		getSavedPolygon();
	}, []);

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

	const handleCoordinateSubmit = () => {
		setLoading(true);
		axios.post(URL.GEO_COORDINATES, {
			coordinates: polygonCoordinates,
		}).then(() => {
			setAlertOptions({
				message: 'Area is succesfully created!',
				type: 'success',
				notify: true,
			});
			setPolygonCoordinates([]);
			setLoading(false);
		}).catch(() => {
			setAlertOptions({
				message: 'Something went wrong while submiting!',
				type: 'error',
				notify: true,
			});
			setLoading(false);
		});
	};

	const handlePolygonCoordinates = (polygon) => {
		const polygonBounds = polygon.getPath().getArray();
		const bounds: {lat: number, lng: number}[] = polygonBounds.map((elem) => {
			return {
				lat: elem.lat(),
				lng: elem.lng(),
			};
		});
		setPolygonCoordinates(bounds);
		setDrawingMode(null);
		setIsDrawingPanelActive(false);
	};

	const handleOnOverlayComplete = (e) => {
		setDrawnPolygon(e.overlay);
	};

	const deleteShape = () => {
		drawnPolygon?.setMap(null);
		setDrawnPolygon(null);
		setIsDrawingPanelActive(true);
		setPolygonCoordinates([]);
	};

	const editShape = () => {
		drawnPolygon?.setEditable(true);
		drawnPolygon?.setDraggable(true);
		handlePolygonCoordinates(drawnPolygon);
	};

	const submitEditShape = () => {
		drawnPolygon?.setEditable(false);
		drawnPolygon?.setDraggable(false);
		handlePolygonCoordinates(drawnPolygon);
	};

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.container}>
				<div className={classes.container_content}>
					<div className={classes.containerMap}>
						{isLoaded ? <GoogleMap
							mapContainerStyle={MAP_STYLE.CONTAINER}
							center={LOCATION.DNIPRO}
							zoom={12}
							onLoad={onLoad}
							onUnmount={onUnmount}
						>
							{
								<DrawingManager
									onPolygonComplete={handlePolygonCoordinates}
									onOverlayComplete={handleOnOverlayComplete}
									options = {{
										drawingControlOptions: {
											drawingModes: [google.maps.drawing.OverlayType.POLYGON],
										},
										drawingControl: isDrawingPanelActive,
										drawingMode: drawingMode,
									}}
								/>
							}
							<></>
						</GoogleMap> : <div>Something went wrong</div>}
						<Stack
							direction="column"
							justifyContent="center"
							alignItems="center"
							spacing={1.5}
							sx={{width: '25%'}}
						>
							<Typography
								variant="h6"
								gutterBottom
								component="label"
							>
								Drawing editor
							</Typography>
							<Stack
								direction="row"
								justifyContent="center"
								alignItems="center"
								spacing={1.5}
								sx={{width: '100%'}}
							>
								<Button
									variant="contained"
									color='info'
									sx={{width: '50%', fontSize: 14, borderRadius: 15}}
									disabled={drawnPolygon ? drawnPolygon.getEditable() : true}
									onClick={editShape}
								>
									Edit drawn area
								</Button>
								<Button
									variant="contained"
									color='success'
									sx={{width: '50%', fontSize: 14, borderRadius: 15}}
									disabled={drawnPolygon ? !drawnPolygon.getEditable() : true}
									onClick={submitEditShape}
								>
									Submit editing
								</Button>
							</Stack>
							<Button
								variant="contained"
								color='error'
								sx={{width: '100%', fontSize: 14, borderRadius: 15}}
								style={{marginBottom: '100px'}}
								disabled={!drawnPolygon}
								onClick={deleteShape}
							>
								Delete drawn area
							</Button>
							<Typography
								variant="h6"
								gutterBottom
								component="label"
							>
								Submit chosen area
							</Typography>
							<Button
								variant="contained"
								color='success'
								sx={{width: '100%', fontSize: 14, borderRadius: 15}}
								disabled={!((drawnPolygon ? !drawnPolygon.getEditable() : true) && polygonCoordinates.length)}
								onClick={handleCoordinateSubmit}
							>
								Submit
								{loading && <CircularProgress
									size={28}
									color="success"
									sx={{
										position: 'absolute',
										top: '50%',
										left: '50%',
										marginTop: '-14px',
										marginLeft: '-14px',
									}}
								/>}
							</Button>
						</Stack>
					</div>
				</div>
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
		</div>
	);
};

export default GeoService;
