// Perlin noise implementation
class Perlin {
    constructor() {
        this.perm = [];
        for (let i = 0; i < 256; i++) {
            this.perm[i] = Math.floor(Math.random() * 256);
        }
        this.perm = this.perm.concat(this.perm);
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const aa = this.perm[X] + Y;
        const ab = this.perm[X + 1] + Y;
        const ba = this.perm[X] + Y + 1;
        const bb = this.perm[X + 1] + Y + 1;

        return this.lerp(v, this.lerp(u, this.grad(this.perm[aa], x, y),
            this.grad(this.perm[ab], x - 1, y)),
            this.lerp(u, this.grad(this.perm[ba], x, y - 1),
            this.grad(this.perm[bb], x - 1, y - 1)));
    }
}

const perlin = new Perlin();
