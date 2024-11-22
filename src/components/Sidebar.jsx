import { useEffect, useState } from "react";
import { fetchSideBarData } from "../api/utils/dbActions";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const [sideBarData, setSideBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const captureData = async () => {
            try {
                const data = await fetchSideBarData()
                setSideBarData(data)
            } catch (error) {
                console.log()
            }
            finally {
                setLoading(false)
            }
        }
        captureData()
    }, [])

    if (loading) {
        return (
            <div className="w-64 bg-white shadow-lg p-4">
                <p>Loading...</p>
            </div>
        );
    }

    const loadGroupChat = (groupId) => {
        console.log(groupId)
        navigate(`/chat/${groupId}`);
    }

    return (
        <aside className="w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Your Groups</h2>
            </div>
            <ul className="p-4 space-y-2">
                {sideBarData.map((data, index) => (
                    <li key={index}>
                        <div className="block px-4 py-2 text-gray-600 rounded hover:bg-blue-100" onClick={ () =>loadGroupChat(data.groupId)}>
                            {data.groupName}
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
