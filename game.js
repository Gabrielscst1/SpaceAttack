// lsitens for clicks in start-game-btn, then removes modal from view
document.getElementById("start-game-btn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";

  gameLoop(); // Inicia o jogo
});

// lsitens for clicks in restart-game-btn, then removes endgame-dialog from view
document.getElementById("restart-game-btn").addEventListener("click", () => {
  document.getElementById("endgame-dialog").style.display = "none";

  resetGame();
});

// Configuração do canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Posição do jogador
let player = {
  x: 50,
  y: 50,
  width: 30,
  height: 30,
  speed: 5,
};

// Criando o inimigo
let enemy = {
  x: 400, // Começa no meio da tela
  y: 300,
  width: 30,
  height: 30,
  speed: 2, // Velocidade do inimigo
};

let genItem = () => {
  return {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20,
  };
};

let item = genItem();

let score = 0; // Pontuação do jogador

// // Criar o objeto de áudio para a música de fundo
// const musicaFundo = new Audio("musica.mp3");

// // Configurar a música
// musicaFundo.loop = true; // Faz a música tocar repetidamente
// musicaFundo.volume = 0.3; // Ajusta o volume (0.0 a 1.0)

// // Função para iniciar a música ao clicar na tela (evita bloqueios do navegador)
// function tocarMusica() {
//   musicaFundo.play().catch((error) => {
//     console.warn(
//       "O navegador bloqueou a reprodução automática. Clique na tela para iniciar a música."
//     );
//   });
// }

// // Iniciar a música ao clicar na tela
// document.addEventListener("click", tocarMusica);

// Capturar teclas pressionadas
let keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Atualizar posição do jogador
function update() {
  // Movimentação do jogador com limites da tela
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < canvas.height)
    player.y += player.speed;
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += player.speed;

  // Lógica do inimigo perseguindo o jogador
  if (enemy.x < player.x) enemy.x += enemy.speed;
  if (enemy.x > player.x) enemy.x -= enemy.speed;
  if (enemy.y < player.y) enemy.y += enemy.speed;
  if (enemy.y > player.y) enemy.y -= enemy.speed;

  // Checar colisão entre jogador e item
  if (
    player.x < item.x + item.width &&
    player.x + player.width > item.x &&
    player.y < item.y + item.height &&
    player.y + player.height > item.y
  ) {
    clearItem(item);

    score += 10; // Aumenta a pontuação

    item = genItem();
    drawItem(item);
    // somColeta.play(); // Comentário temporário

    // Não reposicione o item aqui
    // item.x = Math.random() * (canvas.width - item.width);
    // item.y = Math.random() * (canvas.height - item.height);
  }

  // Checar colisão entre jogador e inimigo
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    document.getElementById("endgame-dialog").style.display = "flex";
    document.getElementById("endgame-points").innerHTML = score;
    score = 0;
  }
}

// Função para reiniciar o jogo
function resetGame() {
  player.x = 50;
  player.y = 50;
  enemy.x = 400;
  enemy.y = 300;
}

// Desenhar o jogo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

  // Desenha o jogador (vermelho)
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Desenha o inimigo (azul)
  ctx.fillStyle = "blue";
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  // Exibe a pontuação
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 10, 20);
}

function clearItem(item) {
  ctx.clearRect(item.x, item.y, item.width, item.height);
}

function drawItem(item) {
  // Desenha o item (verde)
  ctx.fillStyle = "green";
  ctx.fillRect(item.x, item.y, item.width, item.height);
}

// Loop do jogo
function gameLoop() {
  update();
  draw();
  drawItem(item);
  requestAnimationFrame(gameLoop);
}
