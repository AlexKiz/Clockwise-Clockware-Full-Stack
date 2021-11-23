import axios from "axios";
import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../city.controller/city-update-form.css'
import { City, Params } from '../../../types/types'

interface CityControllerProps {}

const CityController: FC<CityControllerProps> = () => {

    const history = useHistory()

    const [cityName, setCityName] = useState<string>('')
    const [cityId, setCityId] = useState<number>(0)

    const {propsCityId, propsCityName} = useParams<Params>()


    useEffect(() => {

        if(propsCityId) {

            setCityId(+propsCityId)
            setCityName(propsCityName)
        }
    },[])


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(!propsCityId) {

            axios.post<City>(`/city`, 
            {
                id: cityId,
                name: cityName
            }).then(() => {

                alert('City has been created')
                history.push('/admin/cities-list')

            }).catch((error) => {

                if(+error.response.status === 400) {
                    alert(error.response.data[0])
                    setCityName('')
                }
                
            })


        } else {

            axios.put<City>(`/city`, {
                id: cityId,
                name: cityName
            }).then(() => {

                alert('City has been updated')
                history.push('/admin/cities-list')

            }).catch((error) => {

                alert(error.response.data)
                setCityName(propsCityName)

            })
        }
    }

    
    return (

        <div className='container-form'> 

            <form className='form' onSubmit = {onSubmit}>

                <div>

                    <div className='form-section'>
                        <div className='form-input__label'>
                            <label>Enter city name:</label>
                        </div>
                        <input
                        type = "text"
                        placeholder = "Name"
                        pattern='^[A-Za-zА-Яа-я]{3,100}$|^[A-Za-zА-Яа-я]{3,49}[-\s]{1}[A-Za-zА-Яа-я]{3,50}$'
                        title='City name must be at least 3 letter and alphabetical only'
                        value = {cityName}
                        onChange = {(cityNameEvent) =>setCityName(cityNameEvent.target.value)}
                        ></input>
                    </div>

                    <div className='form-button'>
                        <button type = 'submit'>Submit</button>
                    </div>

                </div>
                
            </form>
        </div>
    )
}

export default CityController