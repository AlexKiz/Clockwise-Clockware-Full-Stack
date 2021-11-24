import React, {useState, useEffect, FC} from 'react'
import axios from 'axios'
import PublicHeader from '../Headers/PublicHeader'
import '../Order/order-form.css'
import { Master, City, Clock } from '../../types/types'

const currentDate = new Date() 
const currentDay = (currentDate.getDate() < 10) ? `0${currentDate.getDate()}` : currentDate.getDate()
const currentMonth = ((currentDate.getMonth() + 1) < 10) ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)
const currentYear = currentDate.getFullYear()
const today = `${currentYear}-${currentMonth}-${currentDay}`

const openingHours: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

interface OrderFormProps {}

const OrderForm: FC<OrderFormProps> = () => {

    const [userName, setUserName] = useState<string>('')

    const [userEmail, setUserEmail] = useState<string>('')

    const [orderDate, setOrderDate] = useState<string>('')

    const [orderTime, setOrderTime] = useState<string>('')

    const [masterId, setMasterId] = useState<number>(0) 
    const [masters, setMasters] = useState<Master[]>([])

    const [cityId, setCityId] = useState<number>(0)
    const [cities, setCities] = useState<City[]>([])

    const [clockId, setClockId] = useState<number>(0)
    const [clocks, setClocks] = useState<Clock[]>([])


    useEffect(() => {
        const cityName = async () => {

            const {data} = await axios.get<City[]>(`/cityForOrder`)

            if(data.length) {
                setCities(data)
                setCityId(data[0].cityId)
            }
        }

        cityName()
    },[])


    useEffect(() => {
        const masterName = async () => {

            if(cityId && orderDate && orderTime && clockId) {
                const {data} = await axios.get<Master[]>(`/availableMasters`, {
                    params: {
                    city_id: cityId,
                    start_work_on: `${orderDate} ${orderTime}`,
                    clock_id: clockId,
                    }
                })

                if(data.length === 0) {
                    alert('All masters has been booked at that time. Please choose another time or date')
                    setOrderTime('')
                    setMasterId(0)
                    setMasters([])
                }

                if(data.length) {
                    setMasterId(data[0].masterId)
                    setMasters(data)
                }
                
            }
            
        }
        masterName()
    },[cityId,clockId,orderDate,orderTime])
    


    useEffect(() => {
        const clockSize = async () => {

            const{data} = await axios.get<Clock[]>(`/clocks`)
            if(data.length){
                setClockId(data[0].clockId)
                setClocks(data)
            }
            
        }

        clockSize()
    },[])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        axios.post(`/order`, 
        {
            name: userName, 
            email: userEmail,
            clock_id: clockId,
            city_id: cityId,
            master_id: masterId,
            start_work_on: `${orderDate} ${orderTime}`
        })

        setUserName('')
        setUserEmail('')
        setOrderTime('')
        setOrderDate('')
        alert('Your order has been created! Please confirm it on your Emailbox. Have a good day!')

    }

    return (
            <div>
                <PublicHeader/>
            
            <div className='conteiner'>

                <div className='container-form'>
        
                        <form className='form' onSubmit={onSubmit} name='orderForm'>
        
                            <div>
        
                                <div className='form-section'>
                                    <div className='form-input__label'>   
                                        <label>Enter your name:</label>
                                    </div>
        
                                    <input 
                                    type='text' 
                                    placeholder='Ivan Ivanov'
                                    pattern='^([(A-Za-zА-Яа-я]{3,49})$|^([A-Za-zА-Яа-я]{3,49}[\s]{1}[A-Za-zА-Яа-я]{3,50})$'
                                    title='User name must be at least 3 letter and alphabetical characters only'
                                    value={userName}
                                    onChange={(userNameEvent) => setUserName(userNameEvent.target.value)}
                                    required
                                    ></input>
                                </div>
        
                                <div className='form-section'>
                                    <div className='form-input__label'>
                                        <label>Enter your email:</label>
                                    </div>
        
                                    <input 
                                    type='email' 
                                    placeholder='example@mail.com'
                                    pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
                                    title='Email must be according the example: myemail@mail.com'
                                    value={userEmail} 
                                    onChange={(userEmailEvent) => setUserEmail(userEmailEvent.target.value)}
                                    required
                                    ></input>
                                </div>
        
                                <div className='form-section'>
                                    <div className='form-input__label'>                   
                                        <label>Choose clocksize:</label>
                                    </div>
        
                                    <select name='clocksize' onChange={(clockIdEvent) => setClockId(+clockIdEvent.target.value)}>
                                        {
                                            clocks.map(({clockSize, clockId}) => (
                                                <option value={clockId}>
                                                    {`${clockSize}`}
                                                </option>
                                            ))    
                                        }
                                    </select>
                                </div>
                                    
                                <div className='form-section'>   
                                    <div className='form-input__label'>
                                        <label>Choose your city:</label>
                                    </div>
                                    
                                    <select name='cities' onChange={(cityIdEvent) => setCityId(+cityIdEvent.target.value)}>
                                        {
                                            cities.map(({cityName, cityId}) => (
                                                <option value={cityId}>
                                                    {`${cityName}`}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                    
                                <div className='form-section'>   
                                    <div className='form-input__label'>
                                        <label>Choose the date:</label>
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
                                        <label>Choose the time:</label>
                                    </div>
                                    
                                    <select name='orderTime' onChange={(orderTimeEvent) => setOrderTime(orderTimeEvent.target.value)}>
                                        {
                                            openingHours.map((elem) => (
                                                <option value={elem}>
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
                                            masters.map(({masterName, masterId, masterRating}) => (
                                                <option value={masterId}>
                                                    {`${masterName} | Rating:${masterRating}`}
                                                </option>
                                            ))
                                        }
                                        <option value="" disabled selected hidden>Choose the master</option>
                                    </select>
                                </div>
                                    
                                <div className='form-button'>   
                                    <button type="submit"> Create order </button>
                                </div>
                                    
                            </div>
                                    
                        </form>
                                    
                    </div>

                </div>
            
            </div>
    )
}


export default OrderForm 

