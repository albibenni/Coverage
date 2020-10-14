
const radius = 500;

class Coverage {
    constructor() {

    }
    //trasforma angoli da Radianti a Gradi
    toGrad(angoloRad) {
        return angoloRad * 180 / Math.PI;
    }

    //calcola l'area del segmento circolare
    segCircolare(distanzaP) {
        let areaSegCirc;
        if (distanzaP<1000) {
            const hTriang = radius - ((2 * radius - distanzaP) / 2);
            const radiansHandIpo = Math.acos(hTriang / radius);
            const gradHandIpo = this.toGrad(radiansHandIpo);
            const angCenter = gradHandIpo * 2;
            const areaSetCirc = radius * radius * Math.PI * angCenter / 360;
            const areaTriang = radius * hTriang * Math.sin(radiansHandIpo);
            areaSegCirc = (areaSetCirc - areaTriang)*2;
        } else
            areaSegCirc = 0;
        return areaSegCirc;
    }

}