// パーティクルシステムクラス
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.mouseTimer = null;

        // 設定値
        this.config = {
            particleCount: 500,
            maxDistance: 120,
            mouseRadius: 200,
            particleSize: 2,
            particleSpeed: 0.5,
            connectionOpacity: 0.15,
            particleOpacity: 0.8
        };

        this.init();
    }

    // 初期化
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    // キャンバスサイズ調整
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // パーティクル生成
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    // イベントバインド
    bindEvents() {
        // マウス移動イベント
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isMouseMoving = true;

            // マウス停止検出
            clearTimeout(this.mouseTimer);
            this.mouseTimer = setTimeout(() => {
                this.isMouseMoving = false;
            }, 100);
        });

        // マウスエンターイベント
        document.addEventListener('mouseenter', () => {
            this.isMouseMoving = true;
        });

        // ウィンドウリサイズイベント
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // タッチイベント（モバイル対応）
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.isMouseMoving = true;

                // タッチ停止検出
                clearTimeout(this.mouseTimer);
                this.mouseTimer = setTimeout(() => {
                    this.isMouseMoving = false;
                }, 100);
            }
        });

        // タッチ開始イベント
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
                this.isMouseMoving = true;
            }
        });
    }

    // パーティクル更新
    update() {
        this.particles.forEach(particle => {
            particle.update(this.mouse, this.isMouseMoving, this.config.mouseRadius);
        });
    }

    // パーティクル描画
    draw() {
        // キャンバスクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // パーティクル間の接続線を描画
        this.drawConnections();

        // パーティクルを描画
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
    }

    // パーティクル間の接続線描画
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.maxDistance) {
                    const opacity = (1 - distance / this.config.maxDistance) * this.config.connectionOpacity;

                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    // アニメーションループ
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// パーティクルクラス
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    // パーティクル更新
    update(mouse, isMouseMoving, mouseRadius) {
        // マウスとの距離計算
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // マウスの影響を受ける範囲内の場合
        if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);

            // マウスに向かって引力を適用（強度を上げる）
            this.vx += Math.cos(angle) * force * 0.1;
            this.vy += Math.sin(angle) * force * 0.1;
        } else {
            // 元の速度に戻る復元力
            this.vx += (this.originalVx - this.vx) * 0.02;
            this.vy += (this.originalVy - this.vy) * 0.02;
        }

        // 速度制限
        const maxSpeed = 5;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > maxSpeed) {
            this.vx = (this.vx / currentSpeed) * maxSpeed;
            this.vy = (this.vy / currentSpeed) * maxSpeed;
        }

        // 位置更新
        this.x += this.vx;
        this.y += this.vy;

        // 画面端での跳ね返り
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -0.8;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -0.8;
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        }

        // 摩擦力
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    // パーティクル描画
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();

        // グロー効果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 237, 234, ${this.opacity * 0.3})`;
        ctx.fill();
    }
}

// スムーズスクロール機能
class SmoothScroll {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // ナビゲーションリンクのクリックイベント
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// インタラクション効果
class InteractionEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addScrollEffects();
    }

    // ホバー効果
    addHoverEffects() {
        const buttons = document.querySelectorAll('.btn, .work-item');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // スクロール効果
    addScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    // パフォーマンス最適化: デバイス性能に応じてパーティクル数を調整
    const isMobile = window.innerWidth < 768;
    const isLowPerformance = navigator.hardwareConcurrency < 4;

    // パーティクルシステム初期化
    const particleSystem = new ParticleSystem();

    // モバイルまたは低性能デバイスの場合はパーティクル数を減らす
    if (isMobile || isLowPerformance) {
        particleSystem.config.particleCount = 50;
        particleSystem.config.maxDistance = 80;
        particleSystem.createParticles();
    }

    // その他の機能初期化
    new SmoothScroll();
    new InteractionEffects();

    // ページ読み込み完了アニメーション
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ページ離脱時のクリーンアップ
window.addEventListener('beforeunload', () => {
    // メモリリークを防ぐためのクリーンアップ処理
    document.removeEventListener('mousemove', null);
    document.removeEventListener('resize', null);
});
