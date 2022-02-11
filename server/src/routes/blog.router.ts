import {URL} from '../../data/constants/routeConstants';
import {Router} from 'express';
import {isAuth, checkRole} from '../controller/auth.controller';
import {
	postArticle,
	getArtices,
	getArticleForUpdate,
	putArticle,
	deleteArticle,
} from '../controller/blog.controller';
import {postArticleValidate, putArticleValidate, deleteArticleValidate} from '../controller/blog.validate';

const router = Router();

router.post(URL.BLOG, [isAuth, postArticleValidate, checkRole(['admin'])], postArticle);
router.get(URL.BLOG, getArtices);
router.get(URL.ARTICLE_FOR_UPDATE, [isAuth, putArticleValidate, checkRole(['admin'])], getArticleForUpdate);
router.put(URL.BLOG, [isAuth, putArticleValidate, checkRole(['admin'])], putArticle);
router.delete(URL.BLOG, [isAuth, deleteArticleValidate, checkRole(['admin'])], deleteArticle);


export default router;
