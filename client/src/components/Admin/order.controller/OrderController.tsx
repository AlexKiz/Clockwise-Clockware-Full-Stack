import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../order.controller/order-update-form.css'
import { Params, User, Clock, City, Master } from '../../../types/types'

const currentDate = new Date() 
const currentDay = (currentDate.getDate() < 10) ? `0${currentDate.getDate()}` : currentDate.getDate()
const currentMonth = ((currentDate.getMonth() + 1) < 10) ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)
const currentYear = currentDate.getFullYear()
const today = `${currentYear}-${currentMonth}-${currentDay}`

const openingHours: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

interface OrderControllerProps {}

const OrderController: FC<OrderControllerProps> = () => {

    const history = useHistory()

    const { propsOrderId, propsUserId, propsClockId, propsCityId, propsOrderDate, propsOrderTime, propsMasterId } = useParams<Params>()

    const [userId, setUserId] = useState<number>(0)
    const [users, setUsers] = useState<User[]>([])

    const [clockId, setClockId] = useState<number>(0)
    const [clocks, setClocks] = useState<Clock[]>([])

    const [cityId, setCityId] = useState<number>(0)
    const [cities, setCities] = useState<City[]>([])

    const [orderDate, setOrderDate] = useState<string>(propsOrderDate)
    const [orderTime, setOrderTime] = useState<string>(propsOrderTime)

    const [masterId, setMasterId] = useState<number>(0)
    const [masters, setMasters] = useState<Master[]>([])


    useEffect(() => {
        
        const readAllUsers = async () => {

            const {data} = await axios.get<User[]>(`/user`)

            setUsers(data)
            setUserId(+propsUserId)
        }

        readAllUsers()
    },[])


    useEffect(() => {

        const readAllClocks = async () => {

            const {data} = await axios.get<Clock[]>(`/clocks`)

            setClocks(data)
            setClockId(+propsClockId)
            
        }

        readAllClocks()
    }, [])


    useEffect(() => {

        const readAllCities= async () => {

            const {data} = await axios.get<City[]>(`/city`)

            setCities(data)
            setCityId(+propsCityId)

        }

        readAllCities()
    },[])


    useEffect(() => { 
        
        const masterName = async () => {

            const {data} = await axios.get<Master[]>(`/availableMastersForUpdate`, {
                params: {
                    currentOrderId: propsOrderId,
                    city_id: propsCityId,
                    start_work_on: `${orderDate} ${orderTime}`,
                    clock_id: propsClockId,
                }
            })

            if(data.length === 0) {
                alert('All masters has been booked at that time. Please choose another time or date')
                setOrderTime('')
            }

            if(data.length) {
                setMasterId(+propsMasterId)
                setMasters(data)
            }

        }
        masterName()

    }, [cityId, clockId, orderDate, orderTime])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        axios.put(`/order`, 
        {
            id: propsOrderId,
            clock_id: clockId,
            user_id: userId,
            city_id: cityId,
            master_id: masterId,
            start_work_on: `${orderDate} ${orderTime}`
        }).then(() => {
            alert('Order has been updated')
            history.push('/admin/orders-list')
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

                        <select name='users' onChange={(userIdEvent) => setUserId(+userIdEvent.target.value)}>
                        {
                            users.map(({userName, userId, userEmail}) => (
                                <option selected = {userId === +propsUserId} value={userId}>
                                    {` user: ${userName} | email: ${userEmail}`}
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

                        <select name='clocks' onChange={(clockIdEvent) => setClockId(+clockIdEvent.target.value)}>
                            {
                                clocks.map(({clockId,clockSize}) => (
                                    <option selected = {clockId === +propsClockId} value={clockId}>
                                        {`${clockSize}`}
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

                        <select name='cities' onChange={(cityIdEvent) => setCityId(+cityIdEvent.target.value)}>
                            {
                                cities.map(({cityId, cityName}) => (
                                    <option selected = {cityId === +propsCityId} value={cityId}>
                                        {`${cityName}`}
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

                        <select name='masterName' onChange={(masterIdEvent) => setMasterId(+masterIdEvent.target.value)}>
                            {
                                masters.map(({masterName, masterId}) => (
                                    <option selected = {masterId === +propsMasterId} value={masterId}>
                                        {`${masterName}`}
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