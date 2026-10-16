export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
type ShiftResult = {
  assignedSupply: number;
  production: number;
  consumption: number;
  balance: number;
};
type SupplyRow = {
  label: string;
  resultKey: "production" | "consumption";
  color: string;
};
const supplyRows: SupplyRow[] = [
  {
    label: "Production",
    resultKey: "production",
    color: "#27766b",
  },
  {
    label: "Consumption",
    resultKey: "consumption",
    color: "#a44d23",
  },
];
function calculateShift(assignedSupply: number): ShiftResult {
  const production = assignedSupply * 3;
  const consumption = 6;

  return {
    assignedSupply,
    production,
    consumption,
    balance: production - consumption,
  };
}
let assignedSupply = 2;
function drawCrew(assignedSupply: number) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < assignedSupply ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedSupply ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}
function updateAllocation() {
  const result = calculateShift(assignedSupply);
  const {
    assignedSupply: assignedCount,
    production,
    consumption,
    balance,
  } = result;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrew(assignedCount);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedCount} / 6`, 18, 76);

  supplyRows.forEach((row, index) => {
    const value = result[row.resultKey];
    const labelY = 102 + index * 52;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${value}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + 8, value * 14, 20);
  });
  readout.textContent =
    `Assigned: ${assignedCount}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedSupply = Math.max(0, assignedSupply - 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedSupply = Math.min(6, assignedSupply + 1);
  updateAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedSupply = 2;
    updateAllocation();
  };
updateAllocation();
