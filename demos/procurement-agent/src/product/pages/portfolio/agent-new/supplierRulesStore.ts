import { useSyncExternalStore } from 'react';
import { z } from 'zod';
import { MNP_SUPPLIER_RULES } from '../procurement-agent/portfolioDemoScript';

export const supplierRulesSchema=z.object({
 name:z.string().trim().min(1),contact:z.string().trim().min(1),website:z.string().url().or(z.literal('')),language:z.string().trim().min(1),country:z.string().trim().min(1),
 minOrderValue:z.number().finite().min(0),minOrderQty:z.number().int().positive().nullable(),freeShippingThreshold:z.number().finite().min(0),defaultShippingFee:z.number().finite().min(0),shippingNote:z.string(),
 earlyPaymentDiscountRate:z.number().finite().min(0).max(1),earlyPaymentDays:z.number().int().min(0),paymentMethod:z.string().trim().min(1),paymentDays:z.number().int().min(0),volumeDiscount:z.string(),
 leadTimeMedianDays:z.number().int().positive(),leadTimeP90Days:z.number().int().positive(),validUntil:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value,'Choose a valid date.'),source:z.string().trim().min(1),version:z.string(),
}).refine(value=>value.leadTimeP90Days>=value.leadTimeMedianDays,{path:['leadTimeP90Days'],message:'P90 lead time must be at least the typical lead time.'});
export type SupplierRules=z.infer<typeof supplierRulesSchema>;
let current:SupplierRules={...MNP_SUPPLIER_RULES,volumeDiscount:MNP_SUPPLIER_RULES.volumeDiscount.replace(' (demo)','')};
const listeners=new Set<()=>void>();
export const getSupplierRules=()=>current;
export const snapshotSupplierRules=():SupplierRules=>({...current});
export function useSupplierRules(){return useSyncExternalStore(listener=>{listeners.add(listener);return()=>{listeners.delete(listener);};},getSupplierRules);}
export function saveSupplierRules(value:SupplierRules,expectedVersion:string){
 if(current.version!==expectedVersion)throw new Error('Supplier rules changed. Close and reopen the editor before saving.');
 const parsed=supplierRulesSchema.safeParse(value);if(!parsed.success)throw new Error(parsed.error.issues[0]?.message??'Check the supplier fields.');
 const revision=Number(current.version.match(/\d+$/)?.[0]??0)+1;
 current={...parsed.data,name:current.name,version:`rule-R${String(revision).padStart(2,'0')}`};listeners.forEach(listener=>listener());return current;
}
