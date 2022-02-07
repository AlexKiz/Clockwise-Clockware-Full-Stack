import axios from 'axios';
import React, {useState, useEffect, FC} from 'react';
import classes from './blog.module.css';
import {BlogProps} from './componentConstants';
import PublicHeader from '../Headers/PublicHeader';

const Blog: FC<BlogProps> = () => {
	return (
		<div>
			<PublicHeader/>
			<div className={classes.conteiner}>
			</div>
		</div>
	);
};

export default Blog;
