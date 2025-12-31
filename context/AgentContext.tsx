
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Agent, AgentProfile } from '../types';
import { useAgency } from './AgencyContext';

interface AgentContextType {
    agent: Agent | null;
    setAgentProfile: (profile: AgentProfile) => void;
}

const defaultProfile: AgentProfile = {
    agencyName: 'Al-Huda Travels',
    agencyId: 'AHT-001',
    iataCode: '22-3 4567-8',
    contactEmail: 'bookings@alhudatravels.com',
    contactNumber: '+966 12 345 6789'
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

// FIX: Explicitly typed as React.FC to ensure TS recognizes the 'children' prop when used in JSX tree
export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This represents the currently "logged in" agent.
    // In a real app, this ID would come from an authentication system.
    const [currentAgentId] = useState('AHT-001'); 
    const { agencies, updateAgency } = useAgency();

    const agent = agencies.find(a => a.id === currentAgentId) || null;
    
    const setAgentProfile = (profile: AgentProfile) => {
        if (agent) {
            const updatedAgent = { ...agent, profile };
            updateAgency(updatedAgent);
        }
    };

    return (
        <AgentContext.Provider value={{ agent, setAgentProfile }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgent = (): AgentContextType => {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
};
