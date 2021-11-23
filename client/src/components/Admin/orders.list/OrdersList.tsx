import axios from "axios";
import { useState, useEffect, FC } from "react";
import {Link} from 'react-router-dom'
import '../orders.list/orders-list.css'
import { Order } from '../../../types/types'

interface OrderListProps {}

const OrdersList: FC<OrderListProps> = () => {

    const [orders, setOrders] = useState<Order[]>([])


    useEffect(() => {

        const readAllOrders = async() => {
        
            const {data} = await axios.get<Order[]>(`/order`)
            
        setOrders(data)
        } 

        readAllOrders()
        
    },[])


    const onDelete = (id: number) => {

        if(window.confirm("Do you want to delete this order?")) {
            axios.delete(`/order`, 
            {
                data: {
                    id
                }
            }).then(() => {

                setOrders(orders.filter((elem) => elem.orderId !== id))
                
                alert('Order has been deleted')
            })
        }
    }


    return(
        <div className='conteiner'>

            <div className='wrapper-table'>

                <table  className='content-table-orders'>
                    <tr>
                        <th className='th-order-id'>Id</th>
                        <th className='th-clock-size'>Clock size</th>
                        <th className='th-order-user'>User name</th>
                        <th className='th-order-email'>User email</th>
                        <th className='th-order-city'>City</th>
                        <th className='th-order-master'>Master name</th>
                        <th className='th-order-start'>Start on</th>
                        <th className='th-order-end'>Finish on</th>
                    </tr>
                    {
                    orders.map((elem) => (
                        <tr>
                            <td>{`${elem.orderId}`}</td>
                            <td>{`${elem.clockSize}`}</td>
                            <td>{`${elem.userName}`}</td>
                            <td>{`${elem.userEmail}`}</td>
                            <td>{`${elem.cityName}`}</td>
                            <td>{`${elem.masterName}`}</td>
                            <td>{`${elem.startWorkOn.split(',').join(' ')}`}</td>
                            <td>{`${elem.endWorkOn}`}</td>
                            <button className='button-update'><Link to={`/admin/order-controller/${elem.orderId}/${elem.userId}/${elem.clockId}/${elem.cityId}/${elem.startWorkOn.split(',')[0]}/${elem.startWorkOn.split(',')[1]}/${elem.masterId}`}>Update</Link></button>
                            <button className='button-delete' onClick={() => onDelete(elem.orderId)}>Delete</button>
                        </tr>
                    ))
                    }
                </table>

            </div>

        </div>
    )
}

export default OrdersList