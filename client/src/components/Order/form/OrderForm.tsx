import React, {useState, useEffect, FC, useCallback} from 'react';
import axios from 'axios';
import classes from './order-form.module.css';
import {Master, City, Clock, AlertNotification} from '../../../data/types/types';
import {OPENING_HOURS} from '../../../data/constants/systemConstants';
import {OrderFormProps, validate} from './componentConstants';
import {URL as URLS} from '../../../data/constants/routeConstants';
import {format, isBefore} from 'date-fns';
import {
	Button,
	Stack,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	FormHelperText,
	Typography,
	CircularProgress,
	Badge,
	Fab,
	Modal,
	ImageList,
	ImageListItem,
	Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PublicHeader from '../../Headers/PublicHeader';
import {useFormik} from 'formik';
import AlertMessage from 'src/components/Notification/AlertMessage';
import {getBinaryImages, getOrderOptions} from 'src/data/utilities/systemUtilities';
import {useTranslation} from 'react-i18next';


const OrderForm: FC<OrderFormProps> = () => {
	const {t} = useTranslation();
	const [masters, setMasters] = useState<Master[]>([]);
	const [cities, setCities] = useState<City[]>([]);
	const [clocks, setClocks] = useState<Clock[]>([]);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	const [images, setImages] = useState<File[]>([]);
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [openModalImg, setOpenModalImg] = useState<boolean>(false);

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			cityId: 0,
			clockId: 0,
			orderDate: '',
			orderTime: '',
			masterId: '',
			orderPhotos: [] as (string | ArrayBuffer | null)[],
		},
		validate,
		onSubmit: async (values) => {
			if (clocks.length) {
				const {
					startDate,
					endDate,
					price,
					clockSize,
				} = getOrderOptions(clocks, formik.values.orderDate, formik.values.orderTime, formik.values.clockId);
				setLoading(true);
				await axios.post(URLS.STRIPE,
					{
						name: values.name,
						email: values.email,
						clockId: values.clockId,
						clockSize,
						price,
						cityId: values.cityId,
						masterId: values. masterId,
						startWorkOn: startDate,
						endWorkOn: endDate,
						orderPhotos: values.orderPhotos,
					}).then((response) => {
					setLoading(false);
					setAlertOptions({
						message: 'Your order has been created! Please rate the master afterwards!',
						type: 'success',
						notify: true,
					});
					setImages([]);
					formik.resetForm();
					window.location.href = response.data;
				});
			}
		},
	});


	useEffect(() => {
		const readCitiesData = async () => {
			const {data} = await axios.get<City[]>(URLS.CITY_FOR_ORDER);
			if (data.length) {
				setCities(data);
			}
		};

		readCitiesData();
	}, []);


	useEffect(() => {
		const readClocksData = async () => {
			const {data} = await axios.get<Clock[]>(URLS.CLOCK);

			if (data.length) {
				setClocks(data);
			}
		};

		readClocksData();
	}, []);


	useEffect(() => {
		const readAvailableMastersData = async () => {
			if (clocks.length) {
				const {
					startDate,
					endDate,
				} = getOrderOptions(clocks, formik.values.orderDate, formik.values.orderTime, formik.values.clockId);

				if (formik.values.cityId && formik.values.orderDate && formik.values.orderTime && formik.values.clockId) {
					const {data} = await axios.get<Master[]>(URLS.AVAILABLE_MASTER, {
						params: {
							cityId: formik.values.cityId,
							startWorkOn: startDate,
							endWorkOn: endDate,
						},
					});

					if (!data.length) {
						setAlertOptions({
							message: 'All masters has been booked at that time. Please choose another time or date',
							type: 'warning',
							notify: true,
						});
						setMasters([]);
					} else {
						setMasters(data);
					}
				}
			}
		};
		readAvailableMastersData();
	}, [formik.values.cityId, formik.values.clockId, formik.values.orderDate, formik.values.orderTime]);

	const readFiles = useCallback(async () => {
		const binaryImages = await getBinaryImages(images);
		formik.values.orderPhotos = binaryImages;
	}, [images]);

	useEffect(() => {
		if (!images?.length) {
			return;
		}

		const imageUrlsList: string[] = [];
		images?.forEach((item) => imageUrlsList.push(URL.createObjectURL(item)));
		setImageUrls(imageUrlsList);
		readFiles();
	}, [images]);


	const handlePhotoUpload = (event) => {
		if (event.currentTarget.files && event.currentTarget.files.length > 5) {
			setImages([]);
			setAlertOptions({
				message: 'Number of photos must be 5 or less',
				type: 'warning',
				notify: true,
			});
			return;
		} else if (
			event.currentTarget.files && Array.from<File>(event.currentTarget.files).some((file) => file.size > 1024 * 1024)
		) {
			setImages([]);
			setAlertOptions({
				message: 'Photo must be 1 MB size or less',
				type: 'warning',
				notify: true,
			});
			return;
		} else {
			setImages([...event.currentTarget.files]);
		}
	};

	const handleOpenModalImg = () => setOpenModalImg(true);
	const handleCloseModalImg = () => setOpenModalImg(false);

	return (
		<div>
			<PublicHeader/>
			<div className={classes.conteiner}>
				<div className={classes.container_form}>
					<form className={classes.form} onSubmit={formik.handleSubmit}>
						<Stack direction="column" justifyContent="center" spacing={1.5}>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.name')}
									</Typography>
								</div>
								<TextField
									id="name"
									name="name"
									label={t('labels.name')}
									placeholder="Ivan Ivanov"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.name}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.name && Boolean(formik.errors.name)}
									helperText={formik.touched.name && formik.errors.name}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.email')}
									</Typography>
								</div>
								<TextField
									id="email"
									name='email'
									label={t('labels.email')}
									placeholder="example@mail.com"
									variant="filled"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									error={formik.touched.email && Boolean(formik.errors.email)}
									helperText={formik.touched.email && formik.errors.email}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.clock')}
									</Typography>
								</div>
								<FormControl
									fullWidth
									error={formik.touched.clockId && Boolean(formik.errors.clockId)}
								>
									<InputLabel id="clockId">{t('labels.size')}</InputLabel>
									<Select
										id='clockId'
										name='clockId'
										labelId="clockId"
										displayEmpty
										onChange={formik.handleChange}
										value={formik.values.clockId || ''}
										label={t('labels.size')}
										onBlur={formik.handleBlur}
										required
									>
										{
											clocks.map((clock) => (
												<MenuItem key={clock.id} value={clock.id}>
													{`${clock.size}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.clockId && formik.errors.clockId} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.city')}
									</Typography>
								</div>
								<FormControl
									fullWidth
									error={formik.touched.cityId && Boolean(formik.errors.cityId)}
								>
									<InputLabel id="cityId">{t('labels.city')}</InputLabel>
									<Select
										id='cityId'
										name='cityId'
										labelId="cityId"
										onChange={formik.handleChange}
										displayEmpty
										value={formik.values.cityId || ''}
										label={t('labels.city')}
										onBlur={formik.handleBlur}
										required
									>
										{
											cities.map((city) => (
												<MenuItem key={city.id} value={city.id}>
													{`${city.name}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.cityId && formik.errors.cityId} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.date')}
									</Typography>
								</div>
								<TextField
									id="orderDate"
									name='orderDate'
									type='date'
									InputProps={{inputProps: {min: format(new Date(), 'yyyy-MM-dd')}}}
									variant="outlined"
									size="small"
									margin="dense"
									fullWidth
									value={formik.values.orderDate}
									onChange={formik.handleChange}
									required
								/>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.time')}
									</Typography>
								</div>
								<FormControl
									fullWidth
									error={formik.touched.orderTime && Boolean(formik.errors.orderTime)}
								>
									<InputLabel id="orderTime">{t('labels.time')}</InputLabel>
									<Select
										id='orderTime'
										name='orderTime'
										labelId="orderTime"
										onChange={formik.handleChange}
										value={formik.values.orderTime}
										label={t('labels.time')}
										onBlur={formik.handleBlur}
										required
									>
										{
											OPENING_HOURS.map((elem) => (
												<MenuItem
													key={elem}
													value={elem}
													disabled={isBefore(new Date(`${formik.values.orderDate} ${elem}`), new Date())}
												>
													{`${elem}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.orderTime && formik.errors.orderTime} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<div className={classes.form_input__label}>
									<Typography
										variant="h6"
										gutterBottom
										component="label"
									>
										{t('form.master')}
									</Typography>
								</div>
								<FormControl
									fullWidth
									error={formik.touched.masterId && Boolean(formik.errors.masterId)}
								>
									<InputLabel id="masterId">{t('labels.master')}</InputLabel>
									<Select
										id='masterId'
										name='masterId'
										labelId="masterId"
										onChange={formik.handleChange}
										value={formik.values.masterId}
										label={t('labels.master')}
										onBlur={formik.handleBlur}
										required
									>
										{
											masters.map((master) => (
												<MenuItem key={master.id} value={master.id}>
													{`${master.name} | Rating:${master.rating.toFixed(2)}`}
												</MenuItem>
											))
										}
									</Select>
									<FormHelperText> {formik.touched.masterId && formik.errors.masterId} </FormHelperText>
								</FormControl>
							</div>
							<div className={classes.form_section}>
								<Stack direction="row" justifyContent="center" spacing={3} sx={{width: '100%'}}>
									<Typography
										htmlFor="upload-photo"
										component='label'
									>
										<input
											style={{display: 'none'}}
											id="upload-photo"
											name="upload-photo"
											type="file"
											multiple
											accept=".PNG, .JPG, .JPEG"
											onChange={handlePhotoUpload}
										/>
										<Badge badgeContent={images?.length && `${images?.length}/5`} color="secondary">
											<Fab
												color="primary"
												size="large"
												component="span"
												aria-label="add"
												variant="extended"
											>
												<AddIcon /> {t('buttons.upload')}
											</Fab>
										</Badge>
									</Typography>
									<Fab
										size="large"
										component="span"
										aria-label="add"
										variant="extended"
										disabled={images?.length ? false : true}
										onClick={handleOpenModalImg}
									>
										<ImageOutlinedIcon /> {t('buttons.show')}
									</Fab>
								</Stack>
							</div>

							<Modal
								open={openModalImg}
								onClose={handleCloseModalImg}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description"
							>
								<Box sx={{top: '50%',
									position: 'absolute',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									width: 500,
									bgcolor: 'background.paper',
									border: '2px solid #000',
									boxShadow: 24,
									p: 4}}
								>
									<ImageList sx={{width: 500, height: 450, top: '50%', right: '50%'}} cols={3} rowHeight={164}>
										{imageUrls.map((item) => (
											<ImageListItem key={item}>
												<img
													src={`${item}`}
													loading="lazy"
												/>
											</ImageListItem>
										))}
									</ImageList>
								</Box>
							</Modal>
							<div className={classes.form_section}>
								<Button
									variant="contained"
									type="submit"
									color='success'
									className={classes.form_btn}
									style={ {fontSize: 18, borderRadius: 15} }
									disabled={loading}

								>
									{t('buttons.create')}
									{loading && <CircularProgress
										size={56}
										color="success"
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											marginTop: '-28px',
											marginLeft: '-28px',
										}}
									/>}
								</Button>
							</div>
						</Stack>
					</form>
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


export default OrderForm;
