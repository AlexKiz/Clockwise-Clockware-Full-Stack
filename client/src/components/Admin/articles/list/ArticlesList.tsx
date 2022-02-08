import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {AlertNotification, Article} from 'src/data/types/types';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import AlertMessage from 'src/components/Notification/AlertMessage';


const ArticlesList: FC<ArticlesProps> = () => {
	const arctic = [{
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
		title: 'sdfasdfasdfafasdf sadfasdfafasdfasd88990',
		pictures: 'https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg',
		background: '',
		description: `sdfasdfasdfafasdf fasdfasdf123434 1234567899 12345678`,
		body: 'Some articles content with some strange text inside 5. And then other text...',
	}];

	const [articles, setArticles] = useState<Article[]>(arctic);

	const [alertOptions, setAlertOptions] = useState<AlertNotification>({
		notify: false,
		type: 'success',
		message: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	/* useEffect(() => {
		const readArticles = async () => {
			axios.get('urlForArticles').then((response) => {
                setArticles();
			});
		};

		readArticles();
	}, []);*/

	const handleDeleteArticle = (id: string) => {
		if (window.confirm('Do you want to delete this article?')) {
		/* axios.delete('someUrl', {
			data: {id},
		}).then(() => {*/
			setArticles(articles.filter((article) => article.id !== id));
			setAlertOptions({
				type: 'success',
				message: 'Article has been deleted!',
				notify: true,
			});
		/* });*/
		}
	};

	const isOpen = (value: boolean) => {
		setAlertOptions({...alertOptions, notify: value});
	};

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
				<Stack direction="row" flexWrap='wrap' justifyContent='center'>
					{
						articles.map((article) => (
							<Card sx={{maxWidth: 400, mb: 2, mr: 2}} key={article.id}>
								<CardMedia
									component="img"
									height={200}
									image={article.pictures}
									alt="pic"
								/>
								<CardContent
									sx={{height: 160}}
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
										startIcon={<EditIcon fontSize='medium'/>}
									>
                                        Edit
									</Button>
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
						))
					}
				</Stack>
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
