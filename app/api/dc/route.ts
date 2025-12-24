
import { NextRequest, NextResponse } from "next/server"

// --- TYPES ---

type Status = "Draft" | "Open" | "Partial" | "Closed" | "Cancelled"
type Priority = "High" | "Medium" | "Low"

interface DeliveryChallan {
    id: string
    dcNumber: string
    customerName: string
    status: Status
    priority: Priority
    createdBy: {
        name: string
        avatar?: string
    }
    dispatchDate: string
    expectedReturnDate: string
    itemsCount: number
    totalValue: number
}

// --- MOCK DATA GENERATOR ---

const NAMES = ["Sathish Kumar", "Pandi Kumar", "Logesh", "Karthikeyan", "Kesav"]
const CUSTOMERS = ["Kumar", "Arun", "Vicky", "Dharani Akka", "Gopi", "Guru"]

function generateMockData(count: number): DeliveryChallan[] {
    return Array.from({ length: count }).map((_, i) => {
        const statusIdx = Math.floor(Math.random() * 5)
        const status = ["Draft", "Open", "Partial", "Closed", "Cancelled"][statusIdx] as Status
        const name = NAMES[Math.floor(Math.random() * NAMES.length)]

        return {
            id: `dc-${1000 + i}`,
            dcNumber: `DC-${2025001 + i}`,
            customerName: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
            status,
            priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as Priority,
            createdBy: {
                name,
                avatar: `https://tse4.mm.bing.net/th/id/OIP.kEElL_mXnRbuxVnGXOcbIwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3`,
            },
            itemsCount: Math.floor(Math.random() * 50) + 1,
            dispatchDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            expectedReturnDate: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
            totalValue: Math.floor(Math.random() * 50000) + 5000,
        }
    })
}

// Generate 500 records once
const DB = generateMockData(500)

// --- API HANDLER ---

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const {
            startRow = 0,
            endRow = 100,
            sortModel = [],
            filterModel = {},
            search = ""
        } = body

        let filteredData = [...DB]

        // 1. Global Search
        if (search) {
            const lowerSearch = search.toLowerCase()
            filteredData = filteredData.filter(item =>
                item.dcNumber.toLowerCase().includes(lowerSearch) ||
                item.customerName.toLowerCase().includes(lowerSearch) ||
                item.createdBy.name.toLowerCase().includes(lowerSearch)
            )
        }

        // 2. Column Filtering (Simple implementation for demo)
        Object.keys(filterModel).forEach(key => {
            const filter = filterModel[key]
            if (filter.filterType === 'text' && filter.filter) {
                filteredData = filteredData.filter((item: any) => {
                    const val = String(item[key] || "").toLowerCase()
                    return val.includes(filter.filter.toLowerCase())
                })
            }
        })

        // 3. Sorting
        if (sortModel.length > 0) {
            filteredData.sort((a: any, b: any) => {
                for (const sort of sortModel) {
                    const valA = a[sort.colId]
                    const valB = b[sort.colId]
                    if (valA === valB) continue

                    const comparison = valA > valB ? 1 : -1
                    return sort.sort === 'asc' ? comparison : -comparison
                }
                return 0
            })
        }

        // 4. Pagination
        const totalCount = filteredData.length
        const rows = filteredData.slice(startRow, endRow)

        return NextResponse.json({
            rowData: rows,
            rowCount: totalCount, // Total matched rows
        })

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}
