// @ts-nocheck

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminType {
  admin1: string;
  admin2: string
}

const ChannelAdminContext = createContext<AdminType | undefined>(undefined);

interface ChannelAdminProviderProps {
  children: ReactNode;
  channelAdmin1: string;
  channelAdmin2: string;
  channelAdmin3: string;
}

export function ChannelAdminProvider({ children, channelAdmin1, channelAdmin2, channelAdmin3 }: ChannelAdminProviderProps) {
  

  const value = {
    admin1: channelAdmin1 ? channelAdmin1 : "",
    admin2: channelAdmin2 ? channelAdmin2 : "",
    admin3: channelAdmin3 ? channelAdmin3 : ""
  };

  return <ChannelAdminContext.Provider value={value}>{children}</ChannelAdminContext.Provider>;
}

export function useChannelAdmins() {
  const context = useContext(ChannelAdminContext);

  if (context === undefined) {
    throw new Error("useChannelAdmins must be used within a ChannelAdminProvider");
  }

  return context;
}
