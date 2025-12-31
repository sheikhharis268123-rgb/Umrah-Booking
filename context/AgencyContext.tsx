
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Agent, AgentProfile } from '../types';
import { AGENTS } from '../constants';
import { useInvoice } from './InvoiceContext';

interface AgencyContextType {
    agencies: Agent[];
    updateAgentStatus: (agentId: string, status: 'Active' | 'Inactive') => void;
    addAgency: (profile: AgentProfile) => void;
    updateAgency: (updatedAgent: Agent) => void;
    updateAgentWallet: (agentId: string, amount: number, type: 'Credit' | 'Debit', description: string) => void;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [agencies, setAgencies] = useState<Agent[]>(() => {
        try {
            const savedAgencies = localStorage.getItem('agencies');
            return savedAgencies ? JSON.parse(savedAgencies) : AGENTS;
        } catch (error) {
            console.error("Failed to parse agencies from localStorage", error);
            return AGENTS;
        }
    });
    
    const { addInvoice } = useInvoice();

    useEffect(() => {
        localStorage.setItem('agencies', JSON.stringify(agencies));
    }, [agencies]);

    const addAgency = (profile: AgentProfile) => {
        const newAgency: Agent = {
            id: profile.agencyId,
            profile,
            status: 'Active',
            walletBalance: 0
        };
        if (agencies.find(a => a.id === newAgency.id)) {
            alert(`Agency with ID ${newAgency.id} already exists.`);
            return;
        }
        setAgencies(prev => [...prev, newAgency]);
    };

    const updateAgency = (updatedAgent: Agent) => {
        setAgencies(prev => prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
    };


    const updateAgentStatus = (agentId: string, status: 'Active' | 'Inactive') => {
        setAgencies(prev => 
            prev.map(agent => 
                agent.id === agentId ? { ...agent, status } : agent
            )
        );
    };
    
    const updateAgentWallet = (agentId: string, amount: number, type: 'Credit' | 'Debit', description: string) => {
        let updatedAgent: Agent | undefined;
        setAgencies(prev => {
            const newAgencies = prev.map(agent => {
                if (agent.id === agentId) {
                    const newBalance = type === 'Credit' ? agent.walletBalance + amount : agent.walletBalance - amount;
                    updatedAgent = { ...agent, walletBalance: newBalance };
                    return updatedAgent;
                }
                return agent;
            });
            return newAgencies;
        });

        if (updatedAgent) {
            addInvoice({
                agentId: updatedAgent.id,
                agentName: updatedAgent.profile.agencyName,
                amount,
                type,
                description,
            });
        }
    };

    return (
        <AgencyContext.Provider value={{ agencies, updateAgentStatus, addAgency, updateAgency, updateAgentWallet }}>
            {children}
        </AgencyContext.Provider>
    );
};

export const useAgency = (): AgencyContextType => {
    const context = useContext(AgencyContext);
    if (context === undefined) {
        throw new Error('useAgency must be used within an AgencyProvider');
    }
    return context;
};
