import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link} from 'react-router-dom';
import classes from './blog.module.css';
import {BlogProps} from './componentConstants';
import {RESOURCE, URL} from '../../data/constants/routeConstants';
import PublicHeader from '../Headers/PublicHeader';
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
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import {Article} from 'src/data/types/types';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';
import PrivateHeader from '../Headers/PrivateHeader';


const Blog: FC<BlogProps> = () => {
	const [articles, setArticles] = useState<Article[]>([] as Article[]);
	const [totalArticles, setTotalArticles] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);


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

	const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
		setPage(page);
	};

	return (
		<div>
			{localStorage.getItem(ACCESS_TOKEN) ? <PrivateHeader/> : <PublicHeader/>}
			<div className={classes.container}>
				<div className={classes.container_article}>
					<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '712px'}}>
						<Stack direction="row" flexWrap='wrap' justifyContent='center'>
							{articles?.length ? articles.map((article) => (
								<Card sx={{width: 300, m: 1}} data-testid='article-card' key={article.id}>
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
										<Link to={`${RESOURCE.ARTICLE}/${article.title}`}>
											<Button
												size="small"
												color='info'
												startIcon={<ReadMoreIcon fontSize='large'/>}
											>
												Read More...
											</Button>
										</Link>
									</CardActions>
								</Card>
							)) : <Box>
								<Typography
									variant='h3'
									component='label'
									data-testid='no-articles-label'
								>
									{loading ? 'Loading...' : 'There are no articles!'}
								</Typography>
							</Box>}
						</Stack>
					</Box>
					<Box sx={{m: '0 auto', p: 2}}>
						<Pagination
							color='primary'
							count={Math.ceil(totalArticles / 10)}
							size="large"
							shape='circular'
							showFirstButton={true}
							showLastButton={true}
							page={page}
							onChange={handleChangePage}
							sx={{width: '100%', justifyContent: 'center', display: 'flex'}}
						/>
					</Box>
				</div>
			</div>
		</div>
	);
};

export default Blog;
