import { createContext, useContext, type ReactNode } from 'react';
import type { SupplierRules } from '../agent-new/supplierRulesStore';
export const PortfolioOrderContext=createContext<{number:string;supplierRules?:SupplierRules;previewMode?:boolean;onBack?:()=>void;onDeleteDraft?:()=>void;onOpen?:(id:string)=>void;supplierRulesInPanel?:boolean;headerNotice?:ReactNode}>({number:'PO-2026-0842'});
export const usePortfolioOrder=()=>useContext(PortfolioOrderContext);
