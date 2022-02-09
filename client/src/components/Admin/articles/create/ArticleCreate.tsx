import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './article-create.module.css';
import PrivateHeader from '../../../Headers/PrivateHeader';
import {ArticleCreateProps} from './componentConstants';
import {Params} from '../../../../data/types/types';
import {Editor} from '@tinymce/tinymce-react';
import {TextField, Typography} from '@mui/material';


const ArticleCreate: FC<ArticleCreateProps> = () => {
	const history = useHistory();

	// const {articleTitle} = useParams<Params>();
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');


	const handleEditorChange = (e) => {
		console.log(
			'Content was updated:',
			e.target.getContent(),
		);
	};
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
				<Typography
					variant="h6"
					gutterBottom
					component="label"
				>
					Enter article Title
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
					required
				/>
				<Typography
					variant="h6"
					gutterBottom
					component="label"
				>
					Enter article short description
				</Typography>
				<TextField
					id="description"
					name="description"
					placeholder="Type your article description here"
					variant="filled"
					size="small"
					margin="dense"
					fullWidth
					value={description}
					onChange={(e) => {
						setDescription(e.target.value);
					}}
					required
				/>
				<Editor
					initialValue={``}
					apiKey={process.env.TINY_MCE_API_KEY}
					init={{
						height: 500,
						menubar: true,
						images_file_types: 'jpeg,jpg,png',
						plugins: [
							'advlist autolink lists link image',
							'charmap print preview anchor help',
							'searchreplace visualblocks code',
							'insertdatetime media table paste wordcount',
							'image', 'preview',
						],
						toolbar:
							`undo redo | formatselect | bold italic | \
							fontselect | \
							alignleft aligncenter alignright | \
							bullist numlist outdent indent | help`,
					}}
					onChange={handleEditorChange}
				/>
			</div>
		</div>

	);
};

export default ArticleCreate;
