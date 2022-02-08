import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Article} from 'src/data/types/types';
import classes from './articles-list.module.css';
import {ArticlesProps} from './componentConstants';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Stack,
	Typography,
} from '@mui/material';
import PrivateHeader from 'src/components/Headers/PrivateHeader';


const ArticlesList: FC<ArticlesProps> = () => {
	const arctic = [{
		id: '1',
		title: 'Article 1',
		pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
		background: '',
		description: 'Some article description number 1',
		body: 'Some articles content with some strange text inside 1. And then other text...',
	}, {
		id: '2',
		title: 'Article 2',
		pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
		background: '',
		description: 'Some article description number 2',
		body: 'Some articles content with some strange text inside 2. And then other text...',
	}, {
		id: '3',
		title: 'Article 3',
		pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
		background: '',
		description: 'Some article description number 3',
		body: 'Some articles content with some strange text inside 3. And then other text...',
	}, {
		id: '4',
		title: 'Article 4',
		pictures: 'https://mui.com/static/images/cards/contemplative-reptile.jpg',
		background: '',
		description: 'Some article description number 4 Some article description number 5 Some article description number 5',
		body: 'Some articles content with some strange text inside 4. And then other text...',
	}, {
		id: '5',
		title: 'Article 5',
		pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
		background: '',
		description: 'Some article description number 5 Some article description number 5',
		body: 'Some articles content with some strange text inside 5. And then other text...',
	}];

	const [articles, setArticles] = useState<Article[]>(arctic);

	/* useEffect(() => {
		const readArticles = async () => {
			axios.get('urlForArticles').then((response) => {
                setArticles();
			});
		};

		readArticles();
	}, []);*/

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<Stack direction="row" flexWrap='wrap' justifyContent='center'>
					{
						articles.map((article) => (
							<Card sx={{maxWidth: 345, mb: 2, mr: 2}} key={article.id}>
								<CardMedia
									component="img"
									height="160"
									image={article.pictures}
									alt="pic"
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{article.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{article.description}
									</Typography>
								</CardContent>
								<CardActions>
									<Button size="small">Edit</Button>
									<Button size="small">Delete</Button>
								</CardActions>
							</Card>
						))
					}
				</Stack>
			</div>
		</div>
	);
};

export default ArticlesList;
