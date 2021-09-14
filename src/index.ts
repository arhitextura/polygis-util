import { StereoToETRS89 } from "./modules/StereoToETRS89";
try {
    let conversion: StereoToETRS89 = new StereoToETRS89(500000, 500000);
    console.log(conversion.Phi.toFixed(6));
    console.log(conversion.La.toFixed(6));
} catch (e) {
    console.log(e);
}
