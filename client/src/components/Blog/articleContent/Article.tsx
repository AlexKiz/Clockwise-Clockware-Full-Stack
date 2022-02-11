import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {Link, useParams, useHistory} from 'react-router-dom';
import {RESOURCE, URL} from 'src/data/constants/routeConstants';
import {ArticleProps} from './componentConstant';
import classes from './article.module.css';
import {Button, Paper} from '@mui/material';
import PublicHeader from 'src/components/Headers/PublicHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const article = {
	content:
    `<p style="text-align: center;"><span style="font-size: 14pt;"><strong>Title&nbsp;</strong></span></p>
    <p><em>Wow! Today is friday it's mean that today we goona have, chill and work calmy.</em></p>
    <p>I would Like to introduce some of the most greatful things in programming sphere such as 
    <em><strong>frameworks and libraries</strong></em>!</p>
    <p style="text-align: center;"><strong><em><span style="font-size: 18pt;">React space posibilities</span></em></strong></p>
    <p><img style="display: block; margin-left: auto; margin-right: auto;" 
    src="https://cdn-images-1.medium.com/max/2000/1*qXcjSfRj0C0ir2yMsYiRyw.jpeg" alt="react" width="503" height="233" /></p>
    <p>React is most known libraries in a circle of web developers. Its a infinite space of new thigs and other useful stuff</p>`,
};

const Article: FC<ArticleProps> = () => {
	return (
		<div>
			<PublicHeader/>
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
					<div className={classes.article_conteiner} dangerouslySetInnerHTML={{__html: article.content}}/>
				</Paper>
			</div>
		</div>
	);
};

export default Article;
