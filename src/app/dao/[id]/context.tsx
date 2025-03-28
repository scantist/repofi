"use client"
import type React from 'react';
import {createContext, useContext, useState} from 'react';
import type {DaoDetailResult} from "~/server/service/dao";

type DaoContextType = {
  detail: DaoDetailResult,
  refresh: number,
  triggerRefresh: () => void,
};

const DaoContext = createContext<DaoContextType | undefined>(undefined);

export const DaoProvider: React.FC<{ children: React.ReactNode, initialDetail: DaoDetailResult }> = ({
                                                                                                       children,
                                                                                                       initialDetail
                                                                                                     }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => {
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 0)
  };

  return (
    <DaoContext.Provider value={{
      detail: initialDetail,
      refresh: refreshTrigger,
      triggerRefresh: triggerRefresh,
    }}>
      {children}
    </DaoContext.Provider>
  );
};

export const useDaoContext = () => {
  const context = useContext(DaoContext);
  if (context === undefined) {
    throw new Error('useDaoContext must be used within a DaoProvider');
  }
  return context;
};
