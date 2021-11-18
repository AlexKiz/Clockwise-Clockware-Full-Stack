import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ReactStars from "react-rating-stars-component";
import classes from '../RateOrder/rate-order.module.css'

const RateOrder = () => {

    const history = useHistory()

    const { ratingIdentificator } = useParams()
    
    const [rating, setRating] = useState(0)

    const [order, setOrder] = useState([])


    useEffect(() => {
        
        const getOrderForRate = async () => {

            const {data} = await axios.get('/OrderForRate',{

                params: {

                    ratingIdentificator: ratingIdentificator
                    
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

        getOrderForRate()
    },[])


    const onSubmit = (event) => {
        event.preventDefault()

        axios.put('/RatedOrder', {
            id: order[0].orderId,
            order_rated: rating,
            master_id: order[0].masterId
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
                                <p>{order[0].masterName}</p>
                            </div>
                            <div className={classes.form_orderinfo}>
                                <b>Order #{order[0].orderId}</b>
                                <br />
                                <b> User name:</b> <span>{order[0].userName}</span>
                                <br />
                                <b> User email:</b> <span>{order[0].userEmail}</span>
                                <br />
                                <b> Clock size:</b>  <span>{order[0].clockSize}</span>
                                <br />
                                <b> City:</b>  <span>{order[0].cityName}</span>
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
                                onChange={(newRating) => setRating(newRating)}
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