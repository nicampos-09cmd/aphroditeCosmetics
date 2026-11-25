/* Loja Aphrodite — catálogo e carrinho (protótipo, sem cobrança real) */
(function () {
  var PRODUTOS = [
    { id: "perfume", nome: "Perfume natural 30 ml", preco: 45, cor: "#1F3D2B",
      desc: "Fragrância concentrada de óleos essenciais de cascas cítricas e sementes, após cura controlada." },
    { id: "sabonete", nome: "Sabonete artesanal 100 g", preco: 18, cor: "#C9A227",
      desc: "Base vegetal com corante natural e pó de casca/polpa de resíduos orgânicos." },
    { id: "esfoliante", nome: "Esfoliante corporal 200 g", preco: 32, cor: "#5C8A67",
      desc: "Pó de casca e semente moídos em óleo carreador — esfoliação com ativos vegetais." },
    { id: "oleo", nome: "Óleo essencial cítrico 10 ml", preco: 28, cor: "#3E6B4C",
      desc: "Extraído por arraste a vapor de cascas cítricas descartadas por mercados e indústrias." }
  ];
  var grid = document.getElementById("produtos");
  if (!grid) return;
  var carrinho = {};
  try { carrinho = JSON.parse(localStorage.getItem("aphrodite_carrinho") || "{}"); } catch (e) {}

  function brl(n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function salvar() { try { localStorage.setItem("aphrodite_carrinho", JSON.stringify(carrinho)); } catch (e) {} }
  function achar(id) { return PRODUTOS.filter(function (p) { return p.id === id; })[0]; }

  grid.innerHTML = PRODUTOS.map(function (p) {
    return '<div class="product-card"><div class="product-visual"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="' + p.cor +
      '"/><rect x="62" y="44" width="36" height="72" rx="12" fill="#fff"/><rect x="70" y="32" width="20" height="16" rx="4" fill="#F3E6BE"/></svg></div>' +
      '<div class="product-body"><h3>' + p.nome + '</h3><p>' + p.desc + '</p>' +
      '<div class="product-price">Preço<br><strong>' + brl(p.preco) + '</strong> / unidade</div>' +
      '<button class="btn btn-primary btn-block" type="button" data-add="' + p.id + '">Adicionar ao carrinho</button></div></div>';
  }).join("");

  function render() {
    var ids = Object.keys(carrinho).filter(function (id) { return carrinho[id] > 0 && achar(id); });
    var total = 0;
    document.getElementById("cart-items").innerHTML = ids.length ? ids.map(function (id) {
      var p = achar(id), q = carrinho[id]; total += p.preco * q;
      return '<div class="cart-row"><div><strong>' + p.nome + '</strong><div class="qty"><button type="button" data-dec="' + id +
        '" aria-label="Diminuir">−</button><span>' + q + '</span><button type="button" data-inc="' + id + '" aria-label="Aumentar">+</button></div></div>' +
        '<div style="text-align:right">' + brl(p.preco * q) + '<br><button class="rm" type="button" data-rm="' + id + '">remover</button></div></div>';
    }).join("") : '<p class="cart-empty">Seu carrinho está vazio.</p>';
    document.getElementById("cart-total").textContent = brl(total);
    document.getElementById("cart-checkout").disabled = !ids.length;
    salvar();
  }

  document.addEventListener("click", function (e) {
    var t = e.target, id;
    if ((id = t.getAttribute("data-add"))) carrinho[id] = (carrinho[id] || 0) + 1;
    else if ((id = t.getAttribute("data-inc"))) carrinho[id]++;
    else if ((id = t.getAttribute("data-dec"))) carrinho[id] = Math.max(0, carrinho[id] - 1);
    else if ((id = t.getAttribute("data-rm"))) delete carrinho[id];
    else return;
    render();
  });
  document.getElementById("cart-clear").addEventListener("click", function () { carrinho = {}; render(); });
  document.getElementById("cart-checkout").addEventListener("click", function () {
    var msg = document.getElementById("cart-msg");
    msg.textContent = "Pedido recebido! (simulação — entraremos em contato para confirmar pagamento e entrega.)";
    msg.className = "form-msg show success";
    carrinho = {}; render();
  });
  render();
})();
