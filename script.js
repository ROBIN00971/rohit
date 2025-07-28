document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Mouse Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, .skill-card, .project-card');

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // --- Interactive Star Background ---
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');

    let stars = [];
    let mouse = {
        x: undefined,
        y: undefined
    };

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Reset mouse position when it leaves the window
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    class Star {
        constructor(x, y, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.baseX = this.x; // Keep track of original position
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10; // How much the star moves away
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;

            let directionX = 0;
            let directionY = 0;

            if (distance < maxDistance) {
                directionX = -forceDirectionX * force * this.density;
                directionY = -forceDirectionY * force * this.density;
            } else {
                // Return to base position
                directionX = (this.baseX - this.x) / 20;
                directionY = (this.baseY - this.y) / 20;
            }
            
            this.x += directionX;
            this.y += directionY;

            this.draw();
        }
    }

    function init() {
        stars = [];
        let numberOfStars = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfStars; i++) {
            let size = Math.random() * 1.5 + 0.5;
            let x = (Math.random() * (innerWidth - size * 2)) + size;
            let y = (Math.random() * (innerHeight - size * 2)) + size;
            let speedX = (Math.random() * 0.4) - 0.2;
            let speedY = (Math.random() * 0.4) - 0.2;
            stars.push(new Star(x, y, size, speedX, speedY));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
        }
    }

    init();
    animate();
    window.addEventListener('resize', init);


    // --- Scroll-triggered Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
});
