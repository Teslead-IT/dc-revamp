// Mock data for DC lists - replace with API calls later

export interface DeliveryChallan {
  id: string
  dcNumber: string
  dcDate: string
  customerName: string
  itemNames: string
  totalItems?: number
  totalQuantity?: number
  dcType?: string
  vehicleNo?: string
  projectName?: string
  process?: string
  createdBy?: string
  status: "draft" | "open" | "partial" | "closed" | "cancelled" | "deleted"
  totalDispatchQty?: number
  totalReceivedQty?: number
}

export const mockDCData: DeliveryChallan[] = [
  {
    id: "1",
    dcNumber: "TLSPMDC-25-26-125",
    dcDate: "29-08-2025",
    customerName: "veran",
    itemNames: "Valve",
    status: "partial",
    totalDispatchQty: 20,
    totalReceivedQty: 2,
  },
  {
    id: "2",
    dcNumber: "TLSPMDC-25-26-126",
    dcDate: "29-08-2025",
    customerName: "pandikumar1",
    itemNames: "square2",
    status: "partial",
    totalDispatchQty: 2,
    totalReceivedQty: 1,
  },
  {
    id: "3",
    dcNumber: "TLSPMDC-25-26-128",
    dcDate: "11-09-2025",
    customerName: "vijay",
    itemNames: "TL-ITEM2, TL-ITEM3, TL-ITEM1, tap, Item 1, Item 1, Item 2, Item 1",
    status: "partial",
    totalDispatchQty: 45,
    totalReceivedQty: 28,
  },
  {
    id: "4",
    dcNumber: "TLSPMDC-25-26-129",
    dcDate: "11-09-2025",
    customerName: "pandikumar12",
    itemNames: "Item 2",
    status: "cancelled",
    totalDispatchQty: 3,
    totalReceivedQty: 0,
  },
  {
    id: "5",
    dcNumber: "TLSPMDC-25-26-130",
    dcDate: "11-09-2025",
    customerName: "logesh",
    itemNames: "Valve",
    status: "cancelled",
    totalDispatchQty: 1,
    totalReceivedQty: 0,
  },
  {
    id: "6",
    dcNumber: "TLSPMDC-25-26-134",
    dcDate: "11-09-2025",
    customerName: "vetri",
    itemNames: "Item 1",
    status: "closed",
    totalDispatchQty: 1,
    totalReceivedQty: 1,
  },
  {
    id: "7",
    dcNumber: "TLSPMDC-25-26-135",
    dcDate: "11-09-2025",
    customerName: "veran",
    itemNames: "Valve",
    status: "closed",
    totalDispatchQty: 1,
    totalReceivedQty: 1,
  },
  {
    id: "8",
    dcNumber: "TLVSDC-25-26-030",
    dcDate: "11-09-2025",
    customerName: "vicky",
    itemNames: "TL-ITEM2, TL-ITEM3, TL-ITEM1",
    status: "closed",
    totalDispatchQty: 3,
    totalReceivedQty: 3,
  },
  {
    id: "9",
    dcNumber: "TLSPMDC-25-26-139",
    dcDate: "11-09-2025",
    customerName: "Logesh2",
    itemNames: "TL-ITEM2, TL-ITEM3, TL-ITEM1, tap, Item 1, Item 1, Item 2, valve",
    totalItems: 8,
    totalQuantity: 43,
    dcType: "SPM",
    vehicleNo: "tn31 bt 1286",
    projectName: "spm",
    process: "coating",
    createdBy: "Shamili",
    status: "open",
  },
  {
    id: "10",
    dcNumber: "TLSPMDC-25-26-141",
    dcDate: "12-09-2025",
    customerName: "Logesh",
    itemNames: "Valve",
    totalItems: 1,
    totalQuantity: 5,
    dcType: "Coating",
    vehicleNo: "TN 37 AB 2025",
    projectName: "VALVES",
    process: "Coating",
    createdBy: "V SHAMILI",
    status: "open",
  },
  {
    id: "128",
    dcNumber: "128",
    dcDate: "11-09-2025",
    customerName: "arun",
    itemNames: "TL-ITEM2, TL-ITEM1, tap, Item 1",
    totalItems: 4,
    totalQuantity: 22,
    dcType: "SPM",
    vehicleNo: "tn31 bt 1286",
    projectName: "spm",
    process: "welding",
    status: "draft",
  },
  {
    id: "129",
    dcNumber: "129",
    dcDate: "11-09-2025",
    customerName: "teslead",
    itemNames: "Valve, Item 1",
    totalItems: 2,
    totalQuantity: 12,
    dcType: "SPM",
    vehicleNo: "tn31 bt 1290",
    projectName: "spm",
    process: "Hardening",
    status: "draft",
  },
]

export function getDCByStatus(status: string): DeliveryChallan[] {
  if (status === "all") return mockDCData
  return mockDCData.filter((dc) => dc.status === status)
}

export function getDCById(id: string): DeliveryChallan | undefined {
  return mockDCData.find((dc) => dc.id === id || dc.dcNumber === id)
}
