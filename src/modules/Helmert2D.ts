export class Helmert2D {
    private tE: number;
    private tN: number;
    private dm: number;
    private Rz: number;
    private Eastt: number = 0;
    private Northt: number = 0;
    constructor(ctE: number, ctN: number, cdm: number, cRz: number) {
        this.tE = ctE;
        this.tN = ctN;
        this.dm = cdm;
        this.Rz = cRz;
    }
    DoTransformation(Easts: number, Norths: number) {
        let m = 1 + this.dm * 10 ** -6;
        this.Rz = (this.Rz * Math.PI) / (180 * 3600);
        this.Eastt =
            Easts * m * Math.cos(this.Rz) -
            Norths * m * Math.sin(this.Rz) +
            this.tE;
        this.Northt =
            Norths * m * Math.cos(this.Rz) +
            Easts * m * Math.sin(this.Rz) +
            this.tN;
        return { Eastt: this.Eastt, Northt: this.Northt };
    }
}
