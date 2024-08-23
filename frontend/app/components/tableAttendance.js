"use client"

import React, { useState, useEffect } from 'react';
import apprenticeService from "../services/ApprenticeService";

const ApprenticeList = () => {
    const [apprentices, setApprentices] = useState([]);
    const [selectedApprentice, setSelectedApprentice] = useState(null);
    const [newApprentice, setNewApprentice] = useState({ fullName: '', documentNumber: '', documentType: '', status: '' });

    useEffect(() => {
        loadApprentices();
    }, []);

    const loadApprentices = () => {
        apprenticeService.getApprentices()
            .then(response => setApprentices(response.data))
            .catch(error => console.error('Error fetching apprentices:', error));
    };

    const handleSelectApprentice = (apprentice) => {
        setSelectedApprentice(apprentice);  
    };

    const handleCreateApprentice = () => {
        apprenticeService.createApprentice(newApprentice)
            .then(() => {
                loadApprentices();
                setNewApprentice({ fullName: '', documentNumber: '', documentType: '', status: '' });
            })
            .catch(error => console.error('Error creating apprentice:', error));
    };

    const handleUpdateApprentice = (id) => {
        apprenticeService.updateApprentice(id, selectedApprentice)
            .then(() => {
                loadApprentices();
                setSelectedApprentice(null);
            })
            .catch(error => console.error('Error updating apprentice:', error));
    };

    const handleDeleteApprentice = (id) => {
        apprenticeService.deleteApprentice(id)
            .then(() => loadApprentices())
            .catch(error => console.error('Error deleting apprentice:', error));
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Apprentices</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={newApprentice.fullName}
                    onChange={e => setNewApprentice({ ...newApprentice, fullName: e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Document Number"
                    value={newApprentice.documentNumber}
                    onChange={e => setNewApprentice({ ...newApprentice, documentNumber: e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Document Type"
                    value={newApprentice.documentType}
                    onChange={e => setNewApprentice({ ...newApprentice, documentType: e.target.value })}
                    className="border p-2 mb-2"
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newApprentice.status}
                    onChange={e => setNewApprentice({ ...newApprentice, status: e.target.value })}
                    className="border p-2 mb-2"
                />
                <button onClick={handleCreateApprentice} className="bg-blue-500 text-white p-2 rounded">Add Apprentice</button>
            </div>

            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Full Name</th>
                        <th className="px-4 py-2">Document Number</th>
                        <th className="px-4 py-2">Document Type</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apprentices.map(apprentice => (
                        <tr key={apprentice.id}>
                            <td className="border px-4 py-2">{apprentice.fullName}</td>
                            <td className="border px-4 py-2">{apprentice.documentNumber}</td>
                            <td className="border px-4 py-2">{apprentice.documentType}</td>
                            <td className="border px-4 py-2">{apprentice.status}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleSelectApprentice(apprentice)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
                                <button onClick={() => handleDeleteApprentice(apprentice.id)} className="bg-red-500 text-white p-2 rounded ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedApprentice && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-2">Edit Apprentice</h2>
                    <input
                        type="text"
                        value={selectedApprentice.fullName}
                        onChange={e => setSelectedApprentice({ ...selectedApprentice, fullName: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="text"
                        value={selectedApprentice.documentNumber}
                        onChange={e => setSelectedApprentice({ ...selectedApprentice, documentNumber: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="text"
                        value={selectedApprentice.documentType}
                        onChange={e => setSelectedApprentice({ ...selectedApprentice, documentType: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <input
                        type="text"
                        value={selectedApprentice.status}
                        onChange={e => setSelectedApprentice({ ...selectedApprentice, status: e.target.value })}
                        className="border p-2 mb-2"
                    />
                    <button onClick={() => handleUpdateApprentice(selectedApprentice.id)} className="bg-green-500 text-white p-2 rounded">Update Apprentice</button>
                </div>
            )}
        </div>
    );
};

export default ApprenticeList;
