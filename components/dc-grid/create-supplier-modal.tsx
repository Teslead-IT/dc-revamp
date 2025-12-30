"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { StateSelect, CitySelect } from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"
import { useCreateSupplier } from "@/hooks/use-suppliers"
import { showToast as toast } from "@/lib/toast-service"

import type { Supplier, CreateSupplierData } from "@/lib/api-client"

interface CreateSupplierModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    supplierName?: string
    onSupplierCreated: (supplier: Supplier) => void
}

const GST_STATE_CODES: Record<string, number> = {
    "Jammu and Kashmir": 1, "Himachal Pradesh": 2, "Punjab": 3, "Chandigarh": 4, "Uttarakhand": 5, "Haryana": 6, "Delhi": 7, "Rajasthan": 8, "Uttar Pradesh": 9, "Bihar": 10, "Sikkim": 11, "Arunachal Pradesh": 12, "Nagaland": 13, "Manipur": 14, "Mizoram": 15, "Tripura": 16, "Meghalaya": 17, "Assam": 18, "West Bengal": 19, "Jharkhand": 20, "Odisha": 21, "Chhattisgarh": 22, "Madhya Pradesh": 23, "Gujarat": 24, "Dadra and Nagar Haveli and Daman and Diu": 26, "Maharashtra": 27, "Karnataka": 29, "Goa": 30, "Lakshadweep": 31, "Kerala": 32, "Tamil Nadu": 33, "Puducherry": 34, "Andaman and Nicobar Islands": 35, "Telangana": 36, "Andhra Pradesh": 37, "Ladakh": 38
}

export function CreateSupplierModal({ open, onOpenChange, supplierName = '', onSupplierCreated }: CreateSupplierModalProps) {
    const createSupplier = useCreateSupplier()

    const [formData, setFormData] = useState<Partial<CreateSupplierData>>({
        partyName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        stateCode: 33,
        pinCode: undefined,
        gstinNumber: '',
        email: '',
        phone: ''
    })
    const [stateId, setStateId] = useState(0);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            // Reset to fresh state when opening
            setFormData({
                partyName: supplierName,
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                stateCode: 33,
                pinCode: undefined,
                gstinNumber: '',
                email: '',
                phone: ''
            })
            setStateId(0) // Reset state selector
        }
    }, [open, supplierName])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const newSupplier = await createSupplier.mutateAsync(formData as CreateSupplierData)
            onSupplierCreated(newSupplier as Supplier)
            toast.success('Supplier created successfully!')
            // Close modal and reset
            onOpenChange(false)
        } catch (error) {
            // Error handled by hook
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0F172A] border-slate-700 text-slate-100 max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-slate-100">Create New Supplier</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="text-slate-300">Party Name *</Label>
                        <Input
                            value={formData.partyName || ''}
                            onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                            required
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div>
                        <Label className="text-slate-300">Address Line 1 *</Label>
                        <Input
                            value={formData.addressLine1 || ''}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            required
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div>
                        <Label className="text-slate-300">Address Line 2</Label>
                        <Input
                            value={formData.addressLine2 || ''}
                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 z-50">
                        <style>{`
                            .stdropdown-container {
                                border: 1px solid #334155 !important;
                                background-color: rgba(15, 23, 42, 0.5) !important;
                                border-radius: 0.375rem !important;
                            }
                            /* Remove default inner borders/outlines */
                            .stdropdown-container *:not(.stdropdown-menu):not(.stdropdown-item) {
                                border: none !important;
                                outline: none !important;
                                box-shadow: none !important;
                            }
                            .stdropdown-input {
                                background-color: transparent !important;
                                color: #f1f5f9 !important;
                            }
                            .stdropdown-input::placeholder {
                                color: #94a3b8 !important;
                            }
                            .stdropdown-menu {
                                background-color: #0f172a !important;
                                border: 1px solid #334155 !important;
                                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
                                z-index: 9999 !important;
                            }
                            .stdropdown-item {
                                background-color: #0f172a !important;
                                color: #cbd5e1 !important;
                            }
                            .stdropdown-item:hover {
                                background-color: #1e293b !important;
                                color: #f8fafc !important;
                            }
                            .stdropdown-tool {
                                display: none !important;
                            }
                        `}</style>
                        <div className="flex flex-col space-y-2">
                            <Label className="text-slate-300">State *</Label>
                            <div>
                                <StateSelect
                                    key={`state-${open}`}
                                    countryid={101}
                                    onChange={(e: any) => {
                                        setStateId(e.id);
                                        const stateName = e.name;
                                        setFormData({
                                            ...formData,
                                            state: stateName,
                                            stateCode: GST_STATE_CODES[stateName] || 33 // Default or 0
                                        });
                                    }}
                                    placeHolder="Select State"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="text-slate-300">City *</Label>
                            <div>
                                <CitySelect
                                    key={`city-${open}-${stateId}`}
                                    countryid={101}
                                    stateid={stateId}
                                    onChange={(e: any) => {
                                        setFormData({ ...formData, city: e.name });
                                    }}
                                    placeHolder="Select City"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-slate-300">State Code (Auto-filled)</Label>
                            <Input
                                type="number"
                                value={formData.stateCode || 33}
                                readOnly
                                className="bg-slate-800 border-slate-700 text-slate-400"
                            />
                            <p className="text-xs text-slate-500 mt-1">Automatically set</p>
                        </div>

                        <div>
                            <Label className="text-slate-300">Pin Code *</Label>
                            <Input
                                type="number"
                                value={formData.pinCode || ''}
                                onChange={(e) => setFormData({ ...formData, pinCode: parseInt(e.target.value) })}
                                required
                                className="bg-slate-900/50 border-slate-700 text-slate-100"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-slate-300">GSTIN Number *</Label>
                        <Input
                            value={formData.gstinNumber || ''}
                            onChange={(e) => setFormData({ ...formData, gstinNumber: e.target.value })}
                            placeholder="22AAAAA0000A1Z5"
                            required
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div>
                        <Label className="text-slate-300">Email *</Label>
                        <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="supplier@example.com"
                            required
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div>
                        <Label className="text-slate-300">Phone *</Label>
                        <Input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="9876543210"
                            required
                            className="bg-slate-900/50 border-slate-700 text-slate-100"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="bg-slate-700 text-slate-200 hover:bg-slate-600"
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={createSupplier.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {createSupplier.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Supplier'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
