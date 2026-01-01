
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useNotification } from '../context/NotificationProvider';

const AdminNotificationsPage: React.FC = () => {
    const { notifications } = useNotification();

    return (
        <DashboardLayout portal="admin">
            <h1 className="text-3xl font-bold text-primary mb-8">Email Notification Log</h1>
            <p className="text-sm text-gray-500 mb-6">This is a log of simulated emails triggered by the backend and captured by the frontend.</p>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {notifications.map(notif => (
                                <tr key={notif.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(notif.sentAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notif.to}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notif.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Sent
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {notifications.length === 0 && <p className="text-center text-gray-500 py-8">No notifications have been sent yet.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminNotificationsPage;
