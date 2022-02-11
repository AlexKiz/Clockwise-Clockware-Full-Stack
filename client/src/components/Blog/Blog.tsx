import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import classes from './blog.module.css';
import {BlogProps} from './componentConstants';
import {URL} from '../../data/constants/routeConstants';
import PublicHeader from '../Headers/PublicHeader';
import {Box, Button, Card, CardActions, CardContent, CardMedia, Pagination, Stack, Typography} from '@mui/material';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import {Article} from 'src/data/types/types';

const articless = [{
	id: '1',
	title: 'Article 1',
	pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 1. And then other text...',
}, {
	id: '2',
	title: 'Article 2',
	pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 2. And then other text...',
}, {
	id: '3',
	title: 'sdfasdfasdfafasdf sadfasdfafasdfasd88990',
	pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 3. And then other text...',
}, {
	id: '4',
	title: 'Article 4',
	pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 4. And then other text...',
}, {
	id: '5',
	title: 'Article 5',
	pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 4. And then other text...',
}, {
	id: '6',
	title: 'sdfasdfasdfafasdf sadfasdfafasdfasd88990',
	pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
	background: '',
	description: `sdfasdfasdfafasdf fasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 5. And then other text...',
}, {
	id: '7',
	title: 'Article 4',
	pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 4. And then other text...',
}, {
	id: '8',
	title: 'sdfasdfasdfafasdf sadfasdfafasdfasd88990',
	pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
	background: '',
	description: `sdfasdfasdfafasdf fasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 5. And then other text...',
}, {
	id: '9',
	title: 'Article 9',
	pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
	background: '',
	description: `sdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf
	sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdfsdfasdfasdfafasdf sadfasdfafasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 4. And then other text...',
}, {
	id: '10',
	title: 'sdfasdfasdfafasdf sadfasdfafasdfasd88990',
	pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
	background: '',
	description: `sdfasdfasdfafasdf fasdfasdf123434 1234567899 12345678`,
	body: 'Some articles content with some strange text inside 5. And then other text...',
}];

const Blog: FC<BlogProps> = () => {
	const [articles, setArticles] = useState<Article[]>([] as Article[]);

	useEffect(() => {
		const getArticles = async () => {
			axios.get(URL.BLOG).then((response) => {
				setArticles(response.data);
			});
		};

		// getArticles();
	}, []);

	return (
		<div>
			<PublicHeader/>
			<div className={classes.conteiner}>
				<div className={classes.container_form}>
					<Stack direction="row" flexWrap='wrap' justifyContent='center' position='relative'>
						{articless?.length ? articless.map((article) => (
							<Card sx={{maxWidth: 300, m: 1}} key={article.id}>
								<CardMedia
									component="img"
									height={220}
									image={article.pictures}
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
								<CardActions>
									<Button
										size="small"
										color='info'
										startIcon={<ReadMoreIcon fontSize='large'/>}
									>
                                        Read More...
									</Button>
								</CardActions>
							</Card>
						)) : <Box sx={{
							height: '1652px',
							display: 'flex',
							justifyContent: 'center',
							alignItem: 'center'}}
						>
							<Typography
								variant='h3'
								component='label'
							>
								There are no articles left!
							</Typography>
						</Box>}
					</Stack>
					<Box sx={{
						m: '0 auto',
						p: 2,
						widht: '100%',
					}}
					>
						<Pagination
							color='primary'
							count={5}
							size="large"
						/>
					</Box>
				</div>
			</div>
		</div>
	);
};

export default Blog;
