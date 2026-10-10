/* Demonstração fictícia Gustmann: cada linha representa um item vendido. */
const CSV_DEMONSTRACAO = `Data,Cliente,Periodo,Produto,Categoria,Quantidade,Preco_Unitario,Forma_Pagamento
2025-04-01,Café Aurora,Manhã,Pão francês,Pães,50,0.90,Pix
2025-04-01,Escritório Horizonte,Manhã,Café coado,Bebidas,12,6.00,Cartão
2025-04-01,Escola Girassol,Tarde,Pão de queijo,Salgados,40,3.50,Pix
2025-04-02,Hotel Alameda,Manhã,Croissant,Confeitaria,18,8.50,Cartão
2025-04-02,Clínica Ipê,Manhã,Pão de queijo,Salgados,24,3.50,Pix
2025-04-02,Ateliê Amora,Tarde,Rolo de canela,Confeitaria,8,9.90,Cartão
2025-04-03,Café Aurora,Manhã,Pão francês,Pães,55,0.90,Pix
2025-04-03,Hotel Alameda,Manhã,Brioche,Pães,8,11.50,Cartão
2025-04-03,Escola Girassol,Manhã,Empada de frango,Salgados,15,7.50,Dinheiro
2025-04-04,Escritório Horizonte,Manhã,Café coado,Bebidas,14,6.00,Cartão
2025-04-04,Clínica Ipê,Manhã,Baguete,Pães,6,12.50,Pix
2025-04-04,Ateliê Amora,Tarde,Bolo de cenoura,Bolos,2,34.90,Dinheiro
2025-04-05,Hotel Alameda,Manhã,Pão francês,Pães,80,0.90,Pix
2025-04-05,Café Aurora,Manhã,Pão de queijo,Salgados,30,3.50,Pix
2025-04-05,Escola Girassol,Tarde,Sonho de creme,Confeitaria,20,6.50,Cartão
2025-04-06,Clínica Ipê,Manhã,Pão francês,Pães,45,0.90,Pix
2025-04-06,Escritório Horizonte,Manhã,Croissant,Confeitaria,12,8.50,Cartão
2025-04-06,Ateliê Amora,Manhã,Café coado,Bebidas,10,6.00,Pix
2025-04-07,Café Aurora,Manhã,Pão francês,Pães,60,0.90,Pix
2025-04-07,Hotel Alameda,Manhã,Croissant,Confeitaria,20,8.50,Cartão
2025-04-07,Escola Girassol,Tarde,Empada de frango,Salgados,16,7.50,Dinheiro
2025-04-08,Escritório Horizonte,Manhã,Broa de milho,Pães,7,12.00,Pix
2025-04-08,Clínica Ipê,Manhã,Pão de queijo,Salgados,30,3.50,Cartão
2025-04-08,Ateliê Amora,Tarde,Fatia de torta,Bolos,6,10.90,Cartão
2025-04-09,Hotel Alameda,Manhã,Baguete,Pães,10,12.50,Cartão
2025-04-09,Café Aurora,Manhã,Café coado,Bebidas,14,6.00,Pix
2025-04-09,Escola Girassol,Manhã,Fatia de torta,Bolos,20,10.90,Cartão
2025-04-10,Clínica Ipê,Manhã,Croissant,Confeitaria,8,8.50,Pix
2025-04-10,Escritório Horizonte,Manhã,Pão francês,Pães,45,0.90,Dinheiro
2025-04-10,Ateliê Amora,Manhã,Rolo de canela,Confeitaria,10,9.90,Cartão`;

const LOCALE = "pt-BR";
const currency = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat(LOCALE, { timeZone: "UTC" });
const GALLERY_STORAGE_KEY = "gustamann-vitrine-fotos-v1";
const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
const DEMO_LOGIN = { email: "gustmann@padaria.com", password: "fornada2026" };
const LOGIN_SESSION_KEY = "gustmann-demo-login-v1";
const assistantData = { rows: [], columns: [], source: "", workbook: null, activeSheet: "" };
const aliases = {
  data: ["data", "date", "dia"],
  cliente: ["cliente", "client", "nome do cliente", "estabelecimento"],
  periodo: ["periodo", "período", "periodo do dia", "turno", "faixa horaria", "faixa horária"],
  produto: ["produto", "item", "nome do produto"],
  categoria: ["categoria", "tipo"],
  quantidade: ["quantidade", "qtd", "qtde", "quantity"],
  precoUnitario: ["preco_unitario", "preço_unitário", "preco unitario", "preço unitário", "valor unitario", "valor unitário", "preco", "preço"],
  formaPagamento: ["forma_pagamento", "forma de pagamento", "pagamento", "payment"]
};

const state = { rows: [], sourceName: "Dados de demonstração", isDemo: true, invalid: {}, missing: {}, sortKey: "data", sortDirection: "desc", page: 1, pageSize: "all", timelineChart: null, categoryChart: null, customerChart: null, quickSearchTerms: [] };
const elements = {};

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  ["login-screen", "login-form", "login-email", "login-password", "login-message", "app-shell", "logout-button", "csv-file", "date-from", "date-to", "customer-filter", "period-filter", "category-filter", "payment-filter", "table-search", "table-page-size", "clear-filters", "export-csv", "record-count", "metric-revenue", "metric-records", "metric-units", "metric-average", "metric-morning", "period-label", "sales-table-body", "table-summary", "empty-state", "table-scroll", "previous-page", "next-page", "page-label", "import-message", "data-notice", "dismiss-notice", "quality-summary", "quality-content", "timeline-chart", "category-chart", "customer-chart", "theme-toggle", "theme-icon", "theme-label", "quick-tour", "quick-tour-dialog", "close-tour", "tour-go-dashboard", "painel-vendas", "gallery-message", "restore-gallery", "assistant-file", "assistant-demo-button", "assistant-dataset-status", "assistant-sheet-wrap", "assistant-sheet", "assistant-messages", "assistant-form", "assistant-question"].forEach(id => elements[id] = document.getElementById(id));
  bindEvents();
  restoreGalleryPhotos();
  const demo = parseCsvText(CSV_DEMONSTRACAO);
  state.rows = demo.rows;
  state.invalid = demo.invalid;
  state.missing = demo.missing;
  resetAssistantDemo();
  refreshFilterOptions();
  renderQuality();
  if (hasActiveLogin()) showDashboard();
  else showLogin();
}

function bindEvents() {
  elements["login-form"].addEventListener("submit", handleLogin);
  elements["logout-button"].addEventListener("click", handleLogout);
  [elements["date-from"], elements["date-to"], elements["customer-filter"], elements["period-filter"], elements["category-filter"], elements["payment-filter"], elements["table-search"]].forEach(control => {
    const updateResults = () => {
      if (control === elements["table-search"]) state.quickSearchTerms = [];
      state.page = 1;
      render();
    };
    control.addEventListener("input", updateResults);
    control.addEventListener("change", updateResults);
  });
  elements["csv-file"].addEventListener("change", importCsvFile);
  elements["assistant-file"].addEventListener("change", importAssistantFile);
  elements["assistant-sheet"].addEventListener("change", event => loadAssistantWorksheet(event.currentTarget.value));
  elements["assistant-demo-button"].addEventListener("click", resetAssistantDemo);
  elements["assistant-form"].addEventListener("submit", event => {
    event.preventDefault();
    submitAssistantQuestion();
  });
  document.querySelectorAll(".assistant-suggestion").forEach(button => button.addEventListener("click", () => {
    elements["assistant-question"].value = button.dataset.question;
    submitAssistantQuestion();
  }));
  elements["table-page-size"].addEventListener("change", event => {
    state.pageSize = event.currentTarget.value;
    state.page = 1;
    renderTable(getFilteredRows());
  });
  elements["clear-filters"].addEventListener("click", clearFilters);
  elements["export-csv"].addEventListener("click", exportCsv);
  elements["previous-page"].addEventListener("click", () => changePage(-1));
  elements["next-page"].addEventListener("click", () => changePage(1));
  elements["dismiss-notice"].addEventListener("click", () => { elements["data-notice"].hidden = true; });
  elements["theme-toggle"].addEventListener("click", toggleTheme);
  elements["quick-tour"].addEventListener("click", () => elements["quick-tour-dialog"].showModal());
  elements["close-tour"].addEventListener("click", () => elements["quick-tour-dialog"].close());
  elements["tour-go-dashboard"].addEventListener("click", () => {
    elements["quick-tour-dialog"].close();
    elements["painel-vendas"].focus({ preventScroll: true });
    elements["painel-vendas"].scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elements["quick-tour-dialog"].addEventListener("click", event => {
    if (event.target === elements["quick-tour-dialog"]) elements["quick-tour-dialog"].close();
  });
  document.querySelectorAll(".gallery-card input[type='file']").forEach(input => {
    input.addEventListener("change", event => saveGalleryPhoto(event.currentTarget));
  });
  document.querySelectorAll(".gallery-action").forEach(button => {
    button.addEventListener("click", () => applyGallerySearch(button.dataset.searchTerms));
  });
  elements["restore-gallery"].addEventListener("click", resetGalleryPhotos);
  document.querySelectorAll(".sort-button").forEach(button => button.addEventListener("click", () => sortBy(button.dataset.sort)));
}

function hasActiveLogin() {
  try {
    return sessionStorage.getItem(LOGIN_SESSION_KEY) === "active";
  } catch {
    return false;
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = elements["login-email"].value.trim().toLocaleLowerCase(LOCALE);
  const password = elements["login-password"].value;
  if (email !== DEMO_LOGIN.email || password !== DEMO_LOGIN.password) {
    elements["login-message"].textContent = "E-mail ou senha incorretos. Confira o acesso de demonstração abaixo.";
    elements["login-message"].hidden = false;
    elements["login-password"].focus();
    return;
  }
  try {
    sessionStorage.setItem(LOGIN_SESSION_KEY, "active");
  } catch {
    // O acesso continua nesta aba mesmo quando o navegador bloqueia o armazenamento local.
  }
  elements["login-message"].hidden = true;
  elements["login-password"].value = "";
  showDashboard();
}

function handleLogout() {
  try {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
  } catch {
    // A tela de login ainda volta nesta aba se o armazenamento estiver indisponível.
  }
  elements["login-password"].value = "";
  elements["login-message"].hidden = true;
  showLogin();
  elements["login-email"].focus();
}

function showLogin() {
  elements["app-shell"].hidden = true;
  elements["login-screen"].hidden = false;
}

function showDashboard() {
  elements["login-screen"].hidden = true;
  elements["app-shell"].hidden = false;
  render();
}

function normalizeSearch(value) {
  return String(value).toLocaleLowerCase(LOCALE).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function applyGallerySearch(searchTerms) {
  clearFilterValues();
  state.quickSearchTerms = searchTerms.split("|").map(term => normalizeSearch(term.trim())).filter(Boolean);
  elements["table-search"].value = searchTerms.split("|")[0].trim();
  state.page = 1;
  render();
  elements["painel-vendas"].scrollIntoView({ behavior: "smooth", block: "start" });
}

function restoreGalleryPhotos() {
  try {
    const savedPhotos = JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedPhotos)) return;
    savedPhotos.forEach((photo, index) => {
      const image = document.getElementById(`gallery-image-${index + 1}`);
      if (image && typeof photo === "string" && photo.startsWith("data:image/")) setGalleryImage(image, photo, true);
    });
    if (savedPhotos.some(photo => typeof photo === "string" && photo.startsWith("data:image/"))) {
      elements["gallery-message"].textContent = "Fotos personalizadas salvas neste navegador.";
    }
  } catch {
    elements["gallery-message"].textContent = "Escolha fotos para personalizar a vitrine neste navegador.";
  }
}

async function saveGalleryPhoto(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
    elements["gallery-message"].textContent = file.size > MAX_PHOTO_BYTES
      ? "A foto precisa ter até 15 MB."
      : "Escolha uma foto JPG, PNG, WebP ou AVIF.";
    input.value = "";
    return;
  }

  try {
    const dataUrl = await compressPhoto(file);
    const image = document.getElementById(input.id.replace("gallery-upload-", "gallery-image-"));
    setGalleryImage(image, dataUrl, true);
    const savedPhotos = readSavedGalleryPhotos();
    savedPhotos[Number(input.id.slice(-1)) - 1] = dataUrl;
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(savedPhotos));
    elements["gallery-message"].textContent = "Foto atualizada e salva neste navegador. Nada foi enviado.";
  } catch {
    elements["gallery-message"].textContent = "Não foi possível salvar a foto neste navegador. Tente uma imagem menor.";
  }
}

function readSavedGalleryPhotos() {
  try {
    const saved = JSON.parse(localStorage.getItem(GALLERY_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const photo = new Image();
    photo.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, 1400 / photo.width, 1000 / photo.height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(photo.width * scale));
      canvas.height = Math.max(1, Math.round(photo.height * scale));
      canvas.getContext("2d").drawImage(photo, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) resolve(blobToDataUrl(blob));
        else canvas.toBlob(jpeg => jpeg ? resolve(blobToDataUrl(jpeg)) : reject(new Error("Falha ao comprimir a foto")), "image/jpeg", .82);
      }, "image/webp", .82);
    };
    photo.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Falha ao abrir a foto")); };
    photo.src = objectUrl;
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao preparar a foto"));
    reader.readAsDataURL(blob);
  });
}

function setGalleryImage(image, source, isCustom) {
  image.src = source;
  image.alt = isCustom ? "Foto personalizada da vitrine Gustmann" : image.dataset.defaultAlt;
  image.closest(".gallery-card").classList.toggle("has-custom-photo", isCustom);
}

function resetGalleryPhotos() {
  let removed = true;
  try {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
  } catch {
    removed = false;
  }
  document.querySelectorAll(".gallery-card img").forEach(image => setGalleryImage(image, image.dataset.defaultSrc, false));
  document.querySelectorAll(".gallery-card input[type='file']").forEach(input => { input.value = ""; });
  elements["gallery-message"].textContent = removed
    ? "Fotos ilustrativas restauradas. Personalize a vitrine quando quiser."
    : "As fotos originais voltaram nesta sessão; o navegador não permitiu limpar a preferência salva.";
}

function toggleTheme() {
  const isNight = document.body.classList.toggle("theme-night");
  elements["theme-toggle"].setAttribute("aria-pressed", String(isNight));
  elements["theme-toggle"].setAttribute("aria-label", isNight ? "Ativar modo claro" : "Ativar modo noturno");
  elements["theme-icon"].textContent = isNight ? "☀" : "☾";
  elements["theme-label"].textContent = isNight ? "Modo claro" : "Modo noturno";
  document.querySelector('meta[name="theme-color"]').content = isNight ? "#15110d" : "#fff9f0";
  renderCharts(getFilteredRows());
}

function importCsvFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!window.Papa) {
    showImportError("Não foi possível carregar o leitor de CSV. Confira sua conexão com a internet e atualize a página.");
    return;
  }
  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    delimiter: "",
    complete: result => {
      try {
        const normalized = normalizeRows(result.data);
        state.rows = normalized.rows;
        state.invalid = normalized.invalid;
        state.missing = normalized.missing;
        state.sourceName = file.name;
        state.isDemo = false;
        state.page = 1;
        elements["data-notice"].hidden = true;
        elements["import-message"].hidden = true;
        refreshFilterOptions();
        clearFilterValues();
        render();
        renderQuality(result.errors);
      } catch (error) {
        showImportError(error.message);
      }
    },
    error: error => showImportError(`Não foi possível ler o arquivo: ${error.message}`)
  });
}

function parseCsvText(text) {
  if (window.Papa) {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: "greedy", dynamicTyping: false });
    return normalizeRows(parsed.data);
  }
  // Mantém a demonstração visível mesmo se a biblioteca externa estiver indisponível.
  const lines = text.trim().replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim());
  const headers = parseCsvLine(lines.shift(), ",");
  const rows = lines.map(line => Object.fromEntries(parseCsvLine(line, ",").map((value, index) => [headers[index], value])));
  return normalizeRows(rows);
}

function parseCsvLine(line, delimiter) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') { value += '"'; index++; }
    else if (character === '"') quoted = !quoted;
    else if (character === delimiter && !quoted) { values.push(value); value = ""; }
    else value += character;
  }
  values.push(value);
  return values;
}

// Este assistente faz cálculos locais e previsíveis; não envia planilhas a um modelo externo.
function resetAssistantDemo() {
  const parsed = parseAssistantCsvText(CSV_DEMONSTRACAO);
  setAssistantDataset(parsed.rows, "Demonstração fictícia do painel", { isDemo: true });
  elements["assistant-file"].value = "";
}

function parseAssistantCsvText(text) {
  if (window.Papa) {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: "greedy", dynamicTyping: false });
    return { rows: parsed.data, columns: parsed.meta.fields || [] };
  }
  const lines = text.trim().replace(/^\uFEFF/, "").split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return { rows: [], columns: [] };
  const delimiter = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ";" : ",";
  const columns = parseCsvLine(lines[0], delimiter).map(value => value.trim());
  const rows = lines.slice(1).map(line => Object.fromEntries(parseCsvLine(line, delimiter).map((value, index) => [columns[index], value])));
  return { rows, columns };
}

function importAssistantFile(event) {
  const file = event.currentTarget.files[0];
  if (!file) return;
  const extension = file.name.split(".").pop().toLocaleLowerCase(LOCALE);
  if (extension === "pbix") {
    setAssistantError("O arquivo .pbix contém um relatório/modelo do Power BI, não uma planilha tabular. No Power BI, use ... > Exportar dados e salve como CSV ou Excel; depois carregue esse arquivo aqui.");
    event.currentTarget.value = "";
    return;
  }
  if (extension === "csv") {
    importAssistantCsv(file);
    return;
  }
  if (!["xlsx", "xls"].includes(extension)) {
    setAssistantError("Formato não reconhecido. Escolha um arquivo CSV, XLSX ou XLS. Para o Power BI, exporte os dados do visual primeiro.");
    event.currentTarget.value = "";
    return;
  }
  if (!window.XLSX) {
    setAssistantError("O leitor Excel não carregou. Confira a conexão com a internet e atualize a página.");
    return;
  }
  file.arrayBuffer().then(buffer => {
    const workbook = window.XLSX.read(buffer, { type: "array", cellDates: false });
    if (!workbook.SheetNames.length) throw new Error("O arquivo não contém abas para ler.");
    assistantData.workbook = workbook;
    assistantData.source = file.name;
    elements["assistant-sheet"].replaceChildren(...workbook.SheetNames.map(name => new Option(name, name)));
    elements["assistant-sheet-wrap"].hidden = workbook.SheetNames.length < 2;
    loadAssistantWorksheet(workbook.SheetNames[0]);
  }).catch(error => setAssistantError(`Não consegui abrir essa planilha Excel: ${error.message}`));
}

function importAssistantCsv(file) {
  if (!window.Papa) {
    file.text().then(text => {
      const parsed = parseAssistantCsvText(text);
      acceptAssistantRows(parsed.rows, parsed.columns, file.name);
    }).catch(error => setAssistantError(`Não consegui ler o CSV: ${error.message}`));
    return;
  }
  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    complete: result => acceptAssistantRows(result.data, result.meta.fields || [], file.name, result.errors.length),
    error: error => setAssistantError(`Não consegui ler o CSV: ${error.message}`)
  });
}

function loadAssistantWorksheet(sheetName) {
  if (!assistantData.workbook || !sheetName) return;
  try {
    const sheet = assistantData.workbook.Sheets[sheetName];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false, dateNF: "dd/mm/yyyy", blankrows: false });
    acceptAssistantRows(rows, rows.length ? Object.keys(rows[0]) : [], assistantData.source, 0, {
      workbook: assistantData.workbook,
      activeSheet: sheetName
    });
  } catch (error) {
    setAssistantError(`Não consegui ler a aba “${sheetName}”: ${error.message}`);
  }
}

function acceptAssistantRows(rows, columns, source, parseWarnings = 0, options = {}) {
  const cleanRows = rows.filter(row => row && Object.values(row).some(value => String(value ?? "").trim() !== ""));
  const usefulColumns = columns.length ? columns : (cleanRows.length ? Object.keys(cleanRows[0]) : []);
  if (!cleanRows.length || !usefulColumns.length) {
    setAssistantError("Não encontrei linhas de dados. Confira se a primeira linha contém os nomes das colunas.");
    return;
  }
  setAssistantDataset(cleanRows, source, { ...options, columns: usefulColumns, parseWarnings });
}

function setAssistantDataset(rows, source, options = {}) {
  const columns = options.columns || (rows.length ? Object.keys(rows[0]) : []);
  const prepared = rows.map(row => ({ ...row }));
  const normalizedColumns = columns.map(String);
  const amountExists = normalizedColumns.some(column => /(faturamento|receita|valor total|total venda|\btotal\b|revenue|amount)/i.test(normalizeAssistantText(column)));
  const quantityColumn = normalizedColumns.find(column => /^(quantidade( vendida)?|qtd\.?|qtde\.?|unidades|units?)$/i.test(normalizeAssistantText(column)));
  const priceColumn = normalizedColumns.find(column => /(preco unitario|valor unitario|unit price)/i.test(normalizeAssistantText(column)));
  let addedCalculation = false;
  if (!amountExists && quantityColumn && priceColumn) {
    let calculatedColumn = "Faturamento calculado (quantidade × preço)";
    while (normalizedColumns.includes(calculatedColumn)) calculatedColumn += " *";
    normalizedColumns.push(calculatedColumn);
    prepared.forEach(row => {
      const quantity = assistantParseNumber(row[quantityColumn]);
      const price = assistantParseNumber(row[priceColumn]);
      row[calculatedColumn] = quantity === null || price === null ? "" : quantity * price;
    });
    addedCalculation = true;
  }

  assistantData.rows = prepared;
  assistantData.columns = normalizedColumns;
  assistantData.source = source;
  assistantData.workbook = options.workbook || null;
  assistantData.activeSheet = options.activeSheet || "";
  elements["assistant-sheet-wrap"].hidden = !assistantData.workbook || assistantData.workbook.SheetNames.length < 2;
  elements["assistant-dataset-status"].classList.remove("is-error");
  const sourceLabel = options.isDemo ? "BASE FICTÍCIA" : "PLANILHA CARREGADA";
  const sheetLabel = assistantData.activeSheet ? ` · Aba: ${assistantData.activeSheet}` : "";
  const calculationLabel = addedCalculation ? " · faturamento calculado por quantidade × preço" : "";
  const warningLabel = options.parseWarnings ? ` · ${number.format(options.parseWarnings)} aviso(s) de leitura` : "";
  elements["assistant-dataset-status"].textContent = `${sourceLabel} · ${source} · ${number.format(prepared.length)} linhas · ${number.format(normalizedColumns.length)} colunas${sheetLabel}${calculationLabel}${warningLabel}`;
  elements["assistant-demo-button"].disabled = Boolean(options.isDemo);
  elements["assistant-messages"].replaceChildren();
  const greeting = options.isDemo
    ? `Olá! Estou pronta para explorar ${number.format(prepared.length)} linhas da demonstração fictícia da Gustmann. Você também pode abrir um CSV ou uma planilha Excel para fazer perguntas sobre os seus dados.`
    : `Planilha lida: ${number.format(prepared.length)} linhas e ${number.format(normalizedColumns.length)} colunas${sheetLabel}. Faça uma pergunta; seus dados continuam somente neste navegador.`;
  appendAssistantMessage("assistant", greeting);
  elements["assistant-question"].focus({ preventScroll: true });
}

function setAssistantError(message) {
  elements["assistant-dataset-status"].classList.add("is-error");
  elements["assistant-dataset-status"].textContent = message;
  appendAssistantMessage("assistant", message);
}

function appendAssistantMessage(type, text) {
  const message = document.createElement("article");
  message.className = `assistant-message assistant-message-${type}`;
  const avatar = document.createElement("span");
  avatar.className = "assistant-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = type === "assistant" ? "G" : "Você";
  const content = document.createElement("div");
  content.className = "assistant-message-content";
  const label = document.createElement("strong");
  label.textContent = type === "assistant" ? "Assistente Gustmann" : "Você";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  content.append(label, paragraph);
  message.append(avatar, content);
  elements["assistant-messages"].append(message);
  elements["assistant-messages"].scrollTop = elements["assistant-messages"].scrollHeight;
}

function submitAssistantQuestion() {
  const question = elements["assistant-question"].value.trim();
  if (!question) return;
  appendAssistantMessage("user", question);
  elements["assistant-question"].value = "";
  appendAssistantMessage("assistant", answerAssistantQuestion(question));
}

function answerAssistantQuestion(question) {
  if (!assistantData.rows.length) return "Carregue primeiro um arquivo CSV ou Excel com uma linha de cabeçalho.";
  const normalizedQuestion = normalizeAssistantText(question);
  const rows = assistantData.rows;
  const columns = assistantData.columns;
  if (/(quais|liste|mostre|nomes das) (sao|estao) (as )?(colunas|campos)|colunas da planilha|campos da planilha/.test(normalizedQuestion)) {
    return `Encontrei ${number.format(columns.length)} colunas: ${columns.join(", ")}. Há ${number.format(rows.length)} linhas carregadas.`;
  }

  const matchedRows = filterAssistantRows(normalizedQuestion, rows, columns);
  if (/(vazios|vazias|faltantes|ausentes|dados faltando|campos em branco)/.test(normalizedQuestion)) {
    const field = findAssistantMentionedColumn(normalizedQuestion, columns);
    const checkColumns = field ? [field] : columns;
    const counts = checkColumns.map(column => ({ column, missing: matchedRows.filter(row => row[column] == null || String(row[column]).trim() === "").length })).filter(item => item.missing > 0);
    if (!counts.length) return `Não encontrei campos vazios nas ${number.format(matchedRows.length)} linhas analisadas. Valores iguais a zero foram preservados como zero.`;
    return `Campos vazios encontrados em ${number.format(matchedRows.length)} linhas analisadas:\n${counts.map(item => `• ${item.column}: ${number.format(item.missing)} vazio(s)`).join("\n")}\nZeros não são tratados como campos vazios.`;
  }
  if (!matchedRows.length) return "Não encontrei linhas para esse recorte. Confira se o valor citado existe na planilha.";

  if (/(quantas|quantos) (linhas|registros|vendas|pedidos)|numero de (linhas|registros|vendas|pedidos)|total de (linhas|registros)|contagem de (linhas|registros)/.test(normalizedQuestion)) {
    return `Há ${number.format(matchedRows.length)} linhas${matchedRows.length === rows.length ? "" : ` neste recorte (de ${number.format(rows.length)} no arquivo)`}.`;
  }
  if (/(quais|liste|mostre|exiba) (algumas )?(linhas|registros|primeiras linhas)/.test(normalizedQuestion)) {
    const sample = matchedRows.slice(0, 5).map(row => columns.slice(0, 5).map(column => `${column}: ${row[column] ?? "vazio"}`).join(" · "));
    return `Aqui estão até cinco linhas${matchedRows.length > 5 ? " de exemplo" : ""}:\n${sample.map(line => `• ${line}`).join("\n")}`;
  }

  const numericColumns = getAssistantNumericColumns(matchedRows, columns);
  const groupColumn = findAssistantGroupColumn(normalizedQuestion, columns, numericColumns);
  const distinctIntent = /(quantos|quantas|numero de|número de|diferentes|distintos|distintas|unicos|unicas)/.test(normalizedQuestion);
  if (groupColumn && distinctIntent && !/(maior|menor|mais|menos|top|ranking|faturamento|receita|valor|soma|media|média)/.test(normalizedQuestion)) {
    const distinctValues = new Set(matchedRows.map(row => String(row[groupColumn] ?? "").trim()).filter(Boolean));
    return `Encontrei ${number.format(distinctValues.size)} valores diferentes na coluna “${groupColumn}” em ${number.format(matchedRows.length)} linhas.`;
  }
  if (!numericColumns.length) return `Não encontrei uma coluna numérica confiável para esse cálculo. Colunas disponíveis: ${columns.join(", ")}.`;

  const measure = chooseAssistantMeasure(normalizedQuestion, numericColumns);
  if (groupColumn) return summarizeAssistantGroups(normalizedQuestion, matchedRows, groupColumn, measure);
  if (/(media|média|medio|médio|average)/.test(normalizedQuestion)) {
    const values = matchedRows.map(row => assistantParseNumber(row[measure])).filter(value => value !== null);
    if (!values.length) return `Não há valores numéricos preenchidos na coluna “${measure}” para calcular a média.`;
    return `A média de “${measure}” é ${formatAssistantMeasure(values.reduce((sum, value) => sum + value, 0) / values.length, measure)}, considerando ${number.format(values.length)} valores válidos.`;
  }
  if (/(maior|maximo|maximo|máximo|maior valor)/.test(normalizedQuestion)) return describeAssistantExtreme(matchedRows, measure, true);
  if (/(menor|minimo|mínimo|menor valor)/.test(normalizedQuestion)) return describeAssistantExtreme(matchedRows, measure, false);
  const values = matchedRows.map(row => assistantParseNumber(row[measure])).filter(value => value !== null);
  if (!values.length) return `Não há valores numéricos preenchidos na coluna “${measure}” para calcular.`;
  const total = values.reduce((sum, value) => sum + value, 0);
  return `A soma de “${measure}” é ${formatAssistantMeasure(total, measure)}, considerando ${number.format(values.length)} valores numéricos em ${number.format(matchedRows.length)} linhas${matchedRows.length === rows.length ? "" : ` (de ${number.format(rows.length)} no arquivo)`}.`;
}

function normalizeAssistantText(value) {
  return String(value ?? "").toLocaleLowerCase(LOCALE).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[_-]+/g, " ").replace(/[^\p{L}\p{N}.]+/gu, " ").trim().replace(/\s+/g, " ");
}

function assistantParseNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (value == null || String(value).trim() === "") return null;
  let text = String(value).trim().replace(/\s/g, "").replace(/R\$/i, "").replace(/[^\d,().+-]/g, "");
  const isNegative = /^\(.*\)$/.test(text);
  text = text.replace(/[()]/g, "");
  if (!/\d/.test(text)) return null;
  const comma = text.lastIndexOf(",");
  const dot = text.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    text = comma > dot ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
  } else if (comma >= 0) {
    text = text.replace(/\./g, "").replace(/,(?=.*[,])/g, "").replace(",", ".");
  } else if ((text.match(/\./g) || []).length > 1) {
    const lastDot = text.lastIndexOf(".");
    text = /\.\d{1,2}$/.test(text) ? `${text.slice(0, lastDot).replace(/\./g, "")}${text.slice(lastDot)}` : text.replace(/\./g, "");
  }
  const parsed = Number(text);
  if (!Number.isFinite(parsed)) return null;
  return isNegative ? -Math.abs(parsed) : parsed;
}

function filterAssistantRows(question, rows, columns) {
  const filters = [];
  columns.forEach(column => {
    const values = new Set(rows.map(row => String(row[column] ?? "").trim()).filter(value => value.length >= 3));
    if (values.size > 500) return;
    values.forEach(value => {
      const normalizedValue = normalizeAssistantText(value);
      if (normalizedValue && question.includes(normalizedValue)) filters.push([column, normalizedValue]);
    });
  });
  return rows.filter(row => filters.every(([column, value]) => normalizeAssistantText(row[column]).includes(value)));
}

function findAssistantMentionedColumn(question, columns) {
  return [...columns].sort((a, b) => normalizeAssistantText(b).length - normalizeAssistantText(a).length)
    .find(column => normalizeAssistantText(column).length > 2 && question.includes(normalizeAssistantText(column)));
}

function getAssistantNumericColumns(rows, columns) {
  return columns.filter(column => {
    if (/(^| )(data|dia|date|codigo|cep|telefone|id)( |$)/.test(normalizeAssistantText(column))) return false;
    const values = rows.map(row => row[column]).filter(value => value != null && String(value).trim() !== "");
    if (!values.length) return false;
    const numericCount = values.filter(value => assistantParseNumber(value) !== null).length;
    return numericCount / values.length >= 0.5;
  });
}

function chooseAssistantMeasure(question, numericColumns) {
  const mentioned = findAssistantMentionedColumn(question, numericColumns);
  if (mentioned) return mentioned;
  const quantityQuestion = /(quantidade|unidades|estoque|qtd|mais vendidos?|mais vendeu|vendeu mais|mais comprou)/.test(question);
  const targetWords = quantityQuestion
    ? ["quantidade", "unidade", "qtd", "estoque"]
    : ["faturamento", "receita", "revenue", "amount", "valor total", "total venda", "venda", "preco unitario", "preco"];
  const matched = targetWords.map(word => numericColumns.find(column => normalizeAssistantText(column).includes(word))).find(Boolean);
  return matched || numericColumns[0];
}

function findAssistantGroupColumn(question, columns, numericColumns) {
  const groupSynonyms = [
    ["categoria", "tipo", "grupo"], ["produto", "item"], ["cliente", "estabelecimento"],
    ["periodo", "turno"], ["pagamento", "forma de pagamento"], ["regiao", "cidade", "estado", "loja"],
    ["canal", "vendedor", "fornecedor", "marca"]
  ];
  const textColumns = columns.filter(column => !numericColumns.includes(column));
  for (const column of textColumns) {
    const normalizedColumn = normalizeAssistantText(column);
    if (normalizedColumn.length > 2 && question.includes(normalizedColumn)) return column;
  }
  for (const synonyms of groupSynonyms) {
    if (!synonyms.some(word => question.includes(word))) continue;
    const matchingColumn = textColumns.find(column => synonyms.some(word => normalizeAssistantText(column).includes(word)));
    if (matchingColumn) return matchingColumn;
  }
  return null;
}

function summarizeAssistantGroups(question, rows, groupColumn, measure) {
  const average = /(media|média|medio|médio|average)/.test(question);
  const count = /(quantos|quantas|contagem|numero de|total de (linhas|registros))/.test(question);
  const groups = new Map();
  rows.forEach(row => {
    const name = String(row[groupColumn] ?? "").trim() || "Não informado";
    if (!groups.has(name)) groups.set(name, { sum: 0, count: 0, lines: 0 });
    const group = groups.get(name);
    group.lines++;
    const value = assistantParseNumber(row[measure]);
    if (value !== null) { group.sum += value; group.count++; }
  });
  const data = [...groups].map(([name, group]) => ({ name, value: count ? group.lines : average ? group.sum / (group.count || 1) : group.sum, lines: group.lines }))
    .sort((a, b) => b.value - a.value);
  if (!data.length) return `Não encontrei valores agrupados pela coluna “${groupColumn}”.`;
  const ranking = /(top|ranking|quais|liste|compar|maiores|mais)/.test(question) ? data.slice(0, 5) : data.slice(0, 1);
  const label = count ? "linhas" : average ? `média de ${measure}` : `soma de ${measure}`;
  const details = ranking.map((item, index) => `${index + 1}. ${item.name}: ${count ? number.format(item.value) : formatAssistantMeasure(item.value, measure)}${count ? " linhas" : ""}`).join("\n");
  return `${ranking.length === 1 ? `Maior resultado por “${groupColumn}” (${label})` : `Ranking por “${groupColumn}” (${label})`}:\n${details}\nCom base em ${number.format(rows.length)} linhas; valores numéricos vazios foram ignorados.`;
}

function describeAssistantExtreme(rows, measure, highest) {
  const values = rows.map(row => ({ value: assistantParseNumber(row[measure]), row })).filter(item => item.value !== null);
  if (!values.length) return `Não há valores numéricos preenchidos na coluna “${measure}” para comparar.`;
  const result = values.reduce((best, item) => highest ? (item.value > best.value ? item : best) : (item.value < best.value ? item : best));
  const otherFields = Object.entries(result.row).filter(([column]) => column !== measure).slice(0, 3).map(([column, value]) => `${column}: ${value || "vazio"}`).join(" · ");
  return `O ${highest ? "maior" : "menor"} valor em “${measure}” é ${formatAssistantMeasure(result.value, measure)}${otherFields ? ` (${otherFields})` : ""}.`;
}

function formatAssistantMeasure(value, column) {
  return /(faturamento|receita|valor|preco|venda|total|revenue|amount)/i.test(normalizeAssistantText(column)) ? currency.format(value) : number.format(value);
}

// Identifica colunas pelos nomes mais comuns e normaliza o conteúdo para os cálculos.
function normalizeRows(rawRows) {
  if (!rawRows.length) throw new Error("O CSV não contém registros. Confira o cabeçalho e as linhas do arquivo.");
  const headers = Object.keys(rawRows[0]);
  const mapped = {};
  Object.entries(aliases).forEach(([field, names]) => {
    mapped[field] = headers.find(header => names.includes(normalizeHeader(header)));
  });
  const required = ["data", "quantidade", "precoUnitario"];
  const missingHeaders = required.filter(field => !mapped[field]);
  if (missingHeaders.length) {
    const labels = { data: "Data", quantidade: "Quantidade", precoUnitario: "Preço_Unitario" };
    throw new Error(`Não encontrei as colunas obrigatórias: ${missingHeaders.map(field => labels[field]).join(", ")}. Consulte o formato esperado no README.md.`);
  }

  const invalid = { descartadas: 0, dataAusente: 0, dataInvalida: 0, quantidadeAusente: 0, quantidadeInvalida: 0, precoAusente: 0, precoInvalido: 0 };
  const missing = { cliente: 0, periodo: 0, produto: 0, categoria: 0, formaPagamento: 0 };
  const rows = [];
  rawRows.forEach((raw, index) => {
    const dateText = valueOf(raw, mapped.data);
    const quantityText = valueOf(raw, mapped.quantidade);
    const priceText = valueOf(raw, mapped.precoUnitario);
    const parsedDate = parseDate(dateText);
    const quantity = parseNumber(quantityText);
    const price = parseNumber(priceText);
    let valid = true;
    if (!dateText) { invalid.dataAusente++; valid = false; }
    else if (!parsedDate) { invalid.dataInvalida++; valid = false; }
    if (!quantityText) { invalid.quantidadeAusente++; valid = false; }
    else if (quantity === null || quantity < 0) { invalid.quantidadeInvalida++; valid = false; }
    if (!priceText) { invalid.precoAusente++; valid = false; }
    else if (price === null || price < 0) { invalid.precoInvalido++; valid = false; }
    if (!valid) { invalid.descartadas++; return; }

    const client = valueOf(raw, mapped.cliente) || "Não informado";
    const period = valueOf(raw, mapped.periodo) || "Não informado";
    const product = valueOf(raw, mapped.produto) || "Não informado";
    const category = valueOf(raw, mapped.categoria) || "Não informado";
    const payment = valueOf(raw, mapped.formaPagamento) || "Não informado";
    if (client === "Não informado") missing.cliente++;
    if (period === "Não informado") missing.periodo++;
    if (product === "Não informado") missing.produto++;
    if (category === "Não informado") missing.categoria++;
    if (payment === "Não informado") missing.formaPagamento++;
    rows.push({ data: parsedDate.iso, timestamp: parsedDate.timestamp, cliente: client, periodo: period, produto: product, categoria: category, quantidade: quantity, precoUnitario: price, formaPagamento: payment, faturamento: quantity * price, sourceIndex: index });
  });
  return { rows, invalid, missing };
}

function normalizeHeader(value) { return String(value).trim().toLocaleLowerCase(LOCALE).replace(/\s+/g, " "); }
function valueOf(row, header) { return header ? String(row[header] ?? "").trim() : ""; }

function parseDate(value) {
  const text = String(value).trim();
  let year, month, day;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) [, year, month, day] = match;
  else {
    match = text.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
    if (!match) return null;
    [, day, month, year] = match;
  }
  year = Number(year); month = Number(month); day = Number(day);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, timestamp: date.getTime() };
}

// Aceita números com vírgula decimal (padrão BR) ou ponto decimal.
function parseNumber(value) {
  const text = String(value).trim().replace(/R\$|\s/g, "");
  if (!text) return null;
  let normalized = text;
  if (text.includes(",") && text.includes(".")) normalized = text.lastIndexOf(",") > text.lastIndexOf(".") ? text.replace(/\./g, "").replace(",", ".") : text.replace(/,/g, "");
  else if (text.includes(",")) normalized = text.replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

function refreshFilterOptions() {
  fillSelect(elements["customer-filter"], uniqueValues("cliente"), "Todos os clientes");
  fillSelect(elements["period-filter"], uniqueValues("periodo"), "Todos os períodos");
  fillSelect(elements["category-filter"], uniqueValues("categoria"), "Todas as categorias");
  fillSelect(elements["payment-filter"], uniqueValues("formaPagamento"), "Todas as formas");
}
function uniqueValues(key) { return [...new Set(state.rows.map(row => row[key]))].sort((a, b) => a.localeCompare(b, LOCALE)); }
function fillSelect(select, values, placeholder) {
  select.replaceChildren(new Option(placeholder, ""));
  values.forEach(value => select.add(new Option(value, value)));
}

function getFilteredRows() {
  const from = elements["date-from"].value ? Date.parse(`${elements["date-from"].value}T00:00:00Z`) : null;
  const to = elements["date-to"].value ? Date.parse(`${elements["date-to"].value}T23:59:59Z`) : null;
  const category = elements["category-filter"].value;
  const payment = elements["payment-filter"].value;
  const client = elements["customer-filter"].value;
  const period = elements["period-filter"].value;
  const typedTerms = elements["table-search"].value.split("|").map(term => normalizeSearch(term.trim())).filter(Boolean);
  const searchTerms = state.quickSearchTerms.length ? state.quickSearchTerms : typedTerms;
  return state.rows.filter(row => {
    if (from !== null && row.timestamp < from) return false;
    if (to !== null && row.timestamp > to) return false;
    if (category && row.categoria !== category) return false;
    if (payment && row.formaPagamento !== payment) return false;
    if (client && row.cliente !== client) return false;
    if (period && row.periodo !== period) return false;
    if (searchTerms.length && ![row.cliente, row.periodo, row.produto, row.categoria, row.formaPagamento].some(value => searchTerms.some(term => normalizeSearch(value).includes(term)))) return false;
    return true;
  });
}

function render() {
  const rows = getFilteredRows();
  renderMetrics(rows);
  renderCharts(rows);
  renderTable(rows);
  updatePeriodLabel(rows);
  elements["record-count"].textContent = `${number.format(rows.length)} ${rows.length === 1 ? "registro" : "registros"}`;
  elements["export-csv"].disabled = rows.length === 0;
}

function renderMetrics(rows) {
  const revenue = rows.reduce((sum, row) => sum + row.faturamento, 0);
  const units = rows.reduce((sum, row) => sum + row.quantidade, 0);
  elements["metric-revenue"].textContent = currency.format(revenue);
  elements["metric-records"].textContent = number.format(rows.length);
  elements["metric-units"].textContent = number.format(units);
  elements["metric-average"].textContent = currency.format(rows.length ? revenue / rows.length : 0);
  const morningRevenue = rows.filter(row => normalizeSearch(row.periodo) === "manha").reduce((sum, row) => sum + row.faturamento, 0);
  elements["metric-morning"].textContent = currency.format(morningRevenue);
}

function renderCharts(rows) {
  if (!window.Chart) {
    document.querySelectorAll(".chart-wrap").forEach(wrap => {
      wrap.querySelector("canvas").hidden = true;
      if (!wrap.querySelector(".chart-unavailable")) {
        const message = document.createElement("p");
        message.className = "chart-unavailable";
        message.textContent = "Conecte-se à internet para carregar os gráficos.";
        wrap.append(message);
      }
    });
    return;
  }
  const daily = new Map();
  const byCategory = new Map();
  const byCustomerAndPeriod = new Map();
  rows.forEach(row => {
    daily.set(row.data, (daily.get(row.data) || 0) + row.faturamento);
    byCategory.set(row.categoria, (byCategory.get(row.categoria) || 0) + row.faturamento);
    if (!byCustomerAndPeriod.has(row.cliente)) byCustomerAndPeriod.set(row.cliente, new Map());
    const customerPeriods = byCustomerAndPeriod.get(row.cliente);
    customerPeriods.set(row.periodo, (customerPeriods.get(row.periodo) || 0) + row.faturamento);
  });
  const sortedDays = [...daily.keys()].sort();
  const categoryRows = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const periodOrder = ["Manhã", "Tarde", "Noite"];
  const periods = [...new Set(rows.map(row => row.periodo))].sort((a, b) => {
    const indexA = periodOrder.indexOf(a);
    const indexB = periodOrder.indexOf(b);
    return (indexA < 0 ? periodOrder.length : indexA) - (indexB < 0 ? periodOrder.length : indexB) || a.localeCompare(b, LOCALE);
  });
  const customers = [...byCustomerAndPeriod.keys()].sort((a, b) => {
    const total = client => [...byCustomerAndPeriod.get(client).values()].reduce((sum, value) => sum + value, 0);
    return total(b) - total(a);
  });
  const palette = getChartPalette();
  const axisStyle = { color: palette.label, font: { family: "DM Sans", size: 10 } };
  if (state.timelineChart) state.timelineChart.destroy();
  state.timelineChart = new Chart(elements["timeline-chart"], {
    type: "line",
    data: { labels: sortedDays.map(formatDay), datasets: [{ label: "Faturamento (R$)", data: sortedDays.map(key => daily.get(key)), borderColor: palette.line, backgroundColor: palette.fill, borderWidth: 2.5, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: palette.line, tension: .32, fill: true }] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: "index" }, plugins: { legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", color: palette.label, boxWidth: 7, padding: 15, font: { family: "DM Sans", size: 10 } } }, tooltip: { callbacks: { label: item => ` ${currency.format(item.parsed.y)}` } } }, scales: { x: { grid: { display: false }, ticks: axisStyle }, y: { beginAtZero: true, grid: { color: palette.grid }, ticks: { ...axisStyle, callback: value => `R$ ${number.format(value)}` } } } }
  });
  if (state.categoryChart) state.categoryChart.destroy();
  state.categoryChart = new Chart(elements["category-chart"], {
    type: "bar",
    data: { labels: categoryRows.map(([name]) => name), datasets: [{ label: "Faturamento (R$)", data: categoryRows.map(([, value]) => value), backgroundColor: [palette.one, palette.two, palette.three, palette.four, palette.five], borderRadius: 5, maxBarThickness: 28 }] },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "rectRounded", color: palette.label, boxWidth: 8, padding: 12, font: { family: "DM Sans", size: 10 } } }, tooltip: { callbacks: { label: item => ` ${currency.format(item.parsed.x)}` } } }, scales: { x: { beginAtZero: true, grid: { color: palette.grid }, ticks: { ...axisStyle, callback: value => `R$ ${number.format(value)}` } }, y: { grid: { display: false }, ticks: axisStyle } } }
  });
  if (state.customerChart) state.customerChart.destroy();
  const periodColors = [palette.two, palette.one, palette.three, palette.four, palette.five];
  state.customerChart = new Chart(elements["customer-chart"], {
    type: "bar",
    data: {
      labels: customers,
      datasets: periods.map((period, index) => ({
        label: period,
        data: customers.map(customer => byCustomerAndPeriod.get(customer).get(period) || 0),
        backgroundColor: periodColors[index % periodColors.length],
        borderRadius: 4,
        maxBarThickness: 20
      }))
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "rectRounded", color: palette.label, boxWidth: 8, padding: 12, font: { family: "DM Sans", size: 10 } } }, tooltip: { callbacks: { label: item => ` ${item.dataset.label}: ${currency.format(item.parsed.x)}` } } }, scales: { x: { beginAtZero: true, grid: { color: palette.grid }, ticks: { ...axisStyle, callback: value => `R$ ${number.format(value)}` } }, y: { grid: { display: false }, ticks: axisStyle } } }
  });
}

function getChartPalette() {
  const styles = getComputedStyle(document.body);
  return {
    line: styles.getPropertyValue("--chart-line").trim(),
    fill: styles.getPropertyValue("--chart-fill").trim(),
    grid: styles.getPropertyValue("--chart-grid").trim(),
    label: styles.getPropertyValue("--chart-label").trim(),
    one: styles.getPropertyValue("--chart-one").trim(),
    two: styles.getPropertyValue("--chart-two").trim(),
    three: styles.getPropertyValue("--chart-three").trim(),
    four: styles.getPropertyValue("--chart-four").trim(),
    five: styles.getPropertyValue("--chart-five").trim()
  };
}

function formatDay(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function renderTable(rows) {
  const sorted = [...rows].sort((a, b) => compareRows(a, b, state.sortKey) * state.sortDirectionMultiplier);
  const pageSize = state.pageSize === "all" ? Math.max(sorted.length, 1) : Number(state.pageSize);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  state.page = Math.min(state.page, pageCount);
  const pageRows = sorted.slice((state.page - 1) * pageSize, state.page * pageSize);
  elements["sales-table-body"].replaceChildren(...pageRows.map(makeTableRow));
  const noRows = rows.length === 0;
  elements["empty-state"].hidden = !noRows;
  elements["table-scroll"].hidden = noRows;
  elements["page-label"].textContent = noRows ? "" : state.pageSize === "all" ? `${number.format(rows.length)} registros` : `Página ${state.page} de ${pageCount}`;
  elements["previous-page"].disabled = state.pageSize === "all" || state.page <= 1 || noRows;
  elements["next-page"].disabled = state.pageSize === "all" || state.page >= pageCount || noRows;
  const displayMessage = state.pageSize === "all" ? "Exibindo todos os registros." : `Exibindo até ${number.format(pageSize)} por página.`;
  elements["table-summary"].textContent = `${number.format(rows.length)} ${rows.length === 1 ? "registro corresponde" : "registros correspondem"} aos filtros${elements["table-search"].value.trim() ? " e à busca" : ""}. ${displayMessage}`;
  document.querySelectorAll("th[data-key]").forEach(th => th.setAttribute("aria-sort", th.dataset.key === state.sortKey ? (state.sortDirection === "asc" ? "ascending" : "descending") : "none"));
}

function makeTableRow(row) {
  const tr = document.createElement("tr");
  const values = [dateFormat.format(new Date(row.timestamp)), row.cliente, row.periodo, row.produto, row.categoria, number.format(row.quantidade), currency.format(row.precoUnitario), row.formaPagamento, currency.format(row.faturamento)];
  values.forEach(value => { const td = document.createElement("td"); td.textContent = value; tr.append(td); });
  return tr;
}

function compareRows(a, b, key) {
  if (key === "data") return a.timestamp - b.timestamp || a.sourceIndex - b.sourceIndex;
  if (["quantidade", "precoUnitario", "faturamento"].includes(key)) return a[key] - b[key];
  return a[key].localeCompare(b[key], LOCALE, { sensitivity: "base" });
}

function sortBy(key) {
  if (state.sortKey === key) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
  else { state.sortKey = key; state.sortDirection = "asc"; }
  state.page = 1;
  renderTable(getFilteredRows());
}
Object.defineProperty(state, "sortDirectionMultiplier", { get() { return state.sortDirection === "asc" ? 1 : -1; } });

function changePage(amount) { state.page += amount; renderTable(getFilteredRows()); }

function updatePeriodLabel(rows) {
  if (state.isDemo) { elements["period-label"].textContent = "· DADOS DE DEMONSTRAÇÃO"; return; }
  if (!rows.length) { elements["period-label"].textContent = "· SEM REGISTROS NO PERÍODO"; return; }
  const dates = rows.map(row => row.timestamp);
  const earliest = dateFormat.format(new Date(Math.min(...dates)));
  const latest = dateFormat.format(new Date(Math.max(...dates)));
  elements["period-label"].textContent = earliest === latest ? `· ${earliest}` : `· ${earliest} A ${latest}`;
}

function clearFilterValues() {
  elements["date-from"].value = "";
  elements["date-to"].value = "";
  elements["customer-filter"].value = "";
  elements["period-filter"].value = "";
  elements["category-filter"].value = "";
  elements["payment-filter"].value = "";
  elements["table-search"].value = "";
  state.quickSearchTerms = [];
}
function clearFilters() { clearFilterValues(); state.page = 1; render(); }

function exportCsv() {
  const rows = getFilteredRows();
  if (!rows.length || !window.Papa) return;
  const output = rows.map(row => ({ Data: row.data, Cliente: row.cliente, Periodo: row.periodo, Produto: row.produto, Categoria: row.categoria, Quantidade: row.quantidade, Preco_Unitario: row.precoUnitario, Forma_Pagamento: row.formaPagamento, Faturamento: row.faturamento.toFixed(2) }));
  const csv = "\uFEFF" + Papa.unparse(output, { delimiter: ";" });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vendas-filtradas.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function showImportError(message) {
  elements["import-message"].textContent = message;
  elements["import-message"].hidden = false;
  elements["csv-file"].value = "";
}

function renderQuality(parseErrors = []) {
  const totalDiscarded = state.invalid.descartadas || 0;
  elements["quality-summary"].textContent = `${number.format(state.rows.length)} linhas válidas · ${number.format(totalDiscarded)} descartadas`;
  const details = [
    `Arquivo analisado: ${state.sourceName}.`,
    `Registros aceitos: ${number.format(state.rows.length)}. Não foram removidas linhas duplicadas: cada linha foi tratada como um registro independente.`,
    ...Object.entries(state.invalid).filter(([reason, count]) => reason !== "descartadas" && count > 0).map(([reason, count]) => `${number.format(count)} ocorrência(s): ${reasonLabel(reason)}.`),
    ...Object.entries(state.missing).filter(([, count]) => count > 0).map(([field, count]) => `${number.format(count)} registro(s) mantido(s) com ${fieldLabel(field)} ausente; o campo aparece como “Não informado”.`),
    ...(parseErrors.length ? [`O Papa Parse identificou ${number.format(parseErrors.length)} aviso(s) de leitura no CSV.`] : []),
    ...(totalDiscarded === 0 ? ["Nenhuma linha foi descartada por data ou número inválido/ausente."] : ["Uma linha com mais de um problema é contada uma única vez como descartada; as ocorrências por campo podem se sobrepor."])
  ];
  const list = document.createElement("ul");
  details.forEach(detail => { const li = document.createElement("li"); li.textContent = detail; list.append(li); });
  elements["quality-content"].replaceChildren(list);
}

function reasonLabel(key) {
  return ({ dataAusente: "data ausente", dataInvalida: "data inválida", quantidadeAusente: "quantidade ausente", quantidadeInvalida: "quantidade inválida ou negativa", precoAusente: "preço unitário ausente", precoInvalido: "preço unitário inválido ou negativo" })[key];
}
function fieldLabel(key) { return ({ cliente: "cliente", periodo: "período do dia", produto: "produto", categoria: "categoria", formaPagamento: "forma de pagamento" })[key]; }
