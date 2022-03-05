import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link, useParams} from 'react-router-dom';
import {RESOURCE, URL} from 'src/data/constants/routeConstants';
import {ArticleProps} from './componentConstant';
import classes from './article.module.css';
import {Button, Paper} from '@mui/material';
import PublicHeader from 'src/components/Headers/PublicHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {ArticleForRead, Params} from 'src/data/types/types';
import PrivateHeader from 'src/components/Headers/PrivateHeader';
import {ACCESS_TOKEN} from 'src/data/constants/systemConstants';


const Article: FC<ArticleProps> = () => {
	const {articleTitle} = useParams<Params>();
	const [article, setArticle] = useState<ArticleForRead>({} as ArticleForRead);

	useEffect(() => {
		axios.get(URL.ARTICLE, {
			params: {
				articleTitle,
			},
		}).then((response) => {
			setArticle(response.data);
		});
	}, []);

	return (
		<div>
			{localStorage.getItem(ACCESS_TOKEN) ? <PrivateHeader/> : <PublicHeader/>}
			<div className={classes.conteiner}>
				<Paper sx={{p: 2, width: '80%', m: '0 auto'}}>
					<Link to={`/${RESOURCE.BLOG}`}>
						<Button
							variant='outlined'
							startIcon={
								<ArrowBackIcon color='action' fontSize='large'/>
							}>
						</Button>
					</Link>
					<div className={classes.article_conteiner} dangerouslySetInnerHTML={{__html: article.body}}/>
				</Paper>
			</div>
		</div>
	);
};

export default Article;
