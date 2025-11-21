// Attend que le DOM (popup.html) soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    // Taille de chaque case du jeu
    const gridSize = 20;
    let score = 0;

    // Le serpent : un tableau de segments (objets {x, y})
    // Commence au milieu
    let snake = [
        { x: 10 * gridSize, y: 10 * gridSize }
    ];

    // Direction initiale
    let direction = 'right';
    let changingDirection = false; // Pour éviter les retours sur soi-même

    // La pomme
    let food = {};

    // Place une nouvelle pomme aléatoirement
    function createFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
        };
    }

    // Gère les contrôles au clavier
    function handleKeydown(e) {
        if (changingDirection) return;
        changingDirection = true;

        const keyPressed = e.key;

        if (keyPressed === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        }
        if (keyPressed === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        }
        if (keyPressed === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        }
        if (keyPressed === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        }
    }

    // Fonction principale du jeu (la boucle de jeu)
    function main() {
        // Permet de changer de direction pour le prochain "tick"
        changingDirection = false; 

        // Met à jour la position du serpent
        const head = { x: snake[0].x, y: snake[0].y };

        if (direction === 'right') head.x += gridSize;
        if (direction === 'left') head.x -= gridSize;
        if (direction === 'up') head.y -= gridSize;
        if (direction === 'down') head.y += gridSize;

        // Ajoute la nouvelle tête
        snake.unshift(head);

        // Vérifie si le serpent a mangé la pomme
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            createFood(); // Crée une nouvelle pomme
        } else {
            // Si pas de pomme mangée, enlève le dernier segment (le serpent avance)
            snake.pop();
        }

        // Vérifie les collisions
        if (checkCollision(head)) {
            // Game Over
            alert(`Game Over! Score: ${score}`);
            // Réinitialise le jeu
            snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
            direction = 'right';
            score = 0;
            scoreElement.textContent = `Score: 0`;
            createFood();
        }

        draw();
    }

    // Vérifie les collisions (murs ou serpent lui-même)
    function checkCollision(head) {
        // Collision avec les murs
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return true;
        }
        // Collision avec soi-même
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // Dessine le jeu
    function draw() {
        // Nettoie le canvas (fond)
        ctx.fillStyle = '#2c3e50'; // Couleur de fond
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessine la pomme
        ctx.fillStyle = '#e74c3c'; // Rouge
        ctx.fillRect(food.x, food.y, gridSize, gridSize);

        // Dessine le serpent
        ctx.fillStyle = '#2ecc71'; // Vert
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        });
    }

    // Initialisation
    createFood();
    document.addEventListener('keydown', handleKeydown);
    
    // Lance la boucle de jeu (100ms = 10 images par seconde)
    setInterval(main, 100);
});