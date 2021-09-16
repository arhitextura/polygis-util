/*---------------------------------------------------------------------------
author: ROMPOS
owner: Centrul National de Cartografiere
source: https://rompos.ro/index.php/informatii-tehnice/transdatro/send/2-software/52-transdatro-cod-sursa-v1-04
translated to javascript by Arh. Mihalcea Bogdan Daniel
----------------------------------------------------------------------------*/
export class StereoNEFiLa {
    private a: number;
    private nf: number;
    private Fi: number = 0;
    private La: number = 0;
    constructor(ca: number, cnf: number) {
        this.a = ca;
        this.nf = cnf;
        this.Fi;
        this.La;
    }
    DoConversion2(North: number, East: number) {
        this.Fi = 0;
        this.La = 0;
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
        n = Math.sqrt(1 + n);
        let s1 = (1 + Math.sin(br1)) / (1 - Math.sin(br1));
        let s2 = (1 - ep * Math.sin(br1)) / (1 + ep * Math.sin(br1));
        let w1 = Math.exp(n * Math.log(s1 * Math.exp(ep * Math.log(s2))));
        let c =
            ((n + Math.sin(br1)) * (1 - (w1 - 1) / (w1 + 1))) /
            ((n - Math.sin(br1)) * (1 + (w1 - 1) / (w1 + 1)));
        let w2 = c * w1;

        let hi0 = (w2 - 1) / (w2 + 1);
        hi0 = Math.atan(hi0 / Math.sqrt(1 - hi0 ** 2));
        let g = 2 * raza * k0 * Math.tan(Math.PI / 4 - hi0 / 2);
        let h = 4 * raza * k0 * Math.tan(hi0) + g;
        let fn = 500000;
        let fe = 500000;

        let ii = Math.atan((East - fe) / (h + (North - fn)));
        let j = Math.atan((East - fe) / (g - (North - fn))) - ii;
        let lam = j + 2 * ii + la0;
        this.La = la0 + (lam - la0) / n;
        let hi =
            hi0 +
            2 *
                Math.atan(
                    (North - fn - (East - fe) * Math.tan(j / 2)) /
                        (2 * raza * k0)
                );
        let csi =
            (0.5 * Math.log((1 + Math.sin(hi)) / (c * (1 - Math.sin(hi))))) / n;
        this.Fi = 2 * Math.atan(Math.exp(csi)) - Math.PI / 2;
        let i = 0;
        let tol = 0.000001;
        let dif = 100;
        while (dif > tol && i < 50) {
            i += 1;
            let fic = this.Fi;
            let csii = Math.log(
                Math.tan(this.Fi / 2 + Math.PI / 4) *
                    Math.exp(
                        (ep / 2) *
                            Math.log(
                                (1 - ep * Math.sin(this.Fi)) /
                                    (1 + ep * Math.sin(this.Fi))
                            )
                    )
            );
            this.Fi =
                this.Fi -
                ((csii - csi) *
                    Math.cos(this.Fi) *
                    (1 - ep ** 2 * Math.sin(this.Fi) ** 2)) /
                    (1 - ep ** 2);
            dif = Math.abs(
                (this.Fi * 180 * 60 * 60) / Math.PI -
                    (fic * 180 * 60 * 60) / Math.PI
            );
        }
        return { Fi: this.Fi, La: this.La };
    }
}
