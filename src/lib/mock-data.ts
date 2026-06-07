export type Criticality = "Critical" | "Important" | "Non-Critical";
export type StockStatus = "OK" | "Low" | "Out";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Ordered";
export type ReportType = "PM" | "CM";

export interface Spare {
  id: string;
  code: string;
  name: string;
  equipment: string;
  plant: string;
  stock: number;
  minStock: number;
  unit: string;
  criticality: Criticality;
  leadTimeDays: number;
  unitCost: number;
  lastConsumption: string;
  status: StockStatus;
}

export interface Equipment {
  id: string;
  tag: string;
  name: string;
  area: string;
  type: string;
  plant: string;
  criticality: Criticality;
  status: "Running" | "Stopped" | "Maintenance";
}

export interface Report {
  id: string;
  type: ReportType;
  equipmentTag: string;
  date: string;
  inspector: string;
  findings: string;
  linkedSpares: number;
  severity: "High" | "Medium" | "Low";
}

export interface ProcurementRequest {
  id: string;
  spareCode: string;
  spareName: string;
  quantity: number;
  priorityScore: number;
  estimatedCost: number;
  requestedBy: string;
  requestDate: string;
  status: RequestStatus;
  justification: string;
}

export const plants = ["Plant A — Karachi", "Plant B — Hub", "Plant C — Nooriabad"];

export const spares: Spare[] = [
  { id: "1", code: "SP-10421", name: "Roller Bearing 22340", equipment: "Raw Mill RM-01", plant: "Plant A — Karachi", stock: 0, minStock: 2, unit: "pcs", criticality: "Critical", leadTimeDays: 120, unitCost: 8450, lastConsumption: "2026-04-12", status: "Out" },
  { id: "2", code: "SP-10422", name: "Kiln Tyre Pad", equipment: "Kiln K-01", plant: "Plant A — Karachi", stock: 1, minStock: 4, unit: "pcs", criticality: "Critical", leadTimeDays: 180, unitCost: 14200, lastConsumption: "2026-03-02", status: "Low" },
  { id: "3", code: "SP-10588", name: "V-Belt SPC 4500", equipment: "Cement Mill CM-02", plant: "Plant B — Hub", stock: 12, minStock: 6, unit: "pcs", criticality: "Important", leadTimeDays: 30, unitCost: 240, lastConsumption: "2026-05-21", status: "OK" },
  { id: "4", code: "SP-11003", name: "Hydraulic Cylinder 80mm", equipment: "Crusher CR-01", plant: "Plant A — Karachi", stock: 0, minStock: 1, unit: "pcs", criticality: "Critical", leadTimeDays: 90, unitCost: 5200, lastConsumption: "2026-02-19", status: "Out" },
  { id: "5", code: "SP-11220", name: "Refractory Brick — Magnesia", equipment: "Kiln K-02", plant: "Plant C — Nooriabad", stock: 320, minStock: 200, unit: "pcs", criticality: "Important", leadTimeDays: 60, unitCost: 35, lastConsumption: "2026-05-30", status: "OK" },
  { id: "6", code: "SP-11455", name: "Gear Coupling GC-180", equipment: "Cement Mill CM-01", plant: "Plant B — Hub", stock: 2, minStock: 3, unit: "pcs", criticality: "Important", leadTimeDays: 75, unitCost: 1980, lastConsumption: "2026-04-08", status: "Low" },
  { id: "7", code: "SP-11620", name: "Conveyor Belt CB-1200", equipment: "Conveyor CV-08", plant: "Plant A — Karachi", stock: 1, minStock: 1, unit: "rolls", criticality: "Non-Critical", leadTimeDays: 45, unitCost: 3600, lastConsumption: "2026-01-15", status: "OK" },
  { id: "8", code: "SP-11890", name: "Bag Filter Cartridge", equipment: "Baghouse BH-03", plant: "Plant C — Nooriabad", stock: 8, minStock: 24, unit: "pcs", criticality: "Important", leadTimeDays: 40, unitCost: 95, lastConsumption: "2026-05-04", status: "Low" },
  { id: "9", code: "SP-12001", name: "Limit Switch — Heavy Duty", equipment: "Various", plant: "Plant A — Karachi", stock: 18, minStock: 10, unit: "pcs", criticality: "Non-Critical", leadTimeDays: 20, unitCost: 75, lastConsumption: "2026-05-12", status: "OK" },
  { id: "10", code: "SP-12110", name: "Motor 250kW 6-Pole", equipment: "Cement Mill CM-02", plant: "Plant B — Hub", stock: 0, minStock: 1, unit: "pcs", criticality: "Critical", leadTimeDays: 210, unitCost: 28400, lastConsumption: "2025-11-08", status: "Out" },
];

export const equipment: Equipment[] = [
  { id: "e1", tag: "RM-01", name: "Raw Mill 1", area: "Raw Grinding", type: "Vertical Mill", plant: "Plant A — Karachi", criticality: "Critical", status: "Running" },
  { id: "e2", tag: "K-01", name: "Kiln 1", area: "Pyro", type: "Rotary Kiln", plant: "Plant A — Karachi", criticality: "Critical", status: "Running" },
  { id: "e3", tag: "K-02", name: "Kiln 2", area: "Pyro", type: "Rotary Kiln", plant: "Plant C — Nooriabad", criticality: "Critical", status: "Maintenance" },
  { id: "e4", tag: "CM-01", name: "Cement Mill 1", area: "Finish Grinding", type: "Ball Mill", plant: "Plant B — Hub", criticality: "Critical", status: "Running" },
  { id: "e5", tag: "CM-02", name: "Cement Mill 2", area: "Finish Grinding", type: "Ball Mill", plant: "Plant B — Hub", criticality: "Critical", status: "Stopped" },
  { id: "e6", tag: "CR-01", name: "Primary Crusher", area: "Crushing", type: "Hammer Crusher", plant: "Plant A — Karachi", criticality: "Important", status: "Running" },
  { id: "e7", tag: "CV-08", name: "Conveyor 08", area: "Transport", type: "Belt Conveyor", plant: "Plant A — Karachi", criticality: "Non-Critical", status: "Running" },
  { id: "e8", tag: "BH-03", name: "Baghouse 3", area: "Air Pollution Control", type: "Pulse Jet Filter", plant: "Plant C — Nooriabad", criticality: "Important", status: "Running" },
];

export const reports: Report[] = [
  { id: "r1", type: "CM", equipmentTag: "CM-02", date: "2026-06-02", inspector: "A. Khan", findings: "Excessive vibration on DE bearing of motor. Recommend immediate replacement.", linkedSpares: 2, severity: "High" },
  { id: "r2", type: "PM", equipmentTag: "K-01", date: "2026-05-28", inspector: "R. Ahmed", findings: "Tyre pad wear at 70%. Plan replacement in next shutdown.", linkedSpares: 1, severity: "Medium" },
  { id: "r3", type: "PM", equipmentTag: "RM-01", date: "2026-05-22", inspector: "S. Bhatti", findings: "Bearing temperature trending upward. Monitor weekly.", linkedSpares: 1, severity: "Medium" },
  { id: "r4", type: "CM", equipmentTag: "CR-01", date: "2026-05-18", inspector: "A. Khan", findings: "Hydraulic cylinder leakage observed.", linkedSpares: 1, severity: "High" },
  { id: "r5", type: "PM", equipmentTag: "BH-03", date: "2026-05-14", inspector: "M. Imran", findings: "Cartridge differential pressure above 180 mbar.", linkedSpares: 1, severity: "Low" },
];

export const procurement: ProcurementRequest[] = [
  { id: "p1", spareCode: "SP-10421", spareName: "Roller Bearing 22340", quantity: 4, priorityScore: 9, estimatedCost: 33800, requestedBy: "M. Imran", requestDate: "2026-06-03", status: "Pending", justification: "Out of stock — Raw Mill critical bearing." },
  { id: "p2", spareCode: "SP-10422", spareName: "Kiln Tyre Pad", quantity: 6, priorityScore: 8, estimatedCost: 85200, requestedBy: "M. Imran", requestDate: "2026-06-01", status: "Approved", justification: "Below min — long lead time imported item." },
  { id: "p3", spareCode: "SP-12110", spareName: "Motor 250kW 6-Pole", quantity: 1, priorityScore: 10, estimatedCost: 28400, requestedBy: "M. Imran", requestDate: "2026-05-30", status: "Ordered", justification: "Cement Mill 2 standby motor required." },
  { id: "p4", spareCode: "SP-11003", spareName: "Hydraulic Cylinder 80mm", quantity: 2, priorityScore: 7, estimatedCost: 10400, requestedBy: "S. Bhatti", requestDate: "2026-05-28", status: "Pending", justification: "Replacement for leaking unit on crusher." },
  { id: "p5", spareCode: "SP-11890", spareName: "Bag Filter Cartridge", quantity: 60, priorityScore: 6, estimatedCost: 5700, requestedBy: "R. Ahmed", requestDate: "2026-05-25", status: "Rejected", justification: "Stock arriving from prior order — defer." },
  { id: "p6", spareCode: "SP-11455", spareName: "Gear Coupling GC-180", quantity: 2, priorityScore: 5, estimatedCost: 3960, requestedBy: "M. Imran", requestDate: "2026-05-22", status: "Approved", justification: "Below minimum on CM-01." },
];

export const budget = {
  fiscalYear: "FY 2026",
  total: 1_200_000,
  spent: 742_500,
  committed: 168_000,
  get remaining() {
    return this.total - this.spent - this.committed;
  },
  categories: [
    { name: "Mechanical Spares", allocated: 600_000, spent: 412_000 },
    { name: "Electrical Spares", allocated: 280_000, spent: 168_500 },
    { name: "Consumables", allocated: 180_000, spent: 122_000 },
    { name: "Refractories", allocated: 140_000, spent: 40_000 },
  ],
  monthlySpend: [
    { month: "Jan", spend: 52 },
    { month: "Feb", spend: 78 },
    { month: "Mar", spend: 96 },
    { month: "Apr", spend: 110 },
    { month: "May", spend: 134 },
    { month: "Jun", spend: 88 },
  ],
};

export const dashboardStats = {
  criticalShortages: spares.filter(s => s.criticality === "Critical" && s.status !== "OK").length,
  belowMin: spares.filter(s => s.stock < s.minStock).length,
  pendingRequests: procurement.filter(p => p.status === "Pending").length,
  openReports: reports.filter(r => r.severity !== "Low").length,
};
