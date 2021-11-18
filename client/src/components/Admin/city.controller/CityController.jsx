import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useHistory} from "react-router-dom"
import '../city.controller/city-update-form.css'

const CityController = () => {

    const history = useHistory()

    const [cityName, setCityName] = useState('')
    const [cityId, setCityId] = useState(0)

    const {propsCityId, propsCityName} = useParams()


    useEffect(() => {

        if(propsCityId) {

            setCityId(propsCityId)
            setCityName(propsCityName)
        }
    },[])


    const onSubmit = (event) => {
        event.preventDefault()
        if(!propsCityId) {

            axios.post(`/city`, 
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

            axios.put(`/city`, {
                
                data: {
                    id: cityId,
                    name: cityName
                }
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