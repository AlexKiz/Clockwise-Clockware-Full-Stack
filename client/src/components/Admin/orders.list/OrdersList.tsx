import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { Link } from 'react-router-dom'
import '../orders.list/orders-list.css'
import { Order } from '../../../data/types/types'
import { OrderListProps } from "./componentConstants";
import { RESOURCE, URL } from "../../../data/constants/routeConstants";


const OrdersList: FC<OrderListProps> = () => {

    const [orders, setOrders] = useState<Order[]>([])


    useEffect(() => {

        const readOrdersData = async() => {
        
            const { data } = await axios.get<Order[]>(`/${URL.ORDER}`)
            
            setOrders(data)
        } 

        readOrdersData()
        
    },[])


    const onDelete = (id: number) => {

        if(window.confirm("Do you want to delete this order?")) {
            axios.delete(`/${URL.ORDER}`, 
            {
                data: {
                    id
                }
            }).then(() => {

                setOrders(orders.filter((order) => order.id !== id))
                
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
                    orders.map((order) => (
                        <tr>
                            <td>{`${order.id}`}</td>
                            <td>{`${order.clock.size}`}</td>
                            <td>{`${order.user.name}`}</td>
                            <td>{`${order.user.email}`}</td>
                            <td>{`${order.city.name}`}</td>
                            <td>{`${order.master.name}`}</td>
                            <td>{`${order.startWorkOn.split('T').join(' ')}`}</td>
                            <td>{`${order.endWorkOn.split('T').join(' ')}`}</td>
                            <button className='button-update'><Link to={`/${RESOURCE.ADMIN}/${RESOURCE.ORDER_CONTROLLER}/${order.id}/${order.user.id}/${order.clock.id}/${order.city.id}/${order.startWorkOn.split('T')[0]}/${order.startWorkOn.split('T')[1]}/${order.master.id}`}>Update</Link></button>
                            <button className='button-delete' onClick={() => onDelete(order.id)}>Delete</button>
                        </tr>
                    ))
                    }
                </table>

            </div>

        </div>
    )
}

export default OrdersList