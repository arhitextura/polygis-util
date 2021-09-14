export class DefaultValues {
    static NameFilegrdz: string = "EGG97_QGRJ.GRD";
    static NameFilegrd_R: string = "ETRS89_KRASOVSCHI42_2DJ.GRD";
    static NameFilegrd_B: string = "ETRS89_Stereo30_2DJ.GRD";
    /*
     *     Grd files are Delphi binary files with the types:
     *    - double for EGG97_QGRJ.GRD
     *    - record for ETRS89_KRASOVSCHI42_2DJ.GRD and ETRS89_Stereo30_2DJ.GRD with
     *      a declaration like this:
     *        tnod=record
     *          dE, dN:real;
     *        end;
     *      Note: In Delphi, real=double.
     *    Each of the grid files has a header (minE, maxE, minN, maxN, stepE, stepN),
     *    and then the data records are writen consecutively in rows from lower left
     *    corner to the uper right corner starting with position 6 (positions 0..5
     *    are for header):
     *                size_N . . . . . . .  . .
     *                   .                    .
     *                   .                    .
     *                   6, 7, 8, . . . . . size_E
     *    For 2D grid files, the order is: dE1, dN1, dE2, dN2, etc.
     */

    //* Parameters of ellipsoid GRS80 *
    static A_ETRS89 = 6378137;
    static INV_F_ETRS89 = 298.257222101;

    //* Helmert 2D Transformation parameters:

    //* Oblique_Stereographic_GRS80 to Stereografic 1970 *
    static tE_OS_St70 = 119.7358; //{translation in direction of East in meters}
    static tN_OS_St70 = 31.8051; //{translation in direction of North in meters}
    static dm_OS_St70 = 0.11559991; //{scale parameter in ppm (scale m = 1+dm*1e-6)}
    static Rz_OS_St70 = -0.22739706; //{rotation around z axis in seconds ('')}

    //* Stereografic 1970 to Oblique_Stereographic_GRS80 *
    static tE_St70_OS = -119.7358; //{translation in direction of East in meters}
    static tN_St70_OS = -31.8051; //{translation in direction of North in meters}
    static dm_St70_OS = -0.11559991; //{scale parameter in ppm (scale m = 1+dm*1e-6)}
    static Rz_St70_OS = 0.22739706; //{rotation around z axis in seconds ('')}

    //* Oblique_Stereographic_GRS80 to Stereografic 1930 *
    static tE_OS_St30 = -32701.361; //{translation in direction of East in meters}
    static tN_OS_St30 = 13962.1632; //{translation in direction of North in meters}
    static dm_OS_St30 = 13.97707176; //{scale parameter in ppm (scale m = 1+dm*1e-6)}
    static Rz_OS_St30 = -1006.26886396; //{rotation around z axis in seconds ('')}

    //* Stereografic 1930 to Oblique_Stereographic_GRS80 *
    static tE_St30_OS = 32768.6284; //{translation in direction of East in meters}
    static tN_St30_OS = -13802.2702; //{translation in direction of North in meters}
    static dm_St30_OS = -13.97689927; //{scale parameter in ppm (scale m = 1+dm*1e-6)}
    static Rz_St30_OS = 1006.26886393; //{rotation around z axis in seconds ('')}
}
