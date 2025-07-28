document.addEventListener('DOMContentLoaded', () => {
    // --- Roll the Dice ---
    const dice = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('roll-dice-btn');

    const faceTransforms = {
        1: 'rotateX(0deg) rotateY(0deg)',      // Front face
        2: 'rotateY(-90deg)',                 // Left face
        3: 'rotateX(90deg)',                  // Top face
        4: 'rotateX(-90deg)',                 // Bottom face
        5: 'rotateY(90deg)',                  // Right face
        6: 'rotateY(180deg)'                  // Back face
    };

    rollDiceBtn.addEventListener('click', () => {
        const randomRoll = Math.floor(Math.random() * 6) + 1;
        const randomX = (Math.floor(Math.random() * 4) + 4) * 360;
        const randomY = (Math.floor(Math.random() * 4) + 4) * 360;
        dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;
        
        setTimeout(() => {
            dice.style.transform = faceTransforms[randomRoll];
        }, 100);
    });

    // --- Flip the Coin (FIXED) ---
    const coin = document.getElementById('coin');
    const flipCoinBtn = document.getElementById('flip-coin-btn');
    const coinResultText = document.getElementById('coin-result-text');

    flipCoinBtn.addEventListener('click', () => {
        // Prevent clicking again while it's flipping
        flipCoinBtn.disabled = true;
        coinResultText.textContent = '';

        // Remove previous animation classes
        coin.classList.remove('animate-heads', 'animate-tails');

        // Force a browser reflow to reset the animation
        void coin.offsetWidth; 

        // Decide the outcome
        const isHeads = Math.random() < 0.5;
        
        if (isHeads) {
            coin.classList.add('animate-heads');
            setTimeout(() => {
                coinResultText.textContent = 'Heads!';
            }, 1800); // Show result near the end of the animation
        } else {
            coin.classList.add('animate-tails');
            setTimeout(() => {
                coinResultText.textContent = 'Tails!';
            }, 1800);
        }
    });
    
    // Re-enable the button after the animation finishes
    coin.addEventListener('animationend', () => {
        flipCoinBtn.disabled = false;
    });


    // --- Internet Speed Test (FIXED & IMPROVED) ---
    const speedTestBtn = document.getElementById('speed-test-btn');
    const speedDisplay = document.getElementById('speed-display');
    // Using a reliable endpoint from Cloudflare designed for speed tests
    const testFileUrl = 'https://speed.cloudflare.com/__down?bytes=';
    const fileSizeInBytes = 10 * 1024 * 1024; // 10MB

    async function runSingleTest() {
        const startTime = performance.now();
        // Add a cache-busting query parameter
        const response = await fetch(`${testFileUrl}${fileSizeInBytes}&t=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.blob(); // Wait for the download to complete
        const endTime = performance.now();

        const durationInSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = fileSizeInBytes * 8;
        const speedBps = bitsLoaded / durationInSeconds;
        const speedMbps = speedBps / (1024 * 1024);
        return speedMbps;
    }

    async function runSpeedTest() {
        speedTestBtn.disabled = true;
        speedDisplay.textContent = 'Initializing...';

        const numTests = 3; // Run the test 3 times for a better average
        let speeds = [];
        let totalSpeed = 0;

        try {
            for (let i = 0; i < numTests; i++) {
                speedDisplay.textContent = `Running test ${i + 1}/${numTests}...`;
                const speed = await runSingleTest();
                if (isFinite(speed)) {
                    speeds.push(speed);
                    totalSpeed += speed;
                }
                
                // Update display with running average
                if (speeds.length > 0) {
                    let runningAverage = totalSpeed / speeds.length;
                    speedDisplay.textContent = `Avg: ${runningAverage.toFixed(2)} Mbps`;
                }
            }

            if (speeds.length > 0) {
                const averageSpeed = totalSpeed / speeds.length;
                speedDisplay.textContent = `${averageSpeed.toFixed(2)} Mbps`;
            } else {
                 speedDisplay.textContent = "Test Failed";
            }

        } catch (error) {
            console.error("Speed test failed:", error);
            speedDisplay.textContent = "Test Failed";
        } finally {
            speedTestBtn.disabled = false;
        }
    }

    speedTestBtn.addEventListener('click', runSpeedTest);
});
