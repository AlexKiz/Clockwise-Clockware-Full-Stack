import axios from 'axios';
import React, {useState, useEffect, FC, useCallback} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {RESOURCE, URL as URLS} from 'src/data/constants/routeConstants';
import classes from './article-create.module.css';
import PrivateHeader from '../../../Headers/PrivateHeader';
import {ArticleCreateProps} from './componentConstants';
import {AlertNotification, Params} from '../../../../data/types/types';
import {Editor} from '@tinymce/tinymce-react';
import {
	Badge,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Fab,
	Modal,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PreviewIcon from '@mui/icons-material/Preview';
import AlertMessage from '../../../Notification/AlertMessage';
import {getBinaryFromBlob, getBinaryImages} from '../../../../data/utilities/systemUtilities';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import dotenv from 'dotenv';
dotenv.config();


const ArticleCreate: FC<ArticleCreateProps> = () => {
	const history = useHistory();

	const {articleTitle} = useParams<Params>();
	const [articleId, setArticleId] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [articlePhoto, setArticlePhoto] = useState<File[]>([]);
	const [articleMainPhoto, setArticleMainPhoto] = useState<(string | ArrayBuffer | null)[]>([] as string[] | ArrayBuffer[] | null[]);
	const [articlePhotoPreview, setArticlePhotoPreview] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [articleUpdateContent, setArticleUpdateContent] = useState<string>('');

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);
	const [openPreviewArticleCard, setOpenPreviewArticleCard] = useState<boolean>(false);


	useEffect(() => {
		const getArticles = async () => {
			axios.get(URLS.ARTICLE_FOR_UPDATE, {
				params: {
					title: articleTitle,
				},
			}).then((response) => {
				setArticleId(response.data.id);
				setTitle(response.data.title);
				setDescription(response.data.description);
				setArticlePhotoPreview(response.data.background);
				setArticleMainPhoto(response.data.background);
				setArticleUpdateContent(response.data.body);
			});
		};
		if (articleTitle) {
			getArticles();
		}
	}, []);

	const readFile = useCallback(async () => {
		const binaryImages = await getBinaryImages(articlePhoto);
		setArticleMainPhoto(binaryImages);
	}, [articlePhoto]);

	useEffect(() => {
		if (articlePhoto.length) {
			const previewPhoto: string[] = [];
			articlePhoto.forEach((item) => previewPhoto.push(URL.createObjectURL(item)));
			setArticlePhotoPreview(previewPhoto[0]);
			readFile();
		} else {
			setArticlePhotoPreview('');
		}
	}, [articlePhoto]);


	const handleSubmitArticle = async () => {
		if (!articleId) {
			setLoading(true);
			await axios.post(URLS.BLOG, {
				title,
				description,
				background: articleMainPhoto,
				body: content,
			});
			setLoading(false);
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ARTICLES_LIST}`);
		} else {
			setLoading(true);
			await axios.put(URLS.BLOG, {
				id: articleId,
				title,
				description,
				background: articleMainPhoto || articlePhotoPreview,
				body: articleUpdateContent,
			});
			setLoading(false);
			history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ARTICLES_LIST}`);
		}
	};


	const handlePhotoUpload = (event) => {
		if (event.currentTarget.files && event.currentTarget.files.length > 1) {
			setArticlePhoto([]);
			setAlertOptions({
				message: 'Only 1 photo allowed!',
				type: 'warning',
				notify: true,
			});
			return;
		} else if (event.currentTarget.files.length && event.currentTarget.files[0].size > 1024 * 1024) {
			setArticlePhoto([]);
			setAlertOptions({
				message: 'Photo must be 1 MB size or less',
				type: 'warning',
				notify: true,
			});
			return;
		} else {
			setArticlePhoto([...event.currentTarget.files]);
		}
	};

	const handleEditorChange = (event) => {
		setContent(event.target.getContent());
	};

	const isOpen = (value:boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const handleOpenPreviewArticleCard = () => setOpenPreviewArticleCard(true);
	const handleClosePreviewArticleCard = () => setOpenPreviewArticleCard(false);

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<div className={classes.container_article}>
					<Stack direction='column' justifyContent='center' spacing={1.5}>
						<Typography
							variant="h6"
							gutterBottom
							component="label"
						>
							Enter article title:
						</Typography>
						<TextField
							id="title"
							name="title"
							placeholder="Type your article title here"
							variant='outlined'
							size="small"
							margin="dense"
							fullWidth
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							inputProps={{
								'data-testid': 'article-title-input',
							}}
							required
						/>
						<Typography
							variant="h6"
							gutterBottom
							component="label"
						>
							Enter article short description:
						</Typography>
						<TextField
							id="description"
							name="description"
							placeholder="Type your article description here"
							variant="outlined"
							size="small"
							margin="dense"
							multiline
							inputProps={{'maxlength': 170, 'data-testid': 'article-description-input'}}
							fullWidth
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
							required
						/>
						<Stack direction='row' justifyContent='center' spacing={1} sx={{width: '100%'}}>
							<Typography
								htmlFor="upload-photo"
								component='label'
								align='left'
								sx={{width: '24%'}}
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
								<Badge badgeContent={articlePhoto.length && `1/1`} color="secondary">
									<Fab
										color="primary"
										size="large"
										component="span"
										aria-label="add"
										variant="extended"
									>
										<AddIcon /> Upload main photo
									</Fab>
								</Badge>
							</Typography>
							<Button
								variant="contained"
								type="submit"
								color='error'
								style={{borderRadius: 20}}
								disabled={Boolean(!title || !description || !articlePhotoPreview)}
								onClick={handleOpenPreviewArticleCard}
								startIcon={<PreviewIcon/>}
							>
								Preview article card
							</Button>
						</Stack>
						<Typography
							variant="h6"
							gutterBottom
							component="label"
						>
							Enter article content:
						</Typography>
						<Editor
							initialValue={articleUpdateContent}
							apiKey= {process.env.REACT_APP_TINY_MCE_API_KEY}
							init={{
								height: 500,
								menubar: true,
								image_title: true,
								automatic_uploads: true,
								file_picker_types: 'image',
								images_file_types: 'jpeg,jpg,png',
								images_upload_handler: async (blobInfo, success, failure) => {
									const image = blobInfo.blob();
									if (image.size > 1024 * 1024) {
										failure('File is too large');
									}
									const binaryImage = await getBinaryFromBlob(image);
									axios.post(URLS.IMAGE, {
										picture: binaryImage,
									}).then((response) => {
										success(response.data);
									});
								},
								plugins: [
									'advlist autolink lists link image',
									'charmap print preview anchor help',
									'searchreplace visualblocks code',
									'insertdatetime media table paste wordcount',
									'image', 'preview',
								],
								toolbar:
								`undo redo | formatselect | bold italic | \
								fontsizeselect | \
								alignleft aligncenter alignright | \
								image preview | \
								bullist numlist outdent indent | help`,
							}}
							onChange={handleEditorChange}
						/>
						<Stack direction='row' justifyContent='center'>
							<Button
								variant="contained"
								color='success'
								style={{fontSize: 18, borderRadius: 15}}
								sx={{width: '50%'}}
								disabled={!articleTitle && Boolean(!title || !description || !articlePhotoPreview || !content)}
								onClick={handleSubmitArticle}
								data-testid='article-form-submit'
							>
								Sumbit
							</Button>
						</Stack>
					</Stack>
				</div>
				<Modal
					open={openPreviewArticleCard}
					onClose={handleClosePreviewArticleCard}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={{top: '50%',
						position: 'absolute',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 320,
						bgcolor: 'warning.main',
						boxShadow: 24,
						p: 4}}
					justifyContent='center'
					display='flex'
					>
						<Card sx={{minWidth: 300, m: 1}}>
							<CardMedia
								component="img"
								height={220}
								image={articlePhotoPreview}
								alt="pic"
							/>
							<CardContent
								sx={{height: 180}}
							>
								<Typography gutterBottom variant="h5" component="div">
									{title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{description}
								</Typography>
							</CardContent>
							<CardActions>
								<Button
									size="small"
									color='info'
									startIcon={<ReadMoreIcon fontSize='large'/>}
								>
                                    Read more...
								</Button>
							</CardActions>
						</Card>
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
		</div>

	);
};

export default ArticleCreate;
