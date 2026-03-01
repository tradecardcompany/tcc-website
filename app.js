const WHATSAPP = "50767131015";

function waLink(product) {
  const msg =
    `Hola TCC 👋 Quiero pedir: ${product.name} (${product.id}) - ` +
    `$${Number(product.price).toFixed(2)}. ¿Está disponible? ` +
    `Pago por Yappy/transferencia.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function safeText(value) {
  return String(value ?? "").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function productCard(p) {
  const badgeClass = p.status === "Disponible" ? "badge ok" : "badge warn";
  const imgSrc = p.image ? safeText(p.image) : "images/placeholder.jpg";

  return `
    <div class="product">
      <div class="${badgeClass}">${safeText(p.status)}</div>

      <div class="p-img">
        <img src="${imgSrc}" alt="${safeText(p.name)}" loading="lazy" />
      </div>

      <div class="p-name">${safeText(p.name)}</div>
      <div class="p-meta">${safeText(p.category)} • ${safeText(p.id)}</div>
      <div class="p-price">$${Number(p.price).toFixed(2)} ${safeText(p.currency || "USD")}</div>

      <a class="btn small primary" target="_blank" rel="noopener" href="${waLink(p)}">Pedir</a>
    </div>
  `;
}

let all = [];

function render() {
  const searchEl = document.getElementById("search");
  const categoryEl = document.getElementById("category");

  const q = (searchEl?.value || "").toLowerCase().trim();
  const cat = categoryEl?.value || "all";

  const filtered = all.filter((p) => {
    const text = `${p.name} ${p.id}`.toLowerCase();
    const matchesText = !q || text.includes(q);
    const matchesCat = cat === "all" || p.category === cat;
    return matchesText && matchesCat;
  });

  const grids = {
    Sellado: document.getElementById("grid-sellado"),
    Singles: document.getElementById("grid-singles"),
    Accesorios: document.getElementById("grid-accesorios")
  };

  Object.values(grids).forEach((el) => {
    if (el) el.innerHTML = "";
  });

  for (const p of filtered) {
    const bucket = grids[p.category];
    if (bucket) bucket.insertAdjacentHTML("beforeend", productCard(p));
  }
}

async function init() {
  const res = await fetch("products.json", { cache: "no-store" });
  all = await res.json();

  document.getElementById("search")?.addEventListener("input", render);
  document.getElementById("category")?.addEventListener("change", render);

  render();
}

init();
