import axios from 'axios'
import React, { useState, useEffect, FC } from 'react'
import { useHistory, useParams } from 'react-router-dom'
//@ts-ignore
import ReactStars from "react-rating-stars-component";
import classes from '../order.rate/rate-order.module.css'
import { Params, Order } from '../../../data/types/types'
import { RateOrderProps } from './componentConstants';
import { URL } from '../../../data/constants/routeConstants';


const RateOrder: FC<RateOrderProps> = () => {

    const history = useHistory()

    const { ratingIdentificatorParam } = useParams<Params>()
    
    const [rating, setRating] = useState<number>(0)

    const [order, setOrder] = useState<Order[]>([])


    useEffect(() => {
        
        const readOrderForRate = async () => {

            const { data } = await axios.get<Order[]>(`/${URL.ORDER_FOR_RATE}`, {

                params: {
                    ratingIdentificator: ratingIdentificatorParam
                }
            })
            
            if(data.length) {

                setOrder(data)

            } 
            
            if(!data.length) {

                alert('Current order has been already rated')
                history.push('/')
            }
            
        }

        readOrderForRate()
    },[])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        axios.put(`/${URL.RATED_ORDER}`, {
            id: order[0].id,
            order_rated: rating,
            master_id: order[0].master.id
        }).then(() => {

            alert('Thanks for your feedback')
            history.push('/')

        })
    }

    return (
        <div>
            <div className={classes.container}>
                <div className={classes.container_form}>
                    <form className={classes.form} onSubmit={onSubmit} name='orderForm'>

                        <div>
                        { order[0] &&
                            <>
                            <div className={classes.form_master}>
                                <label>Please, rate the following master:</label>
                                <p>{order[0].master.name}</p>
                            </div>
                            <div className={classes.form_orderinfo}>
                                <b>Order #{order[0].id}</b>
                                <br />
                                <b> User name:</b> <span>{order[0].user.name}</span>
                                <br />
                                <b> User email:</b> <span>{order[0].user.email}</span>
                                <br />
                                <b> Clock size:</b>  <span>{order[0].clock.size}</span>
                                <br />
                                <b> City:</b>  <span>{order[0].city.name}</span>
                                <br />
                                <b> Start work on:</b>  <span>{order[0].startWorkOn.split(',').join(' ')}</span>
                                <br />
                                <b> End work on:</b>  <span>{order[0].endWorkOn} </span>
                            </div>
                        </>
                        }

                            <div className={classes.form_stars}>
                                <ReactStars
                                count={5}
                                size={75}
                                activeColor="#f6ff00"
                                isHalf={true}
                                value={rating}
                                onChange={(newRating: number) => setRating(newRating)}
                                />
                            </div>

                            <div className={classes.form_button}>   
                                <button type="submit"> Rate order </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    )
}

export default RateOrder