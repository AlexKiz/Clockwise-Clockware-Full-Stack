import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './article-create.module.css';
import PrivateHeader from '../../../Headers/PrivateHeader';
import {ArticleCreateProps} from './componentConstants';
import {Params} from 'src/data/types/types';


const ArticleCreate: FC<ArticleCreateProps> = () => {
	const history = useHistory();

	const {articleTitle} = useParams<Params>();


	/* useEffect(() => {
		const getArticles = async () => {
			axios.get('articleGet', {
				params: {
					title: articleTitle,
				},
			}).then((response) => {});
		};

		getArticles();
	}, []);*/

	return (
		<div>
			<PrivateHeader/>
			<div className={classes.conteiner}>
                
			</div>
		</div>

	);
};

export default ArticleCreate;
