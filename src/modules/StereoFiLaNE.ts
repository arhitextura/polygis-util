/*---------------------------------------------------------------------------
author: ROMPOS
owner: Centrul National de Cartografiere
source: https://rompos.ro/index.php/informatii-tehnice/transdatro/send/2-software/52-transdatro-cod-sursa-v1-04
translated to javascript by Arh. Mihalcea Bogdan Daniel
----------------------------------------------------------------------------*/
export class StereoFiLaNE {
    private a: number;
    private nf: number;
    private North: number;
    private East: number;
    constructor(ca: number, cnf: number) {
        this.a = ca;
        this.nf = cnf;
        this.North = 0;
        this.East = 0;
    }
    DoConversion1(Fi: number, La: number) {
        let br1 = (46 * Math.PI) / 180;
        let la0 = (25 * Math.PI) / 180;
        let k0 = 0.99975;

        let f = 1 / this.nf;
        let b = this.a * (1 - f);
        let ep = Math.sqrt((this.a ** 2 - b ** 2) / this.a ** 2);
        let w = Math.sqrt(1 - ep ** 2 * Math.sin(br1) ** 2);
        let raza = (this.a * (1 - ep ** 2)) / w ** 3;
        raza = Math.sqrt((raza * this.a) / w);
        let n = (ep ** 2 * Math.cos(br1) ** 4) / (1 - ep ** 2);
        n = Math.sqrt(
            1 +
                (ep *
                    ep *
                    Math.cos(br1) *
                    Math.cos(br1) *
                    Math.cos(br1) *
                    Math.cos(br1)) /
                    (1 - ep * ep)
        );
        let s1 = (1 + Math.sin(br1)) / (1 - Math.sin(br1));
        let s2 = (1 - ep * Math.sin(br1)) / (1 + ep * Math.sin(br1));
        let w1 = Math.exp(n * Math.log(s1 * Math.exp(ep * Math.log(s2))));
        let c =
            ((n + Math.sin(br1)) * (1 - (w1 - 1) / (w1 + 1))) /
            ((n - Math.sin(br1)) * (1 + (w1 - 1) / (w1 + 1)));
        let w2 = c * w1;
        let hi0 = (w2 - 1) / (w2 + 1);
        hi0 = Math.atan(hi0 / Math.sqrt(1 - hi0 * hi0));
        let sa = (1 + Math.sin(Fi)) / (1 - Math.sin(Fi));
        let sb = (1 - ep * Math.sin(Fi)) / (1 + ep * Math.sin(Fi));
        w = c * Math.exp(n * Math.log(sa * Math.exp(ep * Math.log(sb))));
        let hi = (w - 1) / (w + 1);
        hi = Math.atan(hi / Math.sqrt(1 - hi * hi));
        let lam = n * (La - la0) + la0;
        let beta =
            1 +
            Math.sin(hi) * Math.sin(hi0) +
            Math.cos(hi) * Math.cos(hi0) * Math.cos(lam - la0);
        this.East = (2 * raza * k0 * Math.cos(hi) * Math.sin(lam - la0)) / beta;
        this.North =
            (2 *
                raza *
                k0 *
                (Math.cos(hi0) * Math.sin(hi) -
                    Math.sin(hi0) * Math.cos(hi) * Math.cos(lam - la0))) /
            beta;
        this.North = this.North + 500000;
        this.East = this.East + 500000;
        return { North: this.North, East: this.East };
    }
}
