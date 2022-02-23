import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import {AlertNotification, Article} from 'src/data/types/types';
import classes from './articles-list.module.css';
import {ArticlesProps} from './componentConstants';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import AlertMessage from 'src/components/Notification/AlertMessage';
import AddIcon from '@mui/icons-material/Add';
import {RESOURCE, URL} from 'src/data/constants/routeConstants';


const ArticlesList: FC<ArticlesProps> = () => {
	const [articles, setArticles] = useState<Article[]>([] as Article[]);
	const [totalArticles, setTotalArticles] = useState<number>(0);

	const [page, setPage] = useState<number>(1);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const readArticles = async () => {
			setLoading(true);
			axios.get<{count: number, rows: Article[]}>(URL.BLOG, {
				params: {
					limit: 10,
					offset: (page - 1) * 10,
				},
			}).then((response) => {
				setArticles(response.data.rows);
				setTotalArticles(response.data.count);
				setLoading(false);
			});
		};

		readArticles();
	}, []);

	const handleDeleteArticle = (id: string) => {
		if (window.confirm('Do you want to delete this article?')) {
			axios.delete(URL.BLOG, {
				data: {id},
			}).then(() => {
				setArticles(articles?.filter((article) => article.id !== id));
				setAlertOptions({
					type: 'success',
					message: 'Article has been deleted!',
					notify: true,
				});
			});
		}
	};

	const isOpen = (value: boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
		setPage(page);
	};

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<div className={classes.container_article}>
					<Box sx={{width: '40%', m: '0 auto', p: 2}} className={classes.conteiner_box}>
						<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.ARTICLE_CREATE}`}>
							<Button
								variant="contained"
								color='success'
								sx={{width: '100%', fontSize: 18, borderRadius: 5}}
								startIcon={<AddIcon fontSize='medium'/>}
							>
                            Create new article
							</Button>
						</Link>
					</Box>
					<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '712px'}}>
						<Stack direction="row" flexWrap='wrap' justifyContent='center'>
							{articles?.length ? articles.map((article) => (
								<Card sx={{width: 300, m: 1}} key={article.id}>
									<CardMedia
										component="img"
										height={220}
										image={article.background}
										alt="pic"
									/>
									<CardContent
										sx={{height: 180}}
									>
										<Typography gutterBottom variant="h5" component="div">
											{article.title}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{article.description}
										</Typography>
									</CardContent>
									<CardActions className={classes.card_action}>
										<Link to={`/${RESOURCE.ADMIN}/${RESOURCE.ARTICLE_CREATE}/${article.title}`}>
											<Button
												size="small"
												color='info'
												startIcon={<EditIcon fontSize='medium'/>}
											>
												Edit
											</Button>
										</Link>
										<Button
											size="small"
											color='error'
											startIcon={<DeleteIcon fontSize='medium'/>}
											onClick={() => {
												handleDeleteArticle(article.id);
											}}
										>
                                        Delete
										</Button>
									</CardActions>
								</Card>
							)) : <Box>
								<Typography
									variant='h3'
									component='label'
								>
									{loading ? 'Loading...' : 'There are no articles left!'}
								</Typography>
							</Box>}
						</Stack>
					</Box>
					<Box sx={{m: '0 auto', p: 2}}>
						<Pagination
							color='primary'
							count={totalArticles / 10}
							size="large"
							shape='rounded'
							showFirstButton={true}
							showLastButton={true}
							page={page}
							onChange={handleChangePage}
							sx={{width: '100%', justifyContent: 'center', display: 'flex'}}
						/>
					</Box>
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

export default ArticlesList;
