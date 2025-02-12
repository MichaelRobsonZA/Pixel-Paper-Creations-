document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.getElementById('snow-container');
    const canvas = document.createElement('canvas');
    snowContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let snowflakes = [];

    // Snowflake properties - more varied
    const flakeProperties = {
        minSize: 2,     // Minimum snowflake size
        maxSize: 5,     // Maximum snowflake size
        minSpeed: 0.5,   // Minimum fall speed
        maxSpeed: 1.5,   // Maximum fall speed
        windSpeed: 0.05,  // Base wind speed
        windVariance: 0.1, // Variance in wind speed
        alphaMin: 0.5,    // Minimum opacity
        alphaMax: 1.0     // Maximum opacity
    };

    // Snowflake class - with properties
    class Snowflake {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (flakeProperties.maxSize - flakeProperties.minSize) + flakeProperties.minSize;
            this.speedY = Math.random() * (flakeProperties.maxSpeed - flakeProperties.minSpeed) + flakeProperties.minSpeed;
            this.speedX = flakeProperties.windSpeed + (Math.random() - 0.5) * flakeProperties.windVariance; // Wind effect
            this.alpha = Math.random() * (flakeProperties.alphaMax - flakeProperties.alphaMin) + flakeProperties.alphaMin;
            this.reset(); // Initialize with reset position and properties
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -Math.random() * canvas.height; // Start above screen
            this.size = Math.random() * (flakeProperties.maxSize - flakeProperties.minSize) + flakeProperties.minSize;
            this.speedY = Math.random() * (flakeProperties.maxSpeed - flakeProperties.minSpeed) + flakeProperties.minSpeed;
            this.speedX = flakeProperties.windSpeed + (Math.random() - 0.5) * flakeProperties.windVariance;
            this.alpha = Math.random() * (flakeProperties.alphaMax - flakeProperties.alphaMin) + flakeProperties.alphaMin;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX; // Apply wind to x position

            if (this.y > canvas.height + this.size) {
                this.reset(); // Reset when off-screen
            }

            // Subtle horizontal looping effect for wind
            if (this.x > canvas.width + this.size) {
                this.x = -this.size;
            }
            if (this.x < -this.size) {
                this.x = canvas.width + this.size;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; // White with varied alpha
            ctx.fill();
        }
    }

    function createSnowflakes(num) {
        for (let i = 0; i < num; i++) {
            snowflakes.push(new Snowflake());
        }
    }

    function updateSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });
        requestAnimationFrame(updateSnow);
    }

    createSnowflakes(200); // Increased snowflake count for blizzard feel
    updateSnow();

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Mouse interaction (example - snowflakes scatter on hover - optional)
    canvas.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        snowflakes.forEach(snowflake => {
            const dx = snowflake.x - mouseX;
            const dy = snowflake.y - mouseY;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 50) { // Interaction radius
                const angle = Math.atan2(dy, dx);
                snowflake.x += Math.cos(angle) * 3; // Push away horizontally
                snowflake.y -= Math.sin(angle) * 3; // Push away vertically
            }
        });
    });
});