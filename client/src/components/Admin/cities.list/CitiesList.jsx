import axios from "axios";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import '../cities.list/cities-list.css'

const CitiesList = () => {

    const [cities, setCities] = useState([])


    useEffect(()=> {

        const readAllCities = async () => {

            const {data} = await axios.get(`/city`)
            
            setCities(data)
        }

        readAllCities()

    },[])


    const onDelete = (id) => {
        
        if(window.confirm('Do you want to delete this city?')) {
            axios.delete(`/city`,
            {
                data: 
                {
                    id
                }
            }).then(() => {

                setCities(cities.filter((elem) => elem.id !== id))

                alert('City has been deleted') 
            })
        }
    }

    
    return (

        <div className='conteiner'>

            <div className='wrapper-table'>

                <table  className='content-table-cities'>
                    <tr>
                        <th className='th-city-id'>Id</th>
                        <th className='th-city-name'>City name</th>
                        <button className='button-add'><Link to = '/admin/city-controller'>Create new city</Link></button>
                    </tr>
                    {
                        cities.map((elem) => (
                            <tr>
                                <td>{`${elem.id}`}</td>
                                <td>{`${elem.name}`}</td>
                                <button className='button-update'><Link to = {`/admin/city-controller/${elem.id}/${elem.name}`}>Update</Link></button>
                                <button className='button-delete' onClick = {() => {onDelete(elem.id)}}>Delete</button>
                            </tr>
                        ))
                    }
                </table>

            </div>

        </div>
    )
}

export default CitiesList