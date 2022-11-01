import Avatar from '@mui/material/Avatar';
import profilepic from '../../assest/img/profilepic.png'
import './WaitingRoom.css'

const WaitingRoom = () => {
    return (
        <div className="waitingroom">
            <Avatar src={profilepic} variant="rounded" sx={{ width: 56, height: 56 }}/>
        </div>
    )
}

export default WaitingRoom
