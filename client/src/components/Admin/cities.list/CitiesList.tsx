import axios from "axios";
import { useState, useEffect, FC } from "react";
import {Link} from 'react-router-dom'
import '../cities.list/cities-list.css'
import { City } from '../../../types/types'

interface CitiesListProps {}

const CitiesList: FC<CitiesListProps> = () => {

    const [cities, setCities] = useState<City[]>([])


    useEffect(()=> {

        const readAllCities = async () => {

            const {data} = await axios.get<City[]>(`/city`)
            
            setCities(data)
        }

        readAllCities()

    },[])


    const onDelete = (id: number) => {
        
        if(window.confirm('Do you want to delete this city?')) {
            axios.delete<City>(`/city`,
            {
                data: 
                {
                    id
                }
            }).then(() => {

                setCities(cities.filter((elem) => elem.cityId !== id))

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
                                <td>{`${elem.cityId}`}</td>
                                <td>{`${elem.cityName}`}</td>
                                <button className='button-update'><Link to = {`/admin/city-controller/${elem.cityId}/${elem.cityName}`}>Update</Link></button>
                                <button className='button-delete' onClick = {() => {onDelete(elem.cityId)}}>Delete</button>
                            </tr>
                        ))
                    }
                </table>

            </div>

        </div>
    )
}

export default CitiesList