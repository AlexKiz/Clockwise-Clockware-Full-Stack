import express from 'express';
import {Request, Response} from 'express';
import cityRouter from './routes/city.router';
import masterRouter from './routes/master.router';
import orderRouter from './routes/order.router';
import userRouter from './routes/user.router';
import login from './routes/auth.router';
import adminRouter from './routes/admin.router';
import cors from 'cors';
import path from 'path';
import {URL} from '../data/constants/routeConstants';
import db from './models';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({exposedHeaders: 'Authorization'}));
app.use(express.static(`../client/build`));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: true}));


app.use(URL.API, cityRouter);
app.use(URL.API, masterRouter);
app.use(URL.API, orderRouter);
app.use(URL.API, userRouter);
app.use(URL.API, adminRouter);
app.use(URL.API, login);


app.get('/*', function(req: Request, res: Response) {
	res.sendFile(path.resolve('../', 'client', 'build', 'index.html'));
});

const start = async () => {
	try {
		await db.sequelize.authenticate();
		await db.sequelize.sync();
		app.listen(PORT, () => {
			console.log(`Server has been started on port ${PORT} `);
		});
	} catch (e) {
		console.log(e);
	}
};

start();
