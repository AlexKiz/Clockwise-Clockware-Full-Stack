import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../order.controller/order-update-form.css'
import { Params, User, Clock, City, Master } from '../../../data/types/types'
import { today, openingHours } from '../../../data/constants/systemConstants'
import { OrderControllerProps } from "./componentConstants"; 
import { RESOURCE, URL } from "../../../data/constants/routeConstants";


const OrderController: FC<OrderControllerProps> = () => {

    const history = useHistory()

    const { orderIdParam, userIdParam, clockIdParam, cityIdParam, orderDateParam, orderTimeParam, masterIdParam } = useParams<Params>()

    const [userId, setUserId] = useState<number>(0)
    const [users, setUsers] = useState<User[]>([])

    const [clockId, setClockId] = useState<number>(0)
    const [clocks, setClocks] = useState<Clock[]>([])

    const [cityId, setCityId] = useState<number>(0)
    const [cities, setCities] = useState<City[]>([])

    const [orderDate, setOrderDate] = useState<string>(orderDateParam)
    const [orderTime, setOrderTime] = useState<string>(orderTimeParam)

    const [masterId, setMasterId] = useState<number>(0)
    const [masters, setMasters] = useState<Master[]>([])

    const [startWorkOn, setStartWorkOn] = useState('')
    const [endWorkOn, setEndWorkOn] = useState('')


    useEffect(() => {
        
        const readUsersData = async () => {

            const { data } = await axios.get<User[]>(`/${URL.USER}`)

            setUsers(data)
            setUserId(Number(userIdParam))
        }

        readUsersData()
    },[])


    useEffect(() => {

        const readClocksData = async () => {

            const { data } = await axios.get<Clock[]>(`/${URL.CLOCK}`)

            setClocks(data)
            setClockId(Number(clockIdParam))
        }

        readClocksData()
    }, [])


    useEffect(() => {

        const readCitiesData = async () => {

            const { data } = await axios.get<City[]>(`/${URL.CITY}`)

            setCities(data)
            setCityId(Number(cityIdParam))
        }

        readCitiesData()
    },[])


    useEffect(() => {

        if(clockId && orderDate && orderTime) {
            const { installationTime } = clocks.filter(clock => clock.id === clockId)[0]
            let endDate = new Date(`${orderDate} ${orderTime}`)
            let startDate = new Date(`${orderDate} ${orderTime}`)
            startDate.setUTCHours(startDate.getHours())
            endDate.setUTCHours(endDate.getHours() + installationTime)
    
            setStartWorkOn(startDate.toISOString())
            setEndWorkOn(endDate.toISOString())
        }

    },[clockId, orderDate, orderTime])


    useEffect(() => { 

        const readAvailableMastersData = async () => {

            const { data } = await axios.get<Master[]>(`/${URL.AVAILABLE_MASTER}`, {
                params: {
                    currentOrderId: orderIdParam,
                    cityId: cityIdParam,
                    startWorkOn: startWorkOn ,
                    endWorkOn: endWorkOn
                }
            })

            if(data.length === 0) {
                alert('All masters has been booked at that time. Please choose another time or date')
                setOrderTime('')
            }

            if(data.length) {
                setMasterId(Number(masterIdParam))
                setMasters(data)
            }

        }
        readAvailableMastersData()

    }, [cityId, clockId, orderDate, orderTime])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        axios.put(`/${URL.ORDER}`, 
        {
            id: orderIdParam,
            clockId,
            userId,
            cityId,
            masterId,
            startWorkOn,
            endWorkOn
        }).then(() => {
            alert('Order has been updated')
            history.push(`/${RESOURCE.ADMIN}/${RESOURCE.ORDERS_LIST}`)
        })

    }


    return(
        <div className='container-form'>

            <form className='form' onSubmit={onSubmit}>

                <div>

                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>
                                Choose user:
                            </label>
                        </div>

                        <select name='users' onChange={(userIdEvent) => setUserId(Number(userIdEvent.target.value))}>
                        {
                            users.map((user) => (
                                <option selected = {user.id === Number(userIdParam)} value={user.id}>
                                    {` user: ${user.name} | email: ${user.email}`}
                                </option>
                            ))
                        }
                        </select>
                    </div>


                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>
                                Choose clock size:
                            </label>
                        </div>

                        <select name='clocks' onChange={(clockIdEvent) => setClockId(Number(clockIdEvent.target.value))}>
                            {
                                clocks.map((clock) => (
                                    <option selected = {clock.id === Number(clockIdParam)} value={clock.id}>
                                        {`${clock.size}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>


                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>
                                Choose city:
                            </label>
                        </div>

                        <select name='cities' onChange={(cityIdEvent) => setCityId(Number(cityIdEvent.target.value))}>
                            {
                                cities.map((city) => (
                                    <option selected = {city.id === Number(cityIdParam)} value={city.id}>
                                        {`${city.name}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>


                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>
                                Choose date:
                            </label>
                        </div>
                        <input 
                        type='date' 
                        name='orderDate'
                        min= {today}
                        value={orderDate}
                        onChange={(orderDateEvent) => setOrderDate(orderDateEvent.target.value)}
                        ></input>
                    </div>


                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>
                                Choose order time:
                            </label>
                        </div>

                        <select name='orderTime' onChange={(orderTimeEvent) => setOrderTime(orderTimeEvent.target.value)}>
                            {
                                openingHours.map((elem) => (
                                    <option selected = {elem === orderTime} value={elem}>
                                        {`${elem}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>


                    <div className='form-section'>   
                        <div className='form-input__label'>
                            <label>Available masters:</label>
                        </div>

                        <select name='masterName' onChange={(masterIdEvent) => setMasterId(Number(masterIdEvent.target.value))}>
                            {
                                masters.map((master) => (
                                    <option selected = {master.id === Number(masterIdParam)} value={master.id}>
                                        {`${master.name}`}
                                    </option>
                                ))
                            }
                        </select>
                    </div>


                    <div className='form-button'>   
                        <button type="submit"> Confirm </button>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default OrderController