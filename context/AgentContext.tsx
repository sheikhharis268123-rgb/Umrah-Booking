
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Agent, AgentProfile } from '../types';
import { useAgency } from './AgencyContext';
import { useAuth } from './AuthContext';

interface AgentContextType {
    agent: Agent | null;
    setAgentProfile: (profile: AgentProfile) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This now represents the currently "logged in" agent, derived from AuthContext.
    const { user } = useAuth();
    const { agencies, updateAgency } = useAgency();

    const agent = user && user.role === 'agent' ? agencies.find(a => a.id === user.id) || null : null;
    
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
