import axios from "axios";
import { useState, useEffect, FC } from "react";
import {Link} from 'react-router-dom'
import '../user.list/user-list.css'
import { User } from '../../../types/types'

interface UserListProps {}

const UserList: FC<UserListProps> = () => {

    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {

        const readAllUsers = async () => {

            const { data } = await axios.get<User[]>(`/user`)
            
            setUsers(data)
        }
        
        readAllUsers()

    },[])


    const onDelete = (id: number) => {

        if(window.confirm("Do you want to delete this user?")) {
            axios.delete(`/user`,
            {
                data: {
                    id
                }
            }).then(() => {

                setUsers(users.filter((elem) => elem.userId !== id))
                
                alert('User has been deleted')
            })
        }
    }


    return (

            <div className='conteiner'>

                <div className='wrapper-table'>
                    
                    <table className='content-table-users'>
                        <tr>
                            <th className='th-user-id'>Id</th>
                            <th className='th-user-name'>User name</th>
                            <th className='th-email'>Email</th>
                        </tr>
                        { 
                            users.map((elem) => (
                                <tr>
                                    <td>{`${elem.userId}`}</td>
                                    <td>{`${elem.userName}`}</td>
                                    <td>{`${elem.userEmail}`}</td>
                                    <button className='button-update'><Link to={`/admin/user-controller/${elem.userId}/${elem.userName}/${elem.userEmail}`}>Update</Link></button>
                                    <button className='button-delete' onClick ={() => onDelete(elem.userId)}>Delete</button>
                                    </tr>
                            ))
                        }
                    </table>
                </div>

            </div>
    )
}

export default UserList