import Sidebar from '../../Components/Sidebar/MrSidebar'
import WaitingRoom from '../WaitingRoom/WaitingRoom'
import './Dashboard.css'

const Dashboard = () => {
    return (
        <div className='dashboard'>
            <Sidebar />
            <WaitingRoom />
        </div>
    )
}

export default Dashboard
