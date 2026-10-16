export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missingCharge: number;
};

const shieldCapacity = 10;

function getShieldSnapshot(): ShieldSnapshot {
  return {
    charge: count,
    capacity: shieldCapacity,
    missingCharge: shieldCapacity - count,
  };
}
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const shieldEvents = new EventTarget();
function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${snapshot.charge} / ${snapshot.capacity} shield`,
    12,
    100,
  );
  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

function updateStats(snapshot: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;

  panel.textContent =
    `Shield charge: ${snapshot.charge} · Missing charge: ${snapshot.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(shieldCapacity, next));
  if (bounded === count) return;

  count = bounded;
  shieldEvents.dispatchEvent(new Event("change"));

  if (panel) updateStats(getShieldSnapshot());
}
shieldEvents.addEventListener("change", () => {
  drawMeter(getShieldSnapshot());
});
document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldSnapshot());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(getShieldSnapshot());
