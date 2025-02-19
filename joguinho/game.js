// Configuração do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Array para armazenar as estrelas
let stars = [];

// Classe para as estrelas
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Tamanho da estrela
        this.speed = Math.random() * 0.5 + 0.2; // Velocidade de movimento
    }

    update() {
        this.y += this.speed; // Move a estrela para baixo
        if (this.y > canvas.height) { // Se a estrela sair da tela, reposiciona no topo
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Função para criar as estrelas
function createStars() {
    for (let i = 0; i < 100; i++) { // Cria 100 estrelas
        stars.push(new Star());
    }
}

// Função para atualizar e desenhar as estrelas
function drawStars() {
    stars.forEach(star => {
        star.update();
        star.draw();
    });
}

// Inicializa as estrelas
createStars();

// Posição do jogador
let player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    speed: 5,
    normalSpeed: 5,
    hasSpeedBoost: false,
    isInvincible: false,
    canAttack: false // Modo de ataque
};

// Criando os inimigos
let enemies = [
    {
        x: 400,
        y: 300,
        width: 30,
        height: 30,
        speed: 2,
        color: "blue",
        destroyed: false // Novo: estado de destruído
    },
    {
        x: 700,
        y: 500,
        width: 30,
        height: 30,
        speed: 1.5,
        color: "purple",  // Segundo inimigo em roxo para diferenciar
        destroyed: false // Novo: estado de destruído
    }
];

// Criar o objeto de áudio para a música de fundo (opcional)
const musicaFundo = new Audio("audio.mp3");
musicaFundo.loop = true;
musicaFundo.volume = 1.0;

// Power-up de velocidade
let speedPowerUp = {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20,
    active: true,
    duration: 5000 // 5 segundos de duração
};

// Power-up de invencibilidade
let invincibilityPowerUp = {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20,
    active: true,
    duration: 5000 // 5 segundos de duração
};

// Power-up de ataque
let attackPowerUp = {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20,
    active: true,
    duration: 5000 // 5 segundos de duração
};

// Função para iniciar a música ao clicar na tela
function tocarMusica() {
    musicaFundo.play().catch(error => {
        console.warn("O navegador bloqueou a reprodução automática. Clique na tela para iniciar a música.");
    });
}
document.addEventListener("click", tocarMusica);

// Definição do item coletável
let item = {
    x: Math.random() * (canvas.width - 20),
    y: Math.random() * (canvas.height - 20),
    width: 20,
    height: 20
};
let score = 0;
let vidas = 3; // Sistema de vidas

// Array para armazenar as partículas
let particulas = [];

// Classe das partículas
class Particula {
    constructor(x, y, color = "yellow") {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Capturar teclas pressionadas
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Função para ativar o power-up de velocidade
function activateSpeedPowerUp() {
    player.hasSpeedBoost = true;
    player.speed = player.normalSpeed * 2; // Dobra a velocidade
    
    // Criar efeito de partículas azuis
    for (let i = 0; i < 15; i++) {
        particulas.push(new Particula(player.x + player.width / 2, player.y + player.height / 2, "cyan"));
    }

    // Desativa o power-up após a duração
    setTimeout(() => {
        player.hasSpeedBoost = false;
        player.speed = player.normalSpeed;
    }, speedPowerUp.duration);
}

// Função para ativar o power-up de invencibilidade
function activateInvincibilityPowerUp() {
    player.isInvincible = true;

    // Criar efeito de partículas douradas
    for (let i = 0; i < 15; i++) {
        particulas.push(new Particula(player.x + player.width / 2, player.y + player.height / 2, "gold"));
    }

    // Desativa o power-up após a duração
    setTimeout(() => {
        player.isInvincible = false;
    }, invincibilityPowerUp.duration);
}

// Função para ativar o power-up de ataque
function activateAttackPowerUp() {
    player.canAttack = true;

    // Criar efeito de partículas verdes
    for (let i = 0; i < 15; i++) {
        particulas.push(new Particula(player.x + player.width / 2, player.y + player.height / 2, "lime"));
    }

    // Desativa o power-up após a duração
    setTimeout(() => {
        player.canAttack = false;
    }, attackPowerUp.duration);
}

// Função para reaparecer um inimigo após um tempo
function reappearEnemy(enemy) {
    setTimeout(() => {
        enemy.destroyed = false; // Reativa o inimigo
        enemy.x = Math.random() * (canvas.width - enemy.width); // Nova posição X
        enemy.y = Math.random() * (canvas.height - enemy.height); // Nova posição Y
    }, 5000); // Reaparece após 5 segundos
}

// Função para evitar sobreposição de inimigos
function evitarSobreposicaoInimigos() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            if (checkCollision(enemies[i], enemies[j])) {
                // Calcula a direção de afastamento
                let dx = enemies[i].x - enemies[j].x;
                let dy = enemies[i].y - enemies[j].y;

                // Normaliza a direção
                let distance = Math.sqrt(dx * dx + dy * dy);
                let overlap = (enemies[i].width + enemies[j].width) / 2 - distance;
                if (overlap > 0) {
                    let angle = Math.atan2(dy, dx);
                    let moveX = Math.cos(angle) * overlap / 2;
                    let moveY = Math.sin(angle) * overlap / 2;

                    // Move os inimigos para longe um do outro
                    enemies[i].x += moveX;
                    enemies[i].y += moveY;
                    enemies[j].x -= moveX;
                    enemies[j].y -= moveY;
                }
            }
        }
    }
}

// Função para adicionar um novo inimigo
function addNewEnemy() {
    const colors = ["blue", "purple", "red", "green", "orange"]; // Cores disponíveis para os inimigos
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Escolhe uma cor aleatória

    enemies.push({
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: Math.random() * 2 + 1, // Velocidade aleatória entre 1 e 3
        color: randomColor,
        destroyed: false
    });
}

// Atualizar posição do jogador e lógica do jogo
function update() {
    // Verifica se o jogador venceu
    if (score >= 1000) {
        alert("Você venceu! Parabéns!");
        resetGame();
        return; // Encerra a função update
    }

    // Movimentação do jogador com limites da tela
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

    // Atualizar posição dos inimigos
    enemies.forEach(enemy => {
        if (!enemy.destroyed) { // Atualiza apenas inimigos não destruídos
            if (enemy.x < player.x) enemy.x += enemy.speed;
            if (enemy.x > player.x) enemy.x -= enemy.speed;
            if (enemy.y < player.y) enemy.y += enemy.speed;
            if (enemy.y > player.y) enemy.y -= enemy.speed;
        }
    });

    // Evitar sobreposição de inimigos
    evitarSobreposicaoInimigos();

    // Checar colisão com power-up de velocidade
    if (speedPowerUp.active && checkCollision(player, speedPowerUp)) {
        speedPowerUp.active = false;
        activateSpeedPowerUp();
        
        // Reposicionar power-up após um tempo
        setTimeout(() => {
            speedPowerUp.x = Math.random() * (canvas.width - speedPowerUp.width);
            speedPowerUp.y = Math.random() * (canvas.height - speedPowerUp.height);
            speedPowerUp.active = true;
        }, 10000); // Reaparece após 10 segundos
    }

    // Checar colisão com power-up de invencibilidade
    if (invincibilityPowerUp.active && checkCollision(player, invincibilityPowerUp)) {
        invincibilityPowerUp.active = false;
        activateInvincibilityPowerUp();
        
        // Reposicionar power-up após um tempo
        setTimeout(() => {
            invincibilityPowerUp.x = Math.random() * (canvas.width - invincibilityPowerUp.width);
            invincibilityPowerUp.y = Math.random() * (canvas.height - invincibilityPowerUp.height);
            invincibilityPowerUp.active = true;
        }, 10000); // Reaparece após 10 segundos
    }

    // Checar colisão com power-up de ataque
    if (attackPowerUp.active && checkCollision(player, attackPowerUp)) {
        attackPowerUp.active = false;
        activateAttackPowerUp();
        
        // Reposicionar power-up após um tempo
        setTimeout(() => {
            attackPowerUp.x = Math.random() * (canvas.width - attackPowerUp.width);
            attackPowerUp.y = Math.random() * (canvas.height - attackPowerUp.height);
            attackPowerUp.active = true;
        }, 10000); // Reaparece após 10 segundos
    }

    // Checar colisão entre jogador e item
    if (checkCollision(player, item)) {
        score += 10;

        // Criar efeito de partículas ao coletar o item
        for (let i = 0; i < 10; i++) {
            particulas.push(new Particula(item.x + item.width / 2, item.y + item.height / 2));
        }

        // Reposiciona o item em um novo local aleatório
        item.x = Math.random() * (canvas.width - item.width);
        item.y = Math.random() * (canvas.height - item.height);

        // Adiciona um novo inimigo a cada 100 pontos
        if (score % 100 === 0) {
            addNewEnemy();
        }
    }

    // Atualiza as partículas
    for (let i = particulas.length - 1; i >= 0; i--) {
        particulas[i].update();
        if (particulas[i].alpha <= 0) {
            particulas.splice(i, 1);
        }
    }

    // Checar colisão entre jogador e inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (checkCollision(player, enemies[i])) {
            if (player.canAttack && !enemies[i].destroyed) {
                // Destrói o inimigo
                enemies[i].destroyed = true; // Marca o inimigo como destruído
                reappearEnemy(enemies[i]); // Reaparece o inimigo após um tempo
                
                // Cria partículas para o efeito de destruição
                for (let j = 0; j < 10; j++) {
                    particulas.push(new Particula(enemies[i].x + enemies[i].width / 2, enemies[i].y + enemies[i].height / 2, "red"));
                }
            } else if (!player.isInvincible && !enemies[i].destroyed) {
                vidas -= 1; // Perde uma vida
                if (vidas <= 0) {
                    // Remove os event listeners antigos antes de resetar
                    window.removeEventListener("keydown", (e) => keys[e.key] = true);
                    window.removeEventListener("keyup", (e) => keys[e.key] = false);
                    
                    alert("Game Over! Você perdeu!");
                    resetGame();
                } else {
                    // Reseta a posição do jogador após perder uma vida
                    player.x = 50;
                    player.y = 50;
                }
                break;
            }
        }
    }
}

// Função auxiliar para verificar colisões
function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Função para reiniciar o jogo
function resetGame() {
    // Reseta posições
    player.x = 50;
    player.y = 50;
    player.speed = player.normalSpeed;
    player.hasSpeedBoost = false;
    player.isInvincible = false;
    player.canAttack = false;

    // Reseta inimigos
    enemies = [
        {
            x: 400,
            y: 300,
            width: 30,
            height: 30,
            speed: 2,
            color: "blue",
            destroyed: false
        },
        {
            x: 700,
            y: 500,
            width: 30,
            height: 30,
            speed: 1.5,
            color: "purple",
            destroyed: false
        }
    ];
    
    // Reseta score e vidas
    score = 0;
    vidas = 3;
    
    // Limpa o estado das teclas
    keys = {};
    
    // Opcional: pausa breve para evitar movimento imediato após reset
    setTimeout(() => {
        window.addEventListener("keydown", (e) => keys[e.key] = true);
        window.addEventListener("keyup", (e) => keys[e.key] = false);
    }, 100);
}

// Desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as estrelas
    drawStars();

    // Desenha as partículas na tela
    particulas.forEach(p => p.draw());

    // Desenha o jogador (vermelho com efeito quando tem power-up)
    ctx.fillStyle = player.canAttack ? "lime" : (player.hasSpeedBoost ? "orangered" : (player.isInvincible ? "gold" : "red"));
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Desenha os inimigos
    enemies.forEach(enemy => {
        if (!enemy.destroyed) { // Desenha apenas inimigos não destruídos
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });

    // Desenha o item verde
    ctx.fillStyle = "green";
    ctx.fillRect(item.x, item.y, item.width, item.height);

    // Desenha o power-up de velocidade se estiver ativo
    if (speedPowerUp.active) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(speedPowerUp.x, speedPowerUp.y, speedPowerUp.width, speedPowerUp.height);
        // Desenha um raio no power-up
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(speedPowerUp.x + 5, speedPowerUp.y + 10);
        ctx.lineTo(speedPowerUp.x + 12, speedPowerUp.y + 5);
        ctx.lineTo(speedPowerUp.x + 8, speedPowerUp.y + 12);
        ctx.lineTo(speedPowerUp.x + 15, speedPowerUp.y + 15);
        ctx.stroke();
    }

    // Desenha o power-up de invencibilidade se estiver ativo
    if (invincibilityPowerUp.active) {
        ctx.fillStyle = "gold";
        ctx.fillRect(invincibilityPowerUp.x, invincibilityPowerUp.y, invincibilityPowerUp.width, invincibilityPowerUp.height);
        // Desenha um escudo no power-up
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(invincibilityPowerUp.x + 10, invincibilityPowerUp.y + 10, 10, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Desenha o power-up de ataque se estiver ativo
    if (attackPowerUp.active) {
        ctx.fillStyle = "lime";
        ctx.fillRect(attackPowerUp.x, attackPowerUp.y, attackPowerUp.width, attackPowerUp.height);
        // Desenha um ícone de espada no power-up
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(attackPowerUp.x + 5, attackPowerUp.y + 15);
        ctx.lineTo(attackPowerUp.x + 10, attackPowerUp.y + 5);
        ctx.lineTo(attackPowerUp.x + 15, attackPowerUp.y + 15);
        ctx.lineTo(attackPowerUp.x + 10, attackPowerUp.y + 10);
        ctx.stroke();
    }

    // Exibe a pontuação e as vidas
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontos: " + score, 10, 20);
    ctx.fillText("Vidas: " + vidas, 10, 45);

    // Mostra indicador de power-up ativo
    if (player.hasSpeedBoost) {
        ctx.fillStyle = "yellow";
        ctx.fillText("PODER DO SONIC!", 10, 70);
    }
    if (player.isInvincible) {
        ctx.fillStyle = "gold";
        ctx.fillText("INVENCÍVEL!", 10, 95);
    }
    if (player.canAttack) {
        ctx.fillStyle = "lime";
        ctx.fillText("ATAQUE ATIVO!", 10, 120);
    }
}

// Menu de pausa
let isPaused = false;

window.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        isPaused = !isPaused; // Alterna entre pausado e despausado
    }
});

// Loop do jogo
function gameLoop() {
    if (!isPaused) {
        update();
        draw();
    } else {
        // Desenha a tela de pausa
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Pausado", canvas.width / 2 - 80, canvas.height / 2);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Inicia o jogo